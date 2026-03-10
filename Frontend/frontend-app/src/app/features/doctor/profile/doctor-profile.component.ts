import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService, DoctorProfileDto } from '../services/doctor.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-profile.component.html',
  styleUrl: './doctor-profile.component.css'
})
export class DoctorProfileComponent implements OnInit {
  profile: DoctorProfileDto = {
    name: '',
    lastName: '',
    email: '',
    phone: '',
    profilePic: '',
    cityId: 0,
    specialityId: 0,
    fees: 0,
    bio: '',
    officeAddress: '',
    workingHours: ''
  };

  cities: any[] = [];
  specialities: any[] = [];
  loading = true;
  saving = false;

  constructor(
      private doctorService: DoctorService,
      private authService: AuthService,
      private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadFormData();
  }

  loadFormData(): void {
      this.authService.getCities().subscribe(data => this.cities = data);
      this.authService.getSpecialities().subscribe(data => this.specialities = data);
  }

  loadProfile(): void {
    this.loading = true;
    this.doctorService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading profile', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  saveProfile(): void {
    this.saving = true;
    this.doctorService.updateProfile(this.profile).subscribe({
      next: () => {
        alert('Profile updated successfully');
        this.saving = false;
      },
      error: (err) => {
        console.error('Error updating profile', err);
        alert('Failed to update profile');
        this.saving = false;
      }
    });
  }
}
