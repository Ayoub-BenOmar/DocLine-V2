import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
    templateUrl: './login.component.html',
})
export class LoginComponent {
    email = '';
    password = '';
    showPassword = false;
    loading = false;
    errorMessage = '';
    currentBenefitIndex = 0;
    showPendingModal = false;

    benefits = [
      {
        icon: '🔒',
        title: 'Secure & Encrypted',
        description: 'End-to-end encryption protects all your data'
      },
      {
        icon: '⚡',
        title: '24/7 Support',
        description: 'Our team is always ready to help you'
      },
      {
        icon: '🌍',
        title: 'Global Access',
        description: 'Access your account from anywhere in the world'
      },
      {
        icon: '✅',
        title: '99.9% Uptime',
        description: 'Reliable service you can depend on'
      }
    ];

    constructor(
        private authService: AuthService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {
        this.rotateBenefits();
    }

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }

    rotateBenefits(): void {
        setInterval(() => {
            this.currentBenefitIndex = (this.currentBenefitIndex + 1) % this.benefits.length;
            this.cdr.detectChanges();
        }, 5000);
    }

    selectBenefit(index: number): void {
        this.currentBenefitIndex = index;
    }

    closePendingModal(): void {
        this.showPendingModal = false;
        this.authService.logout();
    }

    onLogin(): void {
        if (!this.email || !this.password) {
            this.errorMessage = 'Please fill in all fields!';
            return;
        }

        this.loading = true;
        this.errorMessage = '';
        this.cdr.detectChanges();

        this.authService.login({
            email: this.email,
            password: this.password
        }).subscribe({
            next: (response: any) => {
                this.loading = false;
                this.cdr.detectChanges();

                if (response.role === 'ROLE_DOCTOR' && !response.isActivated) {
                    this.showPendingModal = true;
                    this.cdr.detectChanges();
                    return;
                }

                if (response.role === 'ROLE_ADMIN') {
                    this.router.navigate(['/admin/dashboard']);
                } else if (response.role === 'ROLE_DOCTOR') {
                    this.router.navigate(['/doctor/dashboard']);
                } else if (response.role === 'ROLE_PATIENT') {
                    this.router.navigate(['/patient/dashboard']);
                } else {
                    this.router.navigate(['/']);
                }
            },
            error: (err: any) => {
                this.loading = false;
                console.error('Login error:', err);
                if (err.error && err.error.error) {
                    this.errorMessage = err.error.error;
                } else {
                    this.errorMessage = 'Login failed. Please check your credentials.';
                }
                this.cdr.detectChanges();
            }
        });
    }
}
