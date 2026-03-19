import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-patient-profile',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './patient-profile.component.html',
    styleUrl: './patient-profile.component.css'
})
export class PatientProfileComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }
}
