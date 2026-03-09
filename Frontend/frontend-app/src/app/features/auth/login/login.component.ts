import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './login.component.html',
})
export class LoginComponent {
    loginForm: FormGroup;
    errorMessage: string = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.errorMessage = '';
            this.authService.login(this.loginForm.value).subscribe({
                next: (response) => {
                    if (response.role === 'ROLE_ADMIN') {
                        this.router.navigate(['/admin/dashboard']);
                    } else if (response.role === 'ROLE_DOCTOR') {
                        this.router.navigate(['/doctor/dashboard']);
                    } else {
                        this.router.navigate(['/']);
                    }
                },
                error: (err) => {
                    console.error('Login error:', err);
                    if (err.error && err.error.error) {
                         this.errorMessage = err.error.error;
                    } else {
                         this.errorMessage = 'Login failed. Please check your network or credentials.';
                    }
                }
            });
        }
    }
}
