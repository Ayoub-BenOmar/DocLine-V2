import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService, AppointmentResponseDto, MedicalReportDto } from '../services/doctor.service';

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
        next: () => {
          alert('Appointment completed successfully');
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

