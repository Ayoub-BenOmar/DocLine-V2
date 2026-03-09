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
          }
      ]
  }
];


