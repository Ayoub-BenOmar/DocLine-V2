import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService, DoctorProfileDto, AppointmentResponseDto, UnavailabilityDto, MedicalReportDto } from '../services/doctor.service';
import { NotificationService } from '../../../core/services/notification.service';

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

  totalAppointments = 0;
  pendingCount = 0;
  completedCount = 0;

  constructor(
    private doctorService: DoctorService,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService
  ) {}

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
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading profile', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadAppointments(): void {
    this.doctorService.getMyAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.calculateStats();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading appointments', err);
        this.cdr.detectChanges();
      }
    });
  }

  calculateStats(): void {
    this.totalAppointments = this.appointments.length;
    this.pendingCount = this.appointments.filter(a => a.status === 'PENDING').length;
    this.completedCount = this.appointments.filter(a => a.status === 'COMPLETED').length;
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }

  loadUnavailabilities(): void {
    this.doctorService.getMyUnavailabilities().subscribe({
      next: (unavailabilities) => {
        this.unavailabilities = unavailabilities;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading unavailabilities', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  addUnavailability(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(this.newUnavailability.startDate);
    const endDate = new Date(this.newUnavailability.endDate);

    if (startDate < today) {
      this.notificationService.error('Invalid Date', 'Start date cannot be in the past');
      return;
    }

    if (endDate < startDate) {
      this.notificationService.error('Invalid Date', 'End date cannot be before start date');
      return;
    }

    this.doctorService.addUnavailability(this.newUnavailability).subscribe({
      next: () => {
        this.loadUnavailabilities();
        this.newUnavailability = { startDate: '', endDate: '', reason: '' };
        this.notificationService.success('Unavailability Added', 'Your unavailability period has been recorded');
      },
      error: (err) => {
        console.error('Error adding unavailability', err);
        const errorMsg = err.error?.message || err.error || 'Failed to add unavailability';
        this.notificationService.error('Failed to Add', errorMsg);
      }
    });
  }

  openCompleteModal(appointment: AppointmentResponseDto): void {
    this.selectedAppointment = appointment;
    this.showReportModal = true;
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
          this.notificationService.success('Appointment Completed', 'Medical report has been saved successfully');
          this.closeCompleteModal();
          this.loadAppointments();
        },
        error: (err) => {
          console.error('Error completing appointment', err);
          this.notificationService.error('Failed', 'Failed to complete appointment');
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

