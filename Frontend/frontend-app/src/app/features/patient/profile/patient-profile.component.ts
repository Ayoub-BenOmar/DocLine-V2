import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../services/patient.service';

@Component({
    selector: 'app-patient-profile',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './patient-profile.component.html',
    styleUrl: './patient-profile.component.css'
})
export class PatientProfileComponent implements OnInit {
    profile: any = null;
    cities: any[] = [];
    editMode = false;
    loading = true;
    saving = false;
    message = '';
    messageType: 'success' | 'error' = 'success';

    formData = {
        name: '',
        lastName: '',
        email: '',
        phone: '',
        birthdate: '',
        gender: '',
        cin: '',
        address: '',
        cityId: null,
        insuranceProvider: '',
        insuranceNumber: '',
        hasInsurance: false,
        bloodType: '',
        profilePic: ''
    };

    constructor(private patientService: PatientService, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.loadProfile();
    }

    loadProfile(): void {
        this.loading = true;
        this.patientService.getProfile().subscribe({
            next: (data) => {
                console.log('Profile loaded:', data);
                this.profile = data;
                this.populateForm();
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading profile:', err);
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    populateForm(): void {
        if (this.profile) {
            this.formData = {
                name: this.profile.name || '',
                lastName: this.profile.lastName || '',
                email: this.profile.email || '',
                phone: this.profile.phone || '',
                birthdate: this.profile.birthdate || '',
                gender: this.profile.gender || '',
                cin: this.profile.cin || '',
                address: this.profile.address || '',
                cityId: this.profile.cityId || null,
                insuranceProvider: this.profile.insuranceProvider || '',
                insuranceNumber: this.profile.insuranceNumber || '',
                hasInsurance: this.profile.hasInsurance || false,
                bloodType: this.profile.bloodType || '',
                profilePic: this.profile.profilePic || ''
            };
        }
    }

    toggleEditMode(): void {
        this.editMode = !this.editMode;
        if (!this.editMode) {
            this.populateForm();
        }
        this.cdr.detectChanges();
    }

    saveProfile(): void {
        this.saving = true;
        const updateDto = {
            name: this.formData.name,
            lastName: this.formData.lastName,
            phone: this.formData.phone,
            birthdate: this.formData.birthdate,
            gender: this.formData.gender,
            cin: this.formData.cin,
            address: this.formData.address,
            cityId: this.formData.cityId,
            insuranceProvider: this.formData.insuranceProvider,
            insuranceNumber: this.formData.insuranceNumber,
            hasInsurance: this.formData.hasInsurance
        };

        this.patientService.updateProfile(updateDto).subscribe({
            next: (data) => {
                console.log('Profile updated:', data);
                this.profile = data;
                this.populateForm();
                this.editMode = false;
                this.saving = false;
                this.showMessage('✅ Profile updated successfully', 'success');
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error updating profile:', err);
                this.saving = false;
                this.showMessage('❌ Failed to update profile', 'error');
                this.cdr.detectChanges();
            }
        });
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
