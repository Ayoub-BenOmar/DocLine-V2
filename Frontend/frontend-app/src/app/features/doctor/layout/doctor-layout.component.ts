import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationContainerComponent } from '../../../shared/components/notification-container/notification-container.component';

@Component({
  selector: 'app-doctor-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationContainerComponent],
  templateUrl: './doctor-layout.component.html',
  styleUrl: './doctor-layout.component.css'
})
export class DoctorLayoutComponent {
  isSidebarOpen = true;

  constructor(private authService: AuthService, private router: Router) {}

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.authService.logout();
  }
}

