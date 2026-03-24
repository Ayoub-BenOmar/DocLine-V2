import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isAuthenticated = false;
  userRole: string | null = null;
  userName: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.checkAuth();
  }

  checkAuth(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.userRole = this.authService.getUserRole();
    if (typeof localStorage !== 'undefined') {
      this.userName = localStorage.getItem('user_name');
    }
  }

  logout(): void {
    this.authService.logout();
    this.checkAuth();
  }

  getRolePath(): string {
    if (this.userRole === 'ROLE_ADMIN') {
      return '/admin/dashboard';
    } else if (this.userRole === 'ROLE_DOCTOR') {
      return '/doctor/dashboard';
    } else if (this.userRole === 'ROLE_PATIENT') {
      return '/patient/dashboard';
    }
    return '/';
  }
}
