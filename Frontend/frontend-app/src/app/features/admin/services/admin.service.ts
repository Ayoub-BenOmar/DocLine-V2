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
    profilePic: string;
    speciality: string;
    city: string;
    fees: number;
}

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = 'http://localhost:8080/api/admin';

    constructor(private http: HttpClient) { }

    getAllPatients(): Observable<Patient[]> {
        return this.http.get<Patient[]>(`${this.apiUrl}/patients`);
    }

    getAllDoctors(): Observable<Doctor[]> {
        return this.http.get<Doctor[]>(`${this.apiUrl}/doctors`);
    }
}
