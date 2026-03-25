import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AppointmentResponseDto {
    id: number;
    dateTime: string;
    status: string;
    reason: string;
    doctorName: string;
    doctorSpeciality: string;
    patientId: number;
    patientName: string;
    doctorNote: string;
    medicalReportDate: string;

    // Patient Medical History
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

    // Get patient profile
    getProfile(): Observable<any> {
        return this.http.get(`${this.apiUrl}/profile`);
    }

    // Update patient profile
    updateProfile(data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/profile`, data);
    }

    // Get patient appointments
    getAppointments(): Observable<AppointmentResponseDto[]> {
        return this.http.get<AppointmentResponseDto[]>(`${this.apiUrl}/appointments`);
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
        const url = `${this.apiUrl}/doctors/${doctorId}/slots?date=${date}`;
        console.log('Calling getDoctorSlots - URL:', url);
        return this.http.get<any[]>(url);
    }

    // Get doctor unavailability
    getDoctorUnavailability(doctorId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/doctors/${doctorId}/unavailability`);
    }

    // Book appointment
    bookAppointment(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/appointments`, data);
    }

    // Cancel appointment
    cancelAppointment(appointmentId: number): Observable<any> {
        return this.http.put(`${this.apiUrl}/appointments/${appointmentId}/cancel`, {});
    }

    // Reschedule appointment
    rescheduleAppointment(appointmentId: number, data: { dateTime: string; reason: string }): Observable<any> {
        return this.http.put(`${this.apiUrl}/appointments/${appointmentId}/reschedule`, data);
    }
}

