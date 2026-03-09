import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DoctorProfileDto {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  profilePic: string;
  cityId: number;
  specialityId: number;
  fees: number;
  bio: string;
  officeAddress: string;
  workingHours: string;
}

export interface UnavailabilityDto {
  startDate: string;
  endDate: string;
  reason: string;
}

export interface Unavailability {
  id: number;
  startDate: string;
  endDate: string;
  reason: string;
}

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
}

export interface MedicalReportDto {
  bloodType: string;
  pastIllnesses: string;
  surgeries: string;
  allergies: string;
  chronic: string;
  doctorNote: string;
}

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'http://localhost:8080/api/doctor';

  constructor(private http: HttpClient) {}

  addUnavailability(unavailabilityDto: UnavailabilityDto): Observable<Unavailability> {
    return this.http.post<Unavailability>(`${this.apiUrl}/unavailability`, unavailabilityDto);
  }

  getMyUnavailabilities(): Observable<Unavailability[]> {
    return this.http.get<Unavailability[]>(`${this.apiUrl}/unavailability`);
  }

  updateProfile(profileDto: DoctorProfileDto): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profile`, profileDto);
  }

  getProfile(): Observable<DoctorProfileDto> {
    return this.http.get<DoctorProfileDto>(`${this.apiUrl}/profile`);
  }

  getMyAppointments(): Observable<AppointmentResponseDto[]> {
    return this.http.get<AppointmentResponseDto[]>(`${this.apiUrl}/appointments`);
  }

  completeAppointment(appointmentId: number, reportDto: MedicalReportDto): Observable<string> {
    return this.http.post(`${this.apiUrl}/appointments/${appointmentId}/complete`, reportDto, { responseType: 'text' });
  }
}

