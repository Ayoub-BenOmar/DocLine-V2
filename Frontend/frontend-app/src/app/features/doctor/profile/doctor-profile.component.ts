import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService, DoctorProfileDto } from '../services/doctor.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

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
    experience: 0
  };

  cities: any[] = [];
  specialities: any[] = [];
  loading = true;
  saving = false;

  constructor(
      private doctorService: DoctorService,
      private authService: AuthService,
      private cdr: ChangeDetectorRef,
      private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadFormData();
  }

  loadFormData(): void {
      this.authService.getCities().subscribe(data => {
        this.cities = data;
        this.cdr.detectChanges();
      });
      this.authService.getSpecialities().subscribe(data => {
        this.specialities = data;
        this.cdr.detectChanges();
      });
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
    this.cdr.detectChanges();
    this.doctorService.updateProfile(this.profile).subscribe({
      next: (data) => {
        this.profile = data;
        this.notificationService.success('Profile Updated', 'Your profile has been updated successfully');
        this.saving = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error updating profile', err);
        this.notificationService.error('Update Failed', 'Failed to update profile. Please try again.');
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }
}
