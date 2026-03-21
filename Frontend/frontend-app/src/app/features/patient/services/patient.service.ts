import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PatientService {
    private apiUrl = 'http://localhost:8080/api/patient';

    constructor(private http: HttpClient) { }

    // Get patient profile
    getProfile(): Observable<any> {
        return this.http.get(`${this.apiUrl}/profile`);
    }

    // Update patient profile
    updateProfile(data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/profile`, data);
    }

    // Search doctors
    searchDoctors(cityId?: number, specialityId?: number, name?: string): Observable<any[]> {
        let params = '';
        if (cityId) params += `cityId=${cityId}&`;
        if (specialityId) params += `specialityId=${specialityId}&`;
        if (name) params += `name=${name}&`;

        return this.http.get<any[]>(`${this.apiUrl}/doctors?${params}`);
    }

    // Get doctor available slots
    getDoctorSlots(doctorId: number, date: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/doctors/${doctorId}/slots?date=${date}`);
    }

    // Book appointment
    bookAppointment(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/appointments`, data);
    }
}

