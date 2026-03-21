import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-patient-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './patient-layout.component.html',
  styleUrl: './patient-layout.component.css'
})
export class PatientLayoutComponent {
  isSidebarOpen = true;

  constructor(private authService: AuthService, private router: Router) {}

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.authService.logout();
  }
}

