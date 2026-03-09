import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService, DoctorProfileDto, AppointmentResponseDto, UnavailabilityDto, MedicalReportDto } from '../services/doctor.service';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.css'
})
export class DoctorDashboardComponent implements OnInit {
  profile: DoctorProfileDto | null = null;
  appointments: AppointmentResponseDto[] = [];
  unavailabilities: any[] = [];

  newUnavailability: UnavailabilityDto = {
    startDate: '',
    endDate: '',
    reason: ''
  };

  selectedAppointment: AppointmentResponseDto | null = null;
  medicalReport: MedicalReportDto = {
    bloodType: '',
    pastIllnesses: '',
    surgeries: '',
    allergies: '',
    chronic: '',
    doctorNote: ''
  };

  showReportModal = false;
  loading = true;

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.doctorService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.loadAppointments();
        this.loadUnavailabilities();
      },
      error: (err) => {
        console.error('Error loading profile', err);
        this.loading = false;
      }
    });
  }

  loadAppointments(): void {
    this.doctorService.getMyAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
      },
      error: (err) => console.error('Error loading appointments', err)
    });
  }

  loadUnavailabilities(): void {
    this.doctorService.getMyUnavailabilities().subscribe({
      next: (unavailabilities) => {
        this.unavailabilities = unavailabilities;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading unavailabilities', err);
        this.loading = false;
      }
    });
  }

  addUnavailability(): void {
    this.doctorService.addUnavailability(this.newUnavailability).subscribe({
      next: () => {
        this.loadUnavailabilities();
        this.newUnavailability = { startDate: '', endDate: '', reason: '' }; // Reset form
        alert('Unavailability added successfully');
      },
      error: (err) => {
        console.error('Error adding unavailability', err);
        alert('Failed to add unavailability');
      }
    });
  }

  openCompleteModal(appointment: AppointmentResponseDto): void {
    this.selectedAppointment = appointment;
    this.showReportModal = true;
    // Reset report form
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
          this.loadAppointments(); // Refresh list to update status
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

