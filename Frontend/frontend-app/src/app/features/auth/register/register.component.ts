import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  userRole: string = 'patient';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  loading: boolean = false;
  currentBenefitIndex: number = 0;
  specialityId: string = '';
  cityId: string = '';
  medicalLicence: string = '';
  cities: any[] = [];
  specialities: any[] = [];

  benefits = [
    {
      icon: '🏥',
      title: 'Healthcare Platform',
      description: 'Connect with healthcare providers easily'
    },
    {
      icon: '📋',
      title: 'Medical Records',
      description: 'Secure storage for all your medical documents'
    },
    {
      icon: '👨‍⚕️',
      title: '50K+ Providers',
      description: 'Access to thousands of verified professionals'
    },
    {
      icon: '🎯',
      title: 'Personalized Care',
      description: 'Customized healthcare solutions for you'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.rotateBenefits();
  }

  ngOnInit(): void {
    this.loadCitiesAndSpecialities();
  }

  loadCitiesAndSpecialities(): void {
    this.authService.getCities().subscribe({
      next: (data) => {
        this.cities = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading cities:', err);
      }
    });

    this.authService.getSpecialities().subscribe({
      next: (data) => {
        this.specialities = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading specialities:', err);
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  rotateBenefits(): void {
    setInterval(() => {
      this.currentBenefitIndex = (this.currentBenefitIndex + 1) % this.benefits.length;
      this.cdr.detectChanges();
    }, 5000);
  }

  onRegister(): void {
    if (this.password !== this.confirmPassword) {
      console.log('Passwords do not match');
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    const requestData: any = {
      name: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      role: this.userRole === 'doctor' ? 'ROLE_DOCTOR' : 'ROLE_PATIENT'
    };

    if (this.userRole === 'doctor') {
        requestData.specialityId = this.specialityId ? Number(this.specialityId) : null;
        requestData.cityId = this.cityId ? Number(this.cityId) : null;
        requestData.medicalLicence = this.medicalLicence;
    }

    console.log('Register attempt with:', requestData);

    this.authService.register(requestData).subscribe({
      next: (response) => {
        this.loading = false;
        this.cdr.detectChanges();
        console.log('Registration successful:', response);
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
        console.error('Registration failed:', err);
      }
    });
  }

  selectBenefit(index: number): void {
    this.currentBenefitIndex = index;
    this.cdr.detectChanges();
  }
}
