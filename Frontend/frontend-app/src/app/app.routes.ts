import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
    {
        path: 'auth/login',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'auth/register',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: 'auth',
        redirectTo: 'auth/login'
    },
    {
        path: '',
        loadChildren: () => import('./features/public/public.routes').then(m => m.PUBLIC_ROUTES)
    },
    {
        path: 'admin',
        canActivate: [authGuard],
        data: { roles: ['ROLE_ADMIN'] },
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
    },
    {
        path: 'doctor',
        canActivate: [authGuard],
        data: { roles: ['ROLE_DOCTOR'] },
        loadChildren: () => import('./features/doctor/doctor.routes').then(m => m.DOCTOR_ROUTES)
    },
    {
        path: 'patient',
        canActivate: [authGuard],
        data: { roles: ['ROLE_PATIENT'] },
        loadChildren: () => import('./features/patient/patient.routes').then(m => m.PATIENT_ROUTES)
    }
];
