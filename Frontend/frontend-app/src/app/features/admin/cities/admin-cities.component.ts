import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, City } from '../services/admin.service';

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
    message = '';
    messageType: 'success' | 'error' = 'success';
    addingCity = false;

    constructor(private adminService: AdminService, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.loadCities();
    }

    loadCities(): void {
        this.loading = true;
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
            this.showMessage('❌ Please enter a city name', 'error');
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
                this.showMessage('✅ City added successfully!', 'success');
            },
            error: (err) => {
                console.error('Error adding city:', err);
                this.addingCity = false;
                this.cdr.detectChanges();
                this.showMessage('❌ Failed to add city', 'error');
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
            this.showMessage('❌ City name cannot be empty', 'error');
            return;
        }

        const updatedCity: City = { ...city, cityName: this.editingName };
        this.adminService.updateCity(city.id!, updatedCity).subscribe({
            next: () => {
                city.cityName = this.editingName;
                this.editingId = null;
                this.cdr.detectChanges();
                this.showMessage('✅ City updated successfully', 'success');
            },
            error: (err) => {
                console.error('Error updating city:', err);
                this.cdr.detectChanges();
                this.showMessage('❌ Failed to update city', 'error');
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
                    this.showMessage('✅ City deleted successfully', 'success');
                },
                error: (err) => {
                    console.error('Error deleting city:', err);
                    this.cdr.detectChanges();
                    this.showMessage('❌ Failed to delete city', 'error');
                }
            });
        }
    }

    private showMessage(msg: string, type: 'success' | 'error'): void {
        this.message = msg;
        this.messageType = type;
        this.cdr.detectChanges();
        setTimeout(() => {
            this.message = '';
            this.cdr.detectChanges();
        }, 4000);
    }
}

