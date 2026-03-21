import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { PatientService } from '../services/patient.service';

@Component({
    selector: 'app-patient-appointments',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './patient-appointments.component.html',
    styleUrl: './patient-appointments.component.css'
})
export class PatientAppointmentsComponent implements OnInit {
    doctorId: number | null = null;
    upcomingAppointments: any[] = [];
    pastAppointments: any[] = [];
    loading = true;
    activeTab: 'upcoming' | 'past' = 'upcoming';

    constructor(
        private route: ActivatedRoute,
        private patientService: PatientService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            if (params['doctorId']) {
                this.doctorId = params['doctorId'];
            }
        });

        this.loadAppointments();
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
        // Navigate to booking page with doctor ID
        console.log('Rescheduling appointment with doctor:', appointment.id);
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
}

