import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface City {
    id: number;
    cityName: string;
}

export interface Specialty {
    id: number;
    specialiteName: string;
}

export interface Doctor {
    id: number;
    name: string;
    lastName: string;
    email: string;
    status: string;
    medicalLicence: string;
    medicalDocument: string;
    profilePic: string;
    speciality: string;
    city: string;
    fees: number;
}

export interface DoctorsPage {
    content: Doctor[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

@Injectable({
    providedIn: 'root'
})
export class PublicService {
    private apiUrl = 'http://localhost:8080/api/public';

    constructor(private http: HttpClient) { }

    getAllDoctors(cityId?: number, specialtyId?: number, page: number = 0, size: number = 10): Observable<DoctorsPage> {
        let url = `${this.apiUrl}/doctors?page=${page}&size=${size}`;

        if (cityId) {
            url += `&cityId=${cityId}`;
        }
        if (specialtyId) {
            url += `&specialityId=${specialtyId}`;
        }

        return this.http.get<DoctorsPage>(url);
    }

    getAllCities(): Observable<City[]> {
        return this.http.get<City[]>(`${this.apiUrl}/cities`);
    }

    getAllSpecialties(): Observable<Specialty[]> {
        return this.http.get<Specialty[]>(`${this.apiUrl}/specialities`);
    }
}



