import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService, City, Specialty, DashboardStatistics } from '../services/admin.service';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './admin-dashboard.component.html',
    styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
    newCity: City = { cityName: '' };
    newSpecialty: Specialty = { specialiteName: '' };

    addingCity = false;
    addingSpecialty = false;

    cityMessage = '';
    specialtyMessage = '';
    citySuccess = false;
    specialtySuccess = false;

    stats: DashboardStatistics | null = null;
    loadingStats = true;

    constructor(private adminService: AdminService, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.loadStats();
    }

    loadStats(): void {
        this.loadingStats = true;
        this.cdr.detectChanges();

        forkJoin({
            doctors: this.adminService.getAllDoctors(),
            patients: this.adminService.getAllPatients(),
            cities: this.adminService.getAllCities(),
            specialties: this.adminService.getAllSpecialties()
        }).subscribe({
            next: (results) => {
                const pending = results.doctors.filter(d => d.status === 'PENDING_VERIFICATION').slice(0, 3);
                this.stats = {
                    totalDoctors: results.doctors.length,
                    totalPatients: results.patients.length,
                    totalUsers: results.doctors.length + results.patients.length,
                    totalCities: results.cities.length,
                    totalSpecialties: results.specialties.length,
                    appointmentsToday: 0,
                    lastPendingDoctors: pending
                };
                this.loadingStats = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error fetching dashboard stats:', err);

                this.adminService.getDashboardStatistics().subscribe({
                    next: (data) => {
                        this.stats = data;
                        this.loadingStats = false;
                        this.cdr.detectChanges();
                    },
                    error: (err2) => {
                        console.error('Dashboard endpoint also failed:', err2);
                        this.loadingStats = false;
                        this.cdr.detectChanges();
                    }
                });
            }
        });
    }

    approveDoctor(doctorId: number): void {
        this.adminService.approveDoctor(doctorId).subscribe({
            next: () => {
                this.loadStats();
            },
            error: (err) => console.error('Error approving doctor:', err)
        });
    }

    rejectDoctor(doctorId: number): void {
        this.adminService.rejectDoctor(doctorId).subscribe({
            next: () => {
                this.loadStats();
            },
            error: (err) => console.error('Error rejecting doctor:', err)
        });
    }

    addCity(): void {
        if (!this.newCity.cityName.trim()) {
            this.cityMessage = '❌ Please enter a city name';
            this.citySuccess = false;
            return;
        }

        this.addingCity = true;
        this.adminService.addCity(this.newCity).subscribe({
            next: (response) => {
                console.log('City added:', response);
                this.cityMessage = '✅ City added successfully!';
                this.citySuccess = true;
                this.newCity = { cityName: '' };
                this.addingCity = false;
                setTimeout(() => this.cityMessage = '', 3000);
            },
            error: (err) => {
                console.error('Error adding city:', err);
                this.cityMessage = '❌ Failed to add city. Please try again.';
                this.citySuccess = false;
                this.addingCity = false;
            }
        });
    }

    addSpecialty(): void {
        if (!this.newSpecialty.specialiteName.trim()) {
            this.specialtyMessage = '❌ Please enter a specialty name';
            this.specialtySuccess = false;
            return;
        }

        this.addingSpecialty = true;
        this.adminService.addSpecialty(this.newSpecialty).subscribe({
            next: (response) => {
                console.log('Specialty added:', response);
                this.specialtyMessage = '✅ Specialty added successfully!';
                this.specialtySuccess = true;
                this.newSpecialty = { specialiteName: '' };
                this.addingSpecialty = false;
                setTimeout(() => this.specialtyMessage = '', 3000);
            },
            error: (err) => {
                console.error('Error adding specialty:', err);
                this.specialtyMessage = '❌ Failed to add specialty. Please try again.';
                this.specialtySuccess = false;
                this.addingSpecialty = false;
            }
        });
    }
}
