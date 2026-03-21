import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { PatientService } from '../services/patient.service';

@Component({
    selector: 'app-patient-appointments',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './patient-appointments.component.html',
    styleUrl: './patient-appointments.component.css'
})
export class PatientAppointmentsComponent implements OnInit {
    doctorId: number | null = null;
    upcomingAppointments: any[] = [];
    pastAppointments: any[] = [];
    loading = true;
    activeTab: 'upcoming' | 'past' = 'upcoming';

    // Modal data
    showBookingModal = false;
    selectedDoctor: any = null;
    availableSlots: any[] = [];
    bookingData = {
        selectedDate: '',
        selectedTime: '',
        reason: ''
    };
    bookingLoading = false;
    slotsLoading = false;

    constructor(
        private route: ActivatedRoute,
        private patientService: PatientService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadAppointments();

        this.route.queryParams.subscribe(params => {
            if (params['doctorId']) {
                const doctorId = parseInt(params['doctorId']);
                console.log('Opening booking modal for doctor:', doctorId);
                this.openBookingModal(doctorId);
            }
        });
    }

    loadAppointments(): void {
        this.loading = true;
        this.cdr.detectChanges();

        // Mock data for now - will be replaced with actual API calls
        this.upcomingAppointments = [
            {
                id: 1,
                doctorName: 'Dr. John Smith',
                speciality: 'Cardiology',
                date: '2026-03-25',
                time: '10:00 AM',
                reason: 'Heart checkup',
                status: 'CONFIRMED'
            },
            {
                id: 2,
                doctorName: 'Dr. Sarah Johnson',
                speciality: 'Dermatology',
                date: '2026-03-28',
                time: '2:30 PM',
                reason: 'Skin consultation',
                status: 'PENDING'
            }
        ];

        this.pastAppointments = [
            {
                id: 3,
                doctorName: 'Dr. Michael Brown',
                speciality: 'Orthopedics',
                date: '2026-03-10',
                time: '11:00 AM',
                reason: 'Knee pain consultation',
                status: 'COMPLETED'
            },
            {
                id: 4,
                doctorName: 'Dr. Emily Davis',
                speciality: 'General Practice',
                date: '2026-03-05',
                time: '3:00 PM',
                reason: 'General checkup',
                status: 'COMPLETED'
            }
        ];

        this.loading = false;
        this.cdr.detectChanges();
    }

    openBookingModal(doctorId: number): void {
        console.log('openBookingModal called with doctorId:', doctorId);
        // Mock doctor data - will be fetched from backend
        this.selectedDoctor = {
            id: doctorId,
            name: 'Dr. John Smith',
            speciality: 'Cardiology',
            fees: 150
        };
        this.showBookingModal = true;
        this.resetBookingForm();
        console.log('Modal opened, showBookingModal:', this.showBookingModal);
        this.cdr.detectChanges();
    }

    closeBookingModal(): void {
        this.showBookingModal = false;
        this.resetBookingForm();
        this.cdr.detectChanges();
    }

    resetBookingForm(): void {
        this.bookingData = {
            selectedDate: '',
            selectedTime: '',
            reason: ''
        };
        this.availableSlots = [];
    }

    onDateSelected(): void {
        if (!this.bookingData.selectedDate) return;

        this.slotsLoading = true;
        this.availableSlots = [];
        this.bookingData.selectedTime = '';
        this.cdr.detectChanges();

        // Mock available slots - will call backend API
        setTimeout(() => {
            this.availableSlots = [
                { time: '09:00 AM', available: true },
                { time: '09:30 AM', available: true },
                { time: '10:00 AM', available: false },
                { time: '10:30 AM', available: true },
                { time: '11:00 AM', available: true },
                { time: '11:30 AM', available: true },
                { time: '12:00 PM', available: false }
            ];
            this.slotsLoading = false;
            this.cdr.detectChanges();
        }, 500);
    }

    bookAppointment(): void {
        if (!this.bookingData.selectedDate || !this.bookingData.selectedTime || !this.bookingData.reason) {
            alert('Please fill in all fields');
            return;
        }

        this.bookingLoading = true;
        this.cdr.detectChanges();

        const appointmentData = {
            doctorId: this.selectedDoctor.id,
            date: this.bookingData.selectedDate,
            time: this.bookingData.selectedTime,
            reason: this.bookingData.reason
        };

        // Call API to book appointment
        this.patientService.bookAppointment(appointmentData).subscribe({
            next: (response) => {
                console.log('Appointment booked:', response);
                this.bookingLoading = false;
                alert('✅ Appointment booked successfully!');
                this.closeBookingModal();
                this.loadAppointments();
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error booking appointment:', err);
                this.bookingLoading = false;
                alert('❌ Failed to book appointment');
                this.cdr.detectChanges();
            }
        });
    }

    switchTab(tab: 'upcoming' | 'past'): void {
        this.activeTab = tab;
        this.cdr.detectChanges();
    }

    cancelAppointment(appointment: any): void {
        if (confirm(`Are you sure you want to cancel the appointment with ${appointment.doctorName}?`)) {
            // Call API to cancel appointment
            console.log('Cancelling appointment:', appointment.id);
        }
    }

    rescheduleAppointment(appointment: any): void {
        // Open modal to reschedule
        this.openBookingModal(appointment.id);
    }

    getStatusColor(status: string): string {
        switch(status) {
            case 'CONFIRMED':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'COMPLETED':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    }

    getStatusIcon(status: string): string {
        switch(status) {
            case 'CONFIRMED':
                return '✅';
            case 'PENDING':
                return '⏳';
            case 'COMPLETED':
                return '✓';
            case 'CANCELLED':
                return '❌';
            default:
                return '❓';
        }
    }

    // Helper to get minimum date (today)
    getMinDate(): string {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    // Helper to get maximum date (90 days from now)
    getMaxDate(): string {
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 90);
        return maxDate.toISOString().split('T')[0];
    }
}

