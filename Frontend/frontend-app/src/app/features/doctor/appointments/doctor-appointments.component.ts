import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService, AppointmentResponseDto, MedicalReportDto } from '../services/doctor.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-doctor-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-appointments.component.html',
  styleUrl: './doctor-appointments.component.css'
})
export class DoctorAppointmentsComponent implements OnInit {
  appointments: AppointmentResponseDto[] = [];
  filteredAppointments: AppointmentResponseDto[] = [];
  loading = true;
  currentFilter = 'all';

  selectedAppointment: AppointmentResponseDto | null = null;
  showReportModal = false;

  medicalReport: MedicalReportDto = {
    bloodType: '',
    pastIllnesses: '',
    surgeries: '',
    allergies: '',
    chronic: '',
    doctorNote: ''
  };

  constructor(private doctorService: DoctorService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.loading = true;
    this.doctorService.getMyAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        this.applyFilter(this.currentFilter);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading appointments', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(filter: string): void {
    this.currentFilter = filter;
    if (filter === 'all') {
      this.filteredAppointments = this.appointments;
    } else {
      this.filteredAppointments = this.appointments.filter(a => a.status === filter.toUpperCase());
    }
  }

  openCompleteModal(appointment: AppointmentResponseDto): void {
    this.selectedAppointment = appointment;
    this.showReportModal = true;
    // Reset form
    this.medicalReport = {
      bloodType: '',
      pastIllnesses: '',
      surgeries: '',
      allergies: '',
      chronic: '',
      doctorNote: ''
    };
  }

  closeCompleteModal(): void {
    this.showReportModal = false;
    this.selectedAppointment = null;
  }

  submitReport(): void {
    if (this.selectedAppointment) {
      this.doctorService.completeAppointment(this.selectedAppointment.id, this.medicalReport).subscribe({
        next: (completedAppointment: AppointmentResponseDto) => {
          alert('Appointment completed successfully');
          this.generatePDF(completedAppointment);
          this.closeCompleteModal();
          this.loadAppointments();
        },
        error: (err) => {
          console.error('Error completing appointment', err);
          alert('Failed to complete appointment');
        }
      });
    }
  }

  generatePDF(appointment: AppointmentResponseDto): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(41, 128, 185); // Blue
    doc.text('DocLine Medical Report', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, 35);

    // Doctor Info
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text('Doctor Information', 20, 50);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Name: ${appointment.doctorName}`, 20, 60);
    doc.text(`Speciality: ${appointment.doctorSpeciality}`, 20, 68);

    // Patient Info
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Patient Information', 20, 85);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Name: ${appointment.patientName}`, 20, 95);

    // Use optional chaining just in case fields are missing
    if (appointment.patientBloodType) doc.text(`Blood Type: ${appointment.patientBloodType}`, 20, 103);

    // Medical Details
    let yPos = 120;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Medical Assessment', 20, yPos);
    yPos += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    const fields = [
      { label: 'Past Illnesses', value: appointment.patientPastIllnesses },
      { label: 'Surgeries', value: appointment.patientSurgeries },
      { label: 'Allergies', value: appointment.patientAllergies },
      { label: 'Chronic Conditions', value: appointment.patientChronic },
      { label: 'Doctor Notes', value: appointment.doctorNote }
    ];

    fields.forEach(field => {
      if (field.value) {
        doc.setFont('helvetica', 'bold');
        doc.text(`${field.label}:`, 20, yPos);
        doc.setFont('helvetica', 'normal');

        // Handle multiline text
        const splitText = doc.splitTextToSize(field.value, pageWidth - 40);
        doc.text(splitText, 20, yPos + 7);
        yPos += 10 + (splitText.length * 5);
      }
    });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('Generated by DocLine System', pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });

    doc.save(`Medical_Report_${appointment.patientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}

