import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService, City, Specialty } from '../services/admin.service';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './admin-dashboard.component.html',
    styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
    newCity: City = { cityName: '' };
    newSpecialty: Specialty = { specialiteName: '' };

    addingCity = false;
    addingSpecialty = false;

    cityMessage = '';
    specialtyMessage = '';
    citySuccess = false;
    specialtySuccess = false;

    constructor(private adminService: AdminService) { }

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
