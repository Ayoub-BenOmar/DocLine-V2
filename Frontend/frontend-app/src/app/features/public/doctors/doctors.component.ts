import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { NavbarComponent } from '../navbar/navbar.component';
import { PublicService, City, Specialty, Doctor } from '../../../core/services/public.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-doctors',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
    templateUrl: './doctors.component.html',
    styleUrl: './doctors.component.css'
})
export class DoctorsComponent implements OnInit {
    doctors: Doctor[] = [];
    cities: City[] = [];
    specialties: Specialty[] = [];

    selectedCityId: number | null = null;
    selectedSpecialtyId: number | null = null;

    currentPage = 0;
    pageSize = 10;
    totalPages = 0;

    loading = true;
    isAuthenticated = false;
    userRole: string | null = null;

    constructor(
        private publicService: PublicService,
        private authService: AuthService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.checkAuth();
        this.loading = true;

        // Load cities, specialties, and doctors in parallel
        forkJoin({
            cities: this.publicService.getAllCities(),
            specialties: this.publicService.getAllSpecialties(),
            doctors: this.publicService.getAllDoctors(undefined, undefined, 0, this.pageSize)
        }).subscribe({
            next: (result) => {
                console.log('All data loaded successfully:', result);
                this.cities = result.cities;
                this.specialties = result.specialties;
                this.doctors = result.doctors.content;
                this.totalPages = result.doctors.totalPages;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading data:', err);
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    checkAuth(): void {
        this.isAuthenticated = this.authService.isAuthenticated();
        this.userRole = this.authService.getUserRole();
    }

    loadDoctors(): void {
        this.loading = true;
        console.log('Loading doctors with filters:', { cityId: this.selectedCityId, specialtyId: this.selectedSpecialtyId, page: this.currentPage });
        this.publicService.getAllDoctors(
            this.selectedCityId || undefined,
            this.selectedSpecialtyId || undefined,
            this.currentPage,
            this.pageSize
        ).subscribe({
            next: (data) => {
                console.log('Doctors loaded successfully:', data);
                this.doctors = data.content;
                this.totalPages = data.totalPages;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading doctors:', err);
                this.loading = false;
                this.doctors = [];
                this.cdr.detectChanges();
            }
        });
    }

    onFilterChange(): void {
        this.currentPage = 0;
        this.loadDoctors();
    }

    takeAppointment(doctor: Doctor): void {
        if (!this.isAuthenticated) {
            this.router.navigate(['/auth/login']);
            return;
        }

        if (this.userRole !== 'ROLE_PATIENT') {
            alert('Only patients can book appointments');
            return;
        }

        // Navigate to appointment booking for this doctor
        this.router.navigate(['/patient/appointments'], { queryParams: { doctorId: doctor.id } });
    }

    previousPage(): void {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.loadDoctors();
        }
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages - 1) {
            this.currentPage++;
            this.loadDoctors();
        }
    }
}

