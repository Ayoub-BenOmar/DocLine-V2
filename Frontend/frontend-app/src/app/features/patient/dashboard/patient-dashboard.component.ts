import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PatientService } from '../services/patient.service';

@Component({
    selector: 'app-patient-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './patient-dashboard.component.html',
    styleUrl: './patient-dashboard.component.css'
})
export class PatientDashboardComponent implements OnInit {
    upcomingAppointments: any[] = [];
    pastAppointments: any[] = [];
    totalAppointments = 0;
    upcomingCount = 0;
    loading = true;

    constructor(private patientService: PatientService, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.loadDashboard();
    }

    loadDashboard(): void {
        this.loading = true;
        this.cdr.detectChanges();

        // Load appointments from backend
        this.patientService.getAppointments().subscribe({
            next: (appointments) => {
                console.log('Dashboard appointments loaded:', appointments);
                const now = new Date();

                // Parse dates for accurate comparison if needed, or use string comparison if ISO format

                // Categorize appointments
                const allUpcoming = appointments.filter((apt: any) =>
                    new Date(apt.dateTime) >= now && apt.status !== 'COMPLETED' && apt.status !== 'CANCELLED'
                );

                this.pastAppointments = appointments.filter((apt: any) =>
                    new Date(apt.dateTime) < now || apt.status === 'COMPLETED' || apt.status === 'CANCELLED'
                );

                // Set counts and display lists
                this.upcomingCount = allUpcoming.length;
                this.upcomingAppointments = allUpcoming.slice(0, 3); // Only show top 3 next
                this.totalAppointments = appointments.length;

                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading appointments:', err);
                this.upcomingAppointments = [];
                this.pastAppointments = [];
                this.totalAppointments = 0;
                this.upcomingCount = 0;
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }
}

