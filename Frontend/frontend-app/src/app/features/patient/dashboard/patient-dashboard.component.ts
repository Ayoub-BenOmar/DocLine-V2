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
        // Appointments will be loaded from the backend when the service is ready
        // For now, showing placeholder data
        this.upcomingAppointments = [];
        this.pastAppointments = [];
        this.totalAppointments = 0;
        this.loading = false;
        this.cdr.detectChanges();
    }
}

