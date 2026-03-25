import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, City, Specialty } from '../services/admin.service';

interface CityStatistic {
    cityName: string;
    doctorCount: number;
}

interface SpecialtyStatistic {
    specialiteName: string;
    doctorCount: number;
}

@Component({
    selector: 'app-admin-statistics',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-statistics.component.html',
    styleUrl: './admin-statistics.component.css'
})
export class AdminStatisticsComponent implements OnInit {
    cities: City[] = [];
    specialties: Specialty[] = [];
    cityStatistics: CityStatistic[] = [];
    specialtyStatistics: SpecialtyStatistic[] = [];

    loading = true;
    error = '';

    private cityStatsLoaded = false;
    private specialtyStatsLoaded = false;

    constructor(private adminService: AdminService, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.loadStatistics();
    }

    loadStatistics(): void {
        this.loading = true;
        this.error = '';
        this.cityStatsLoaded = false;
        this.specialtyStatsLoaded = false;
        this.cdr.detectChanges();

        this.adminService.getAllCities().subscribe({
            next: (cities) => {
                this.cities = cities;
                this.cdr.detectChanges();
                this.loadCityStats();
            },
            error: (err) => {
                console.error('Error loading cities:', err);
                this.error = 'Failed to load cities';
                this.loading = false;
                this.cdr.detectChanges();
            }
        });

        this.adminService.getAllSpecialties().subscribe({
            next: (specialties) => {
                this.specialties = specialties;
                this.cdr.detectChanges();
                this.loadSpecialtyStats();
            },
            error: (err) => {
                console.error('Error loading specialties:', err);
                this.error = 'Failed to load specialties';
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    loadCityStats(): void {
        this.adminService.getCityStatistics().subscribe({
            next: (stats) => {
                this.cityStatistics = stats.sort((a, b) => b.doctorCount - a.doctorCount);
                this.cityStatsLoaded = true;
                this.cdr.detectChanges();
                this.checkLoadingComplete();
            },
            error: (err) => {
                console.error('Error loading city statistics:', err);
                this.cityStatistics = [];
                this.cityStatsLoaded = true;
                this.cdr.detectChanges();
                this.checkLoadingComplete();
            }
        });
    }

    loadSpecialtyStats(): void {
        this.adminService.getSpecialtyStatistics().subscribe({
            next: (stats) => {
                this.specialtyStatistics = stats.sort((a, b) => b.doctorCount - a.doctorCount);
                this.specialtyStatsLoaded = true;
                this.cdr.detectChanges();
                this.checkLoadingComplete();
            },
            error: (err) => {
                console.error('Error loading specialty statistics:', err);
                this.specialtyStatistics = [];
                this.specialtyStatsLoaded = true;
                this.cdr.detectChanges();
                this.checkLoadingComplete();
            }
        });
    }

    private checkLoadingComplete(): void {
        if (this.cityStatsLoaded && this.specialtyStatsLoaded) {
            this.loading = false;
            this.cdr.detectChanges();
        }
    }

    getTopCities(): CityStatistic[] {
        return this.cityStatistics.slice(0, 3);
    }

    getTopSpecialties(): SpecialtyStatistic[] {
        return this.specialtyStatistics.slice(0, 3);
    }

    getTotalDoctorsInCity(cityName: string): number {
        const stat = this.cityStatistics.find(s => s.cityName === cityName);
        return stat ? stat.doctorCount : 0;
    }

    getTotalDoctorsInSpecialty(specialtyName: string): number {
        const stat = this.specialtyStatistics.find(s => s.specialiteName === specialtyName);
        return stat ? stat.doctorCount : 0;
    }
}
