import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, Patient } from '../services/admin.service';
import { NotificationService } from '../../../core/services/notification.service';

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

    constructor(
        private adminService: AdminService,
        private cdr: ChangeDetectorRef,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.loadPatients();
    }

    loadPatients() {
        this.loading = true;
        this.cdr.detectChanges();
        this.adminService.getAllPatients().subscribe({
            next: (data) => {
                this.patients = data;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading patients', err);
                this.notificationService.error('Failed', 'Failed to load patients');
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    suspendPatient(patient: Patient): void {
        const action = patient.status === 'SUSPENDED' ? 'unsuspend' : 'suspend';
        if (confirm(`Are you sure you want to ${action} ${patient.name} ${patient.lastName}?`)) {
            this.adminService.suspendPatient(patient.id).subscribe({
                next: () => {
                    patient.status = patient.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
                    this.cdr.detectChanges();
                    const message = patient.status === 'SUSPENDED'
                        ? 'Patient has been suspended'
                        : 'Patient has been activated';
                    this.notificationService.success('Status Updated', message);
                },
                error: (err) => {
                    console.error('Error suspending patient:', err);
                    this.notificationService.error('Failed', 'Failed to update patient status');
                }
            });
        }
    }
}
