import { Routes } from '@angular/router';

export const DOCTOR_ROUTES: Routes = [
  {
      path: '',
      children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          {
              path: 'dashboard',
              loadComponent: () => import('./dashboard/doctor-dashboard.component').then(m => m.DoctorDashboardComponent)
          }
      ]
  }
];


