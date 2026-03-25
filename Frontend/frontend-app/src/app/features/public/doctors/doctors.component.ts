import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { PublicService, City, Specialty, Doctor } from '../../../core/services/public.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PatientService } from '../../patient/services/patient.service';

@Component({
    selector: 'app-doctors',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent],
    templateUrl: './doctors.component.html',
    styleUrl: './doctors.component.css'
})
export class DoctorsComponent implements OnInit {
    doctors: Doctor[] = [];
    cities: City[] = [];
    specialties: Specialty[] = [];

    selectedCityId: number | null = null;
    selectedSpecialtyId: number | null = null;

    currentPage = 0;
    pageSize = 10;
    totalPages = 0;

    loading = true;
    isAuthenticated = false;
    userRole: string | null = null;

    // Selection for Sidebar
    viewedDoctor: Doctor | null = null;

    // Booking Modal
    showBookingModal = false;
    selectedDoctor: any = null;
    availableSlots: any[] = [];
    doctorUnavailabilities: any[] = [];
    bookingData = {
        selectedDate: '',
        selectedTime: '',
        reason: ''
    };
    bookingLoading = false;
    slotsLoading = false;


    constructor(
        private publicService: PublicService,
        private authService: AuthService,
        private patientService: PatientService,
        private notificationService: NotificationService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.checkAuth();
        this.loading = true;
        this.cdr.detectChanges();

        console.log('[PublicDoctors] Loading data...');

        // Load cities, specialties, and doctors in parallel
        forkJoin({
            cities: this.publicService.getAllCities(),
            specialties: this.publicService.getAllSpecialties(),
            doctors: this.publicService.getAllDoctors(undefined, undefined, 0, this.pageSize)
        }).subscribe({
            next: (result) => {
                console.log('[PublicDoctors] All data loaded successfully:', result);
                this.cities = result.cities;
                this.specialties = result.specialties;
                this.doctors = result.doctors.content;
                this.totalPages = result.doctors.totalPages;
                this.loading = false;
                this.selectFirstDoctor();
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('[PublicDoctors] Error loading data:', err);
                console.error('[PublicDoctors] Status:', err.status);
                console.error('[PublicDoctors] Error details:', err);
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    checkAuth(): void {
        this.isAuthenticated = this.authService.isAuthenticated();
        this.userRole = this.authService.getUserRole();
    }

    loadDoctors(): void {
        this.loading = true;
        this.cdr.detectChanges();
        console.log('Loading doctors with filters:', { cityId: this.selectedCityId, specialtyId: this.selectedSpecialtyId, page: this.currentPage });
        this.publicService.getAllDoctors(
            this.selectedCityId || undefined,
            this.selectedSpecialtyId || undefined,
            this.currentPage,
            this.pageSize
        ).subscribe({
            next: (data) => {
                console.log('Doctors loaded successfully:', data);
                this.doctors = data.content;
                this.totalPages = data.totalPages;
                this.loading = false;
                this.selectFirstDoctor();
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading doctors:', err);
                this.loading = false;
                this.doctors = [];
                this.cdr.detectChanges();
            }
        });
    }

    onFilterChange(): void {
        this.currentPage = 0;
        this.loadDoctors();
        this.cdr.detectChanges();
    }

    selectDoctor(doctor: Doctor): void {
        this.viewedDoctor = doctor;
        this.cdr.detectChanges();
    }

    private selectFirstDoctor(): void {
        if (this.doctors && this.doctors.length > 0) {
            this.viewedDoctor = this.doctors[0];
        } else {
            this.viewedDoctor = null;
        }
    }

    takeAppointment(doctor: Doctor): void {
        if (!this.isAuthenticated) {
            this.router.navigate(['/auth/login']);
            return;
        }

        if (this.userRole !== 'ROLE_PATIENT') {
            this.notificationService.warning(
                'Access Denied',
                'Only patients can book appointments'
            );
            return;
        }

        // Open booking modal
        this.openBookingModal(doctor);
    }

    openBookingModal(doctor: Doctor): void {
        console.log('Opening booking modal for:', doctor);
        this.selectedDoctor = doctor;
        this.showBookingModal = true;
        this.resetBookingForm();
        this.doctorUnavailabilities = [];

        // Fetch Unavailability
        this.patientService.getDoctorUnavailability(doctor.id).subscribe({
            next: (data) => {
                this.doctorUnavailabilities = data;
                console.log('Doctor unavailabilities:', this.doctorUnavailabilities);
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error fetching unavailabilities', err);
                this.cdr.detectChanges();
            }
        });

        this.cdr.detectChanges();
    }

    closeBookingModal(): void {
        this.showBookingModal = false;
        this.resetBookingForm();
        this.cdr.detectChanges();
    }

    resetBookingForm(): void {
        this.bookingData = {
            selectedDate: '',
            selectedTime: '',
            reason: ''
        };
        this.availableSlots = [];
    }

    // Modal Logic & Helpers
    getMinDate(): string {
        const today = new Date();
        const dayOfWeek = today.getDay();
        // If Saturday (6) or Sunday (0), move to next Monday
        if (dayOfWeek === 0) today.setDate(today.getDate() + 1);
        else if (dayOfWeek === 6) today.setDate(today.getDate() + 2);
        return today.toISOString().split('T')[0];
    }

    getMaxDate(): string {
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 90);
        const dayOfWeek = maxDate.getDay();
        if (dayOfWeek === 0) maxDate.setDate(maxDate.getDate() - 2);
        else if (dayOfWeek === 6) maxDate.setDate(maxDate.getDate() - 1);
        return maxDate.toISOString().split('T')[0];
    }

    isWeekday(dateStr: string): boolean {
        const date = new Date(dateStr);
        const dayOfWeek = date.getUTCDay(); // Use UTC day to avoid timezone shifts
        return dayOfWeek >= 1 && dayOfWeek <= 5;
    }

    onDateSelected(): void {
        if (!this.bookingData.selectedDate) return;

        // 1. Check Weekday
        if (!this.isWeekday(this.bookingData.selectedDate)) {
            this.notificationService.warning(
                'Invalid Date',
                'Please select a weekday (Monday-Friday)'
            );
            this.bookingData.selectedDate = '';
            this.availableSlots = [];
            this.cdr.detectChanges();
            return;
        }

        // 2. Check Doctor Unavailability (Holidays/Emergency)
        const selectedDateStr = this.bookingData.selectedDate;

        const isUnavailable = this.doctorUnavailabilities.some((u: any) => {
            // Handle if startDate/endDate are strings (YYYY-MM-DD)
            if (typeof u.startDate === 'string' && typeof u.endDate === 'string') {
                return selectedDateStr >= u.startDate && selectedDateStr <= u.endDate;
            }

            // Fallback if they are timestamps or other formats
            const start = new Date(u.startDate);
            start.setHours(0,0,0,0);
            const end = new Date(u.endDate);
            end.setHours(0,0,0,0);

            const selected = new Date(selectedDateStr);
            selected.setHours(0,0,0,0);

            return selected >= start && selected <= end;
        });

        if (isUnavailable) {
            this.notificationService.warning(
                'Doctor Unavailable',
                'This doctor is unavailable on the selected date. Please choose another date.'
            );
            this.bookingData.selectedDate = '';
            this.availableSlots = [];
            this.cdr.detectChanges();
            return;
        }

        // 3. Fetch Slots
        this.slotsLoading = true;
        this.availableSlots = [];
        this.bookingData.selectedTime = '';
        this.cdr.detectChanges();

        this.patientService.getDoctorSlots(this.selectedDoctor.id, this.bookingData.selectedDate).subscribe({
            next: (slots: any[]) => {
                if (!Array.isArray(slots)) {
                    this.availableSlots = [];
                    this.slotsLoading = false;
                    this.notificationService.error(
                        'Response Error',
                        'Unexpected response format from server'
                    );
                    this.cdr.detectChanges();
                    return;
                }

                // Filter and format only 9:00 AM - 12:00 PM slots
                this.availableSlots = slots
                    .map((slot: any) => {
                        const startTime = new Date(slot.start).toLocaleTimeString('en-US', {
                            hour: '2-digit', minute: '2-digit', hour12: true
                        });
                        console.log('Processing slot:', slot);
                        // Check for 'available' or 'isAvailable' property
                        const isSlotAvailable = slot.available !== undefined ? slot.available : slot.isAvailable;

                        return {
                            time: startTime,
                            available: isSlotAvailable,
                            start: slot.start,
                            raw: slot
                        };
                    })
                    .filter((slot: any) => {
                        const time = new Date(slot.start);
                        const hours = time.getHours();
                        return hours >= 9 && hours < 12;
                    });

                if (this.availableSlots.length === 0) {
                    // This case usually happens if all slots are filtered out or none returned.
                    // If backend returns booked slots as unavailable, they should appear here but disabled.
                    // If the list is truly empty, maybe it's fully booked or something else.
                    console.log('No slots found for date:', this.bookingData.selectedDate);
                }
                this.slotsLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading slots:', err);
                this.availableSlots = [];
                this.slotsLoading = false;
                const errorMsg = err.error?.message || err.message || 'Please try again';
                this.notificationService.error(
                    'Failed to Load Slots',
                    errorMsg
                );
                this.cdr.detectChanges();
            }
        });
    }

    bookAppointment(): void {
        if (!this.bookingData.selectedDate || !this.bookingData.selectedTime || !this.bookingData.reason) {
            this.notificationService.warning(
                'Incomplete Form',
                'Please fill in all fields before submitting'
            );
            return;
        }

        this.bookingLoading = true;
        this.cdr.detectChanges();

        // Use exact start time from slot if available
        const selectedSlot = this.availableSlots.find((slot: any) => slot.time === this.bookingData.selectedTime);
        let dateTimeStr: string;

        if (selectedSlot && selectedSlot.start) {
            dateTimeStr = selectedSlot.start;
        } else {
            // Fallback parsing
            const timeRegex = /(\d+):(\d+)\s*(AM|PM)/i;
            const match = this.bookingData.selectedTime.match(timeRegex);
            let hours = parseInt(match![1]);
            const minutes = parseInt(match![2]);
            const period = match![3].toUpperCase();
            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;
            const appointmentDate = new Date(this.bookingData.selectedDate);
            appointmentDate.setHours(hours, minutes, 0, 0);
            dateTimeStr = appointmentDate.toISOString();
        }

        const appointmentData = {
            doctorId: this.selectedDoctor.id,
            dateTime: dateTimeStr,
            reason: this.bookingData.reason
        };

        this.patientService.bookAppointment(appointmentData).subscribe({
            next: (response) => {
                console.log('Appointment booked:', response);
                this.bookingLoading = false;
                this.notificationService.success(
                    'Appointment Confirmed',
                    `Your appointment with ${this.selectedDoctor.name} has been successfully booked!`
                );
                this.closeBookingModal();
                this.cdr.detectChanges();
                // Optionally refresh something?
            },
            error: (err) => {
                console.error('Error booking appointment:', err);
                this.bookingLoading = false;
                const errorMsg = err.error?.message || 'Please try again';
                this.notificationService.error(
                    'Booking Failed',
                    errorMsg
                );
                this.cdr.detectChanges();
            }
        });
    }

    previousPage(): void {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.loadDoctors();
        }
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages - 1) {
            this.currentPage++;
            this.loadDoctors();
        }
    }
}
