import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Patient {
    id: number;
    name: string;
    lastName: string;
    email: string;
    phone: string;
    profilePic: string;
    birthdate: string;
    gender: string;
    bloodType: string;
    cin: string;
    address: string;
    city: string;
    insuranceProvider: string;
    insuranceNumber: string;
    hasInsurance: boolean;
    status: string;
    // Medical history
    pastIllnesses: string;
    surgeries: string;
    allergies: string;
    chronic: string;
}

export interface Doctor {
    id: number;
    name: string;
    lastName: string;
    email: string;
    profilePic: string;
    speciality: string;
    city: string;
    fees: number;
    status: string;
    medicalLicence: string;
    medicalDocument: string;
}

export interface City {
    id?: number;
    cityName: string;
}

export interface Specialty {
    id?: number;
    specialiteName: string;
}

export interface DashboardStatistics {
    totalPatients: number;
    totalDoctors: number;
    totalUsers: number;
    totalCities: number;
    totalSpecialties: number;
    appointmentsToday: number;
    lastPendingDoctors: Doctor[];
}

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = 'http://localhost:8080/api/admin';

    constructor(private http: HttpClient) { }

    getDashboardStatistics(): Observable<DashboardStatistics> {
        return this.http.get<DashboardStatistics>(`${this.apiUrl}/statistics/dashboard`);
    }

    getAllPatients(): Observable<Patient[]> {
        return this.http.get<Patient[]>(`${this.apiUrl}/patients`);
    }

    getAllDoctors(): Observable<Doctor[]> {
        return this.http.get<Doctor[]>(`${this.apiUrl}/doctors`);
    }

    getPendingDoctors(): Observable<Doctor[]> {
        return this.http.get<Doctor[]>(`${this.apiUrl}/doctors/pending`);
    }

    approveDoctor(doctorId: number): Observable<string> {
        return this.http.put(`${this.apiUrl}/doctors/${doctorId}/approve`, {}, { responseType: 'text' });
    }

    rejectDoctor(doctorId: number): Observable<string> {
        return this.http.put(`${this.apiUrl}/doctors/${doctorId}/reject`, {}, { responseType: 'text' });
    }

    suspendDoctor(doctorId: number): Observable<string> {
        return this.http.put(`${this.apiUrl}/doctors/${doctorId}/suspend`, {}, { responseType: 'text' });
    }

    addCity(city: City): Observable<City> {
        return this.http.post<City>(`${this.apiUrl}/cities`, city);
    }

    addSpecialty(specialty: Specialty): Observable<Specialty> {
        return this.http.post<Specialty>(`${this.apiUrl}/specialities`, specialty);
    }

    getAllCities(): Observable<City[]> {
        return this.http.get<City[]>(`${this.apiUrl}/cities`);
    }

    getAllSpecialties(): Observable<Specialty[]> {
        return this.http.get<Specialty[]>(`${this.apiUrl}/specialities`);
    }

    getCityStatistics(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/cities/statistics`);
    }

    getSpecialtyStatistics(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/specialities/statistics`);
    }

    updateCity(id: number, city: City): Observable<string> {
        return this.http.put(`${this.apiUrl}/cities/${id}`, city, { responseType: 'text' });
    }

    deleteCity(id: number): Observable<string> {
        return this.http.delete(`${this.apiUrl}/cities/${id}`, { responseType: 'text' });
    }

    updateSpecialty(id: number, specialty: Specialty): Observable<string> {
        return this.http.put(`${this.apiUrl}/specialities/${id}`, specialty, { responseType: 'text' });
    }

    deleteSpecialty(id: number): Observable<string> {
        return this.http.delete(`${this.apiUrl}/specialities/${id}`, { responseType: 'text' });
    }

    suspendPatient(patientId: number): Observable<string> {
        return this.http.put(`${this.apiUrl}/patients/${patientId}/suspend`, {}, { responseType: 'text' });
    }
}
