import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { PatientService } from '../services/patient.service';
import { PublicService } from '../../../core/services/public.service';

@Component({
    selector: 'app-patient-appointments',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './patient-appointments.component.html',
    styleUrl: './patient-appointments.component.css'
})
export class PatientAppointmentsComponent implements OnInit {
    doctorId: number | null = null;
    upcomingAppointments: any[] = [];
    pastAppointments: any[] = [];
    loading = true;
    activeTab: 'upcoming' | 'past' = 'upcoming';

    // Modal data
    showBookingModal = false;
    selectedDoctor: any = null;
    availableSlots: any[] = [];
    bookingData = {
        selectedDate: '',
        selectedTime: '',
        reason: ''
    };
    bookingLoading = false;
    slotsLoading = false;

    constructor(
        private route: ActivatedRoute,
        private patientService: PatientService,
        private publicService: PublicService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadAppointments();

        this.route.queryParams.subscribe(params => {
            if (params['doctorId']) {
                const doctorId = parseInt(params['doctorId']);
                console.log('Opening booking modal for doctor:', doctorId);
                this.openBookingModal(doctorId);
            }
        });
    }

    loadAppointments(): void {
        this.loading = true;
        this.cdr.detectChanges();

        // Load real appointments from backend
        this.patientService.getAppointments().subscribe({
            next: (appointments) => {
                console.log('Appointments loaded:', appointments);
                // Separate into upcoming and past
                const now = new Date();
                this.upcomingAppointments = appointments.filter((apt: any) => new Date(apt.date) >= now);
                this.pastAppointments = appointments.filter((apt: any) => new Date(apt.date) < now);
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading appointments:', err);
                this.upcomingAppointments = [];
                this.pastAppointments = [];
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    openBookingModal(doctorId: number): void {
        console.log('openBookingModal called with doctorId:', doctorId);

        // Fetch doctor details from backend
        this.publicService.getAllDoctors().subscribe({
            next: (data: any) => {
                const doctor = data.content.find((d: any) => d.id === doctorId);
                if (doctor) {
                    this.selectedDoctor = {
                        id: doctor.id,
                        name: `${doctor.name} ${doctor.lastName}`,
                        speciality: doctor.speciality,
                        city: doctor.city,
                        fees: doctor.fees
                    };
                } else {
                    // Fallback if doctor not found
                    this.selectedDoctor = {
                        id: doctorId,
                        name: 'Dr. John Smith',
                        speciality: 'General Practitioner',
                        fees: 150
                    };
                }
                this.showBookingModal = true;
                this.resetBookingForm();
                console.log('Modal opened with doctor:', this.selectedDoctor);
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error fetching doctor:', err);
                // Use mock data as fallback
                this.selectedDoctor = {
                    id: doctorId,
                    name: 'Dr. John Smith',
                    speciality: 'General Practitioner',
                    fees: 150
                };
                this.showBookingModal = true;
                this.resetBookingForm();
                this.cdr.detectChanges();
            }
        });
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

    onDateSelected(): void {
        if (!this.bookingData.selectedDate) return;

        // Validate that selected date is a weekday
        if (!this.isWeekday(this.bookingData.selectedDate)) {
            alert('❌ Please select a weekday (Monday-Friday)');
            this.bookingData.selectedDate = '';
            this.cdr.detectChanges();
            return;
        }

        this.slotsLoading = true;
        this.availableSlots = [];
        this.bookingData.selectedTime = '';
        this.cdr.detectChanges();

        // Fetch available slots from backend
        this.patientService.getDoctorSlots(this.selectedDoctor.id, this.bookingData.selectedDate).subscribe({
            next: (slots: any[]) => {
                console.log('Slots loaded from backend:', slots);

                // Convert backend TimeSlotDto to UI format
                // Filter and format only 9:00 AM - 12:00 PM slots
                this.availableSlots = slots
                    .map((slot: any) => {
                        const startTime = new Date(slot.start).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        });
                        return {
                            time: startTime,
                            available: slot.isAvailable,
                            start: slot.start,
                            raw: slot
                        };
                    })
                    .filter((slot: any) => {
                        // Filter only 9:00 AM to 12:00 PM
                        const time = new Date(slot.start);
                        const hours = time.getHours();
                        return hours >= 9 && hours < 12;
                    });

                console.log('Formatted and filtered slots:', this.availableSlots);

                if (this.availableSlots.length === 0) {
                    alert('⚠️ No available slots for this date');
                }

                this.slotsLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading slots:', err);
                this.availableSlots = [];
                this.slotsLoading = false;
                alert('❌ Failed to load available slots');
                this.cdr.detectChanges();
            }
        });
    }

    bookAppointment(): void {
        if (!this.bookingData.selectedDate || !this.bookingData.selectedTime || !this.bookingData.reason) {
            alert('Please fill in all fields');
            return;
        }

        this.bookingLoading = true;
        this.cdr.detectChanges();

        // Find the selected slot to get the exact start time
        const selectedSlot = this.availableSlots.find((slot: any) => slot.time === this.bookingData.selectedTime);
        let dateTimeStr: string;

        if (selectedSlot && selectedSlot.start) {
            // Use the exact start time from the slot
            dateTimeStr = selectedSlot.start;
        } else {
            // Fallback: parse the time and combine with date
            const timeRegex = /(\d+):(\d+)\s*(AM|PM)/i;
            const match = this.bookingData.selectedTime.match(timeRegex);
            let hours = parseInt(match![1]);
            const minutes = parseInt(match![2]);
            const period = match![3].toUpperCase();

            // Convert to 24-hour format
            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;

            const appointmentDate = new Date(this.bookingData.selectedDate);
            appointmentDate.setHours(hours, minutes, 0);
            dateTimeStr = appointmentDate.toISOString();
        }

        const appointmentData = {
            doctorId: this.selectedDoctor.id,
            dateTime: dateTimeStr,
            reason: this.bookingData.reason
        };

        console.log('Booking appointment:', appointmentData);

        // Call API to book appointment
        this.patientService.bookAppointment(appointmentData).subscribe({
            next: (response) => {
                console.log('Appointment booked:', response);
                this.bookingLoading = false;
                alert('✅ Appointment booked successfully!');
                this.closeBookingModal();
                this.loadAppointments();
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error booking appointment:', err);
                this.bookingLoading = false;
                alert('❌ Failed to book appointment: ' + (err.error?.message || 'Please try again'));
                this.cdr.detectChanges();
            }
        });
    }

    switchTab(tab: 'upcoming' | 'past'): void {
        this.activeTab = tab;
        this.cdr.detectChanges();
    }

    cancelAppointment(appointment: any): void {
        if (confirm(`Are you sure you want to cancel the appointment with ${appointment.doctorName}?`)) {
            // Call API to cancel appointment
            console.log('Cancelling appointment:', appointment.id);
        }
    }

    rescheduleAppointment(appointment: any): void {
        // Open modal to reschedule
        this.openBookingModal(appointment.doctorId);
    }

    getStatusColor(status: string): string {
        switch(status) {
            case 'CONFIRMED':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'COMPLETED':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    }

    getStatusIcon(status: string): string {
        switch(status) {
            case 'CONFIRMED':
                return '✅';
            case 'PENDING':
                return '⏳';
            case 'COMPLETED':
                return '✓';
            case 'CANCELLED':
                return '❌';
            default:
                return '❓';
        }
    }

    // Helper to get minimum date (today, but if weekend then next Monday)
    getMinDate(): string {
        const today = new Date();
        const dayOfWeek = today.getDay();

        // If Saturday (6) or Sunday (0), move to next Monday
        if (dayOfWeek === 0) {
            today.setDate(today.getDate() + 1); // Sunday -> Monday
        } else if (dayOfWeek === 6) {
            today.setDate(today.getDate() + 2); // Saturday -> Monday
        }

        return today.toISOString().split('T')[0];
    }

    // Helper to get maximum date (90 days from now, only weekdays)
    getMaxDate(): string {
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 90);

        // If it lands on weekend, move to Friday of that week
        const dayOfWeek = maxDate.getDay();
        if (dayOfWeek === 0) {
            maxDate.setDate(maxDate.getDate() - 2); // Sunday -> Friday
        } else if (dayOfWeek === 6) {
            maxDate.setDate(maxDate.getDate() - 1); // Saturday -> Friday
        }

        return maxDate.toISOString().split('T')[0];
    }

    // Check if a date is a weekday (Monday-Friday)
    isWeekday(dateStr: string): boolean {
        const date = new Date(dateStr);
        const dayOfWeek = date.getDay();
        return dayOfWeek >= 1 && dayOfWeek <= 5; // Monday = 1, Friday = 5
    }
}

