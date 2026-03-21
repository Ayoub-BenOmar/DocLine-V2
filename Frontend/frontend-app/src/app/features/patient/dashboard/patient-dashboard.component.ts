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
                this.upcomingAppointments = appointments.filter((apt: any) => new Date(apt.dateTime) >= now).slice(0, 3);
                this.pastAppointments = appointments.filter((apt: any) => new Date(apt.dateTime) < now);
                this.totalAppointments = appointments.length;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading appointments:', err);
                this.upcomingAppointments = [];
                this.pastAppointments = [];
                this.totalAppointments = 0;
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }
}

