import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, Patient } from '../services/admin.service';

@Component({
    selector: 'app-admin-patients',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-patients.component.html',
    styleUrl: './admin-patients.component.css'
})
export class AdminPatientsComponent implements OnInit {
    patients: Patient[] = [];
    loading = true;

    constructor(private adminService: AdminService, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.loadPatients();
    }

    loadPatients() {
        this.adminService.getAllPatients().subscribe({
            next: (data) => {
                this.patients = data;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading patients', err);
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }
}
