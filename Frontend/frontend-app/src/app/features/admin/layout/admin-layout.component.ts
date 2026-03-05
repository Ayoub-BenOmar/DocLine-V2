import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: './admin-layout.component.html',
    styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
    isSidebarOpen = true;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    logout() {
        console.log('Logout clicked');
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
