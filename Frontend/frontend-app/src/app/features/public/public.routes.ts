import { Routes } from '@angular/router';

export const PUBLIC_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'doctors',
        loadComponent: () => import('./doctors/doctors.component').then(m => m.DoctorsComponent)
    }
];

