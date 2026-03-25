import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AppointmentResponseDto {
    id: number;
    dateTime: string;
    status: string;
    reason: string;
    doctorId: number;
    doctorName: string;
    doctorSpeciality: string;
    patientId: number;
    patientName: string;
    doctorNote: string;
    medicalReportDate: string;

    patientBloodType?: string;
    patientPastIllnesses?: string;
    patientSurgeries?: string;
    patientAllergies?: string;
    patientChronic?: string;
}

@Injectable({
    providedIn: 'root'
})
export class PatientService {
    private apiUrl = 'http://localhost:8080/api/patient';

    constructor(private http: HttpClient) { }

    getProfile(): Observable<any> {
        return this.http.get(`${this.apiUrl}/profile`);
    }

    updateProfile(data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/profile`, data);
    }

    getAppointments(): Observable<AppointmentResponseDto[]> {
        return this.http.get<AppointmentResponseDto[]>(`${this.apiUrl}/appointments`);
    }

    searchDoctors(cityId?: number, specialityId?: number, name?: string): Observable<any[]> {
        let params = '';
        if (cityId) params += `cityId=${cityId}&`;
        if (specialityId) params += `specialityId=${specialityId}&`;
        if (name) params += `name=${name}&`;

        return this.http.get<any[]>(`${this.apiUrl}/doctors?${params}`);
    }

    getDoctorSlots(doctorId: number, date: string): Observable<any[]> {
        const url = `${this.apiUrl}/doctors/${doctorId}/slots?date=${date}`;
        console.log('Calling getDoctorSlots - URL:', url);
        return this.http.get<any[]>(url);
    }

    getDoctorUnavailability(doctorId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/doctors/${doctorId}/unavailability`);
    }

    bookAppointment(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/appointments`, data);
    }

    cancelAppointment(appointmentId: number): Observable<string> {
        return this.http.put(`${this.apiUrl}/appointments/${appointmentId}/cancel`, {}, { responseType: 'text' });
    }

    rescheduleAppointment(appointmentId: number, data: { dateTime: string; reason: string }): Observable<any> {
        return this.http.put(`${this.apiUrl}/appointments/${appointmentId}/reschedule`, data);
    }
}

