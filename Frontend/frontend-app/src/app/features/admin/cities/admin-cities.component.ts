import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, City } from '../services/admin.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
    selector: 'app-admin-cities',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin-cities.component.html',
    styleUrl: './admin-cities.component.css'
})
export class AdminCitiesComponent implements OnInit {
    cities: City[] = [];
    newCityName = '';
    editingId: number | null = null;
    editingName = '';

    loading = true;
    error = '';
    addingCity = false;

    constructor(
        private adminService: AdminService,
        private cdr: ChangeDetectorRef,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.loadCities();
    }

    loadCities(): void {
        this.loading = true;
        this.cdr.detectChanges();
        this.adminService.getAllCities().subscribe({
            next: (data) => {
                this.cities = data;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading cities:', err);
                this.error = 'Failed to load cities';
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    addCity(): void {
        if (!this.newCityName.trim()) {
            this.notificationService.warning('Invalid Input', 'Please enter a city name');
            return;
        }

        this.addingCity = true;
        const newCity: City = { cityName: this.newCityName };

        this.adminService.addCity(newCity).subscribe({
            next: (response) => {
                this.cities.push(response);
                this.newCityName = '';
                this.addingCity = false;
                this.cdr.detectChanges();
                this.notificationService.success('City Added', 'City has been added successfully');
            },
            error: (err) => {
                console.error('Error adding city:', err);
                this.addingCity = false;
                this.cdr.detectChanges();
                this.notificationService.error('Failed', 'Failed to add city');
            }
        });
    }

    startEdit(city: City): void {
        this.editingId = city.id ?? null;
        this.editingName = city.cityName;
        this.cdr.detectChanges();
    }

    cancelEdit(): void {
        this.editingId = null;
        this.editingName = '';
        this.cdr.detectChanges();
    }

    saveEdit(city: City): void {
        if (!this.editingName.trim()) {
            this.notificationService.warning('Invalid Input', 'City name cannot be empty');
            return;
        }

        const updatedCity: City = { ...city, cityName: this.editingName };
        this.adminService.updateCity(city.id!, updatedCity).subscribe({
            next: () => {
                city.cityName = this.editingName;
                this.editingId = null;
                this.cdr.detectChanges();
                this.notificationService.success('City Updated', 'City has been updated successfully');
            },
            error: (err) => {
                console.error('Error updating city:', err);
                this.cdr.detectChanges();
                this.notificationService.error('Failed', 'Failed to update city');
            }
        });
    }

    deleteCity(city: City): void {
        if (confirm(`Are you sure you want to delete "${city.cityName}"?`)) {
            this.adminService.deleteCity(city.id!).subscribe({
                next: () => {
                    const index = this.cities.indexOf(city);
                    if (index > -1) {
                        this.cities.splice(index, 1);
                    }
                    this.cdr.detectChanges();
                    this.notificationService.success('City Deleted', 'City has been deleted successfully');
                },
                error: (err) => {
                    console.error('Error deleting city:', err);
                    this.cdr.detectChanges();
                    this.notificationService.error('Failed', 'Failed to delete city');
                }
            });
        }
    }
}
