import { Routes } from '@angular/router';
import { DoctorLayoutComponent } from './layout/doctor-layout.component';

export const DOCTOR_ROUTES: Routes = [
  {
      path: '',
      component: DoctorLayoutComponent,
      children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          {
              path: 'dashboard',
              loadComponent: () => import('./dashboard/doctor-dashboard.component').then(m => m.DoctorDashboardComponent)
          },
          {
              path: 'appointments',
              loadComponent: () => import('./appointments/doctor-appointments.component').then(m => m.DoctorAppointmentsComponent)
          },
          {
              path: 'profile',
              loadComponent: () => import('./profile/doctor-profile.component').then(m => m.DoctorProfileComponent)
          }
      ]
  }
];
