import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    errorMessage: string = '';
    cities: any[] = [];
    specialities: any[] = [];
    isDoctor: boolean = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.registerForm = this.fb.group({
            role: ['ROLE_PATIENT', Validators.required],
            name: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required, Validators.pattern('^(\\+212|0)[5-7][0-9]{8}$')]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', Validators.required],

            // Doctor specific
            medicalLicence: [''],
            specialityId: [null],
            cityId: [null],
            education: [''] // "Medical Doc" logic mapping to education or just extra field
        }, { validators: this.passwordMatchValidator });
    }

    ngOnInit(): void {
        this.authService.getCities().subscribe(data => this.cities = data);
        this.authService.getSpecialities().subscribe(data => this.specialities = data);

        this.registerForm.get('role')?.valueChanges.subscribe(role => {
            this.isDoctor = role === 'ROLE_DOCTOR';
            this.updateValidators();
        });
    }

    passwordMatchValidator(g: FormGroup) {
        return g.get('password')?.value === g.get('confirmPassword')?.value
            ? null : { mismatch: true };
    }

    updateValidators() {
        const medicalLicenceControl = this.registerForm.get('medicalLicence');
        const specialityControl = this.registerForm.get('specialityId');
        const cityControl = this.registerForm.get('cityId');

        if (this.isDoctor) {
            medicalLicenceControl?.setValidators([Validators.required]);
            specialityControl?.setValidators([Validators.required]);
            cityControl?.setValidators([Validators.required]);
        } else {
            medicalLicenceControl?.clearValidators();
            specialityControl?.clearValidators();
            cityControl?.clearValidators();
        }
        medicalLicenceControl?.updateValueAndValidity();
        specialityControl?.updateValueAndValidity();
        cityControl?.updateValueAndValidity();
    }

    onSubmit() {
        if (this.registerForm.valid) {
            this.authService.register(this.registerForm.value).subscribe({
                next: (response) => {
                    this.router.navigate(['/login']);
                },
                error: (err) => {
                    this.errorMessage = err.error?.message || 'Registration failed';
                }
            });
        } else {
            this.registerForm.markAllAsTouched();
        }
    }
}
