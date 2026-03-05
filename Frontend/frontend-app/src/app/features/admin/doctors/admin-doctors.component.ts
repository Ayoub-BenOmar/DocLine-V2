import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, Doctor } from '../services/admin.service';

@Component({
    selector: 'app-admin-doctors',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-doctors.component.html',
    styleUrl: './admin-doctors.component.css'
})
export class AdminDoctorsComponent implements OnInit {
    doctors: Doctor[] = [];
    loading = true;

    constructor(private adminService: AdminService) { }

    ngOnInit(): void {
        this.loadDoctors();
    }

    loadDoctors() {
        this.adminService.getAllDoctors().subscribe({
            next: (data) => {
                this.doctors = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading doctors', err);
                this.loading = false;
            }
        });
    }
}
