import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-patient-appointments',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './patient-appointments.component.html',
    styleUrl: './patient-appointments.component.css'
})
export class PatientAppointmentsComponent implements OnInit {
    doctorId: number | null = null;

    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            if (params['doctorId']) {
                this.doctorId = params['doctorId'];
            }
        });
    }
}

