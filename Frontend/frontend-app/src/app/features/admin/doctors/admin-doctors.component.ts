import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, Doctor } from '../services/admin.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
    selector: 'app-admin-doctors',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-doctors.component.html',
    styleUrl: './admin-doctors.component.css'
})
export class AdminDoctorsComponent implements OnInit {
    doctors: Doctor[] = [];
    filteredDoctors: Doctor[] = [];
    loading = true;
    currentFilter: string = 'all';
    selectedDoctor: Doctor | null = null;
    showDetailsModal = false;

    constructor(
        private adminService: AdminService,
        private cdr: ChangeDetectorRef,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.loadDoctors();
    }

    loadDoctors() {
        this.loading = true;
        this.cdr.detectChanges();
        this.adminService.getAllDoctors().subscribe({
            next: (data) => {
                this.doctors = data;
                this.applyFilter(this.currentFilter);
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading doctors', err);
                this.notificationService.error('Failed', 'Failed to load doctors');
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    applyFilter(filter: string) {
        this.currentFilter = filter;
        if (filter === 'all') {
            this.filteredDoctors = this.doctors;
        } else if (filter === 'pending') {
            this.filteredDoctors = this.doctors.filter(d => d.status === 'PENDING_VERIFICATION');
        } else if (filter === 'active') {
            this.filteredDoctors = this.doctors.filter(d => d.status === 'ACTIVE');
        } else if (filter === 'suspended') {
            this.filteredDoctors = this.doctors.filter(d => d.status === 'SUSPENDED');
        } else if (filter === 'rejected') {
            this.filteredDoctors = this.doctors.filter(d => d.status === 'REJECTED');
        }
        this.cdr.detectChanges();
    }

    viewDetails(doctor: Doctor) {
        this.selectedDoctor = doctor;
        this.showDetailsModal = true;
    }

    closeModal() {
        this.showDetailsModal = false;
        this.selectedDoctor = null;
    }

    approveDoctor(doctorId: number) {
        if (confirm('Are you sure you want to approve this doctor?')) {
            this.adminService.approveDoctor(doctorId).subscribe({
                next: () => {
                    this.notificationService.success('Doctor Approved', 'Doctor has been approved successfully');
                    this.loadDoctors();
                    this.closeModal();
                },
                error: (err) => {
                    console.error('Error approving doctor', err);
                    this.notificationService.error('Failed', 'Failed to approve doctor');
                }
            });
        }
    }

    rejectDoctor(doctorId: number) {
        if (confirm('Are you sure you want to reject this doctor?')) {
            this.adminService.rejectDoctor(doctorId).subscribe({
                next: () => {
                    this.notificationService.success('Doctor Rejected', 'Doctor has been rejected');
                    this.loadDoctors();
                    this.closeModal();
                },
                error: (err) => {
                    console.error('Error rejecting doctor', err);
                    this.notificationService.error('Failed', 'Failed to reject doctor');
                }
            });
        }
    }

    suspendDoctor(doctorId: number) {
        if (confirm('Are you sure you want to toggle the suspension status of this doctor?')) {
            this.adminService.suspendDoctor(doctorId).subscribe({
                next: () => {
                    this.notificationService.success('Status Updated', 'Doctor suspension status has been updated');
                    this.loadDoctors();
                    this.closeModal();
                },
                error: (err) => {
                    console.error('Error suspending doctor', err);
                    this.notificationService.error('Failed', 'Failed to update doctor status');
                }
            });
        }
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-800';
            case 'PENDING_VERIFICATION':
                return 'bg-yellow-100 text-yellow-800';
            case 'SUSPENDED':
                return 'bg-red-100 text-red-800';
            case 'REJECTED':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    getStatusLabel(status: string): string {
        switch (status) {
            case 'ACTIVE':
                return 'Active';
            case 'PENDING_VERIFICATION':
                return 'Pending';
            case 'SUSPENDED':
                return 'Suspended';
            case 'REJECTED':
                return 'Rejected';
            default:
                return status;
        }
    }
}
