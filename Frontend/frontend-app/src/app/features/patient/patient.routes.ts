import { Routes } from '@angular/router';
import { PatientLayoutComponent } from './layout/patient-layout.component';

export const PATIENT_ROUTES: Routes = [
    {
        path: '',
        component: PatientLayoutComponent,
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./dashboard/patient-dashboard.component').then(m => m.PatientDashboardComponent)
            },
            {
                path: 'appointments',
                loadComponent: () => import('./appointments/patient-appointments.component').then(m => m.PatientAppointmentsComponent)
            },
            {
                path: 'profile',
                loadComponent: () => import('./profile/patient-profile.component').then(m => m.PatientProfileComponent)
            }
        ]
    }
];

