import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { PatientService, AppointmentResponseDto } from '../services/patient.service';
import { PublicService } from '../../../core/services/public.service';
import jsPDF from 'jspdf';

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
    }

    loadAppointments(): void {
        this.loading = true;
        this.cdr.detectChanges();

        this.patientService.getAppointments().subscribe({
            next: (appointments) => {
                console.log('Appointments loaded:', appointments);
                const now = new Date();

                const mappedAppointments = appointments.map((apt: any) => {
                    const aptDate = new Date(apt.dateTime);
                    return {
                        ...apt,
                        date: aptDate.toLocaleDateString(),
                        time: aptDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        speciality: apt.doctorSpeciality,
                        dateTimeObj: aptDate
                    };
                });

                this.upcomingAppointments = mappedAppointments.filter((apt: any) =>
                    apt.dateTimeObj >= now && apt.status !== 'COMPLETED' && apt.status !== 'CANCELLED'
                );
                this.pastAppointments = mappedAppointments.filter((apt: any) =>
                    apt.dateTimeObj < now || apt.status === 'COMPLETED' || apt.status === 'CANCELLED'
                );

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

        console.log('Fetching slots for doctor:', this.selectedDoctor.id, 'Date:', this.bookingData.selectedDate);

        this.patientService.getDoctorSlots(this.selectedDoctor.id, this.bookingData.selectedDate).subscribe({
            next: (slots: any[]) => {
                console.log('Raw slots response:', slots);
                console.log('Response type:', typeof slots);
                console.log('Is array:', Array.isArray(slots));

                if (!Array.isArray(slots)) {
                    console.error('Slots response is not an array:', slots);
                    this.availableSlots = [];
                    this.slotsLoading = false;
                    alert('⚠️ Unexpected response format');
                    this.cdr.detectChanges();
                    return;
                }

                this.availableSlots = slots
                    .map((slot: any) => {
                        console.log('Processing slot:', slot);
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
                console.error('Error loading slots - Full error:', err);
                console.error('Error status:', err.status);
                console.error('Error message:', err.message);
                console.error('Error response:', err.error);

                this.availableSlots = [];
                this.slotsLoading = false;

                let errorMsg = '❌ Failed to load available slots';
                if (err.status === 401) {
                    errorMsg = '❌ Authentication failed. Please login again.';
                } else if (err.status === 400) {
                    errorMsg = '❌ Invalid date format. Please select another date.';
                } else if (err.status === 404) {
                    errorMsg = '❌ Doctor not found.';
                } else if (err.error?.message) {
                    errorMsg = '❌ ' + err.error.message;
                }

                alert(errorMsg);
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

        const selectedSlot = this.availableSlots.find((slot: any) => slot.time === this.bookingData.selectedTime);
        let dateTimeStr: string;

        if (selectedSlot && selectedSlot.start) {
            dateTimeStr = selectedSlot.start;
        } else {
            const timeRegex = /(\d+):(\d+)\s*(AM|PM)/i;
            const match = this.bookingData.selectedTime.match(timeRegex);
            let hours = parseInt(match![1]);
            const minutes = parseInt(match![2]);
            const period = match![3].toUpperCase();

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
        this.openBookingModal(appointment.doctorId);
    }

    downloadReport(appointment: any): void {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;

        // Check if report data exists
        if (!appointment.doctorNote) {
            alert('Medical report is not available yet.');
            return;
        }

        // Header
        doc.setFontSize(22);
        doc.setTextColor(41, 128, 185); // Blue
        doc.text('DocLine Medical Report', pageWidth / 2, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Report Date: ${new Date(appointment.medicalReportDate || new Date()).toLocaleDateString()}`, 20, 35);

        // Doctor Info
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.setFont('helvetica', 'bold');
        doc.text('Doctor Information', 20, 50);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.text(`Name: ${appointment.doctorName}`, 20, 60);
        doc.text(`Speciality: ${appointment.speciality || appointment.doctorSpeciality}`, 20, 68);

        // Patient Info
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Patient Information', 20, 85);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.text(`Name: ${appointment.patientName}`, 20, 95);

        if (appointment.patientBloodType) doc.text(`Blood Type: ${appointment.patientBloodType}`, 20, 103);

        // Medical Details
        let yPos = 120;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Medical Assessment', 20, yPos);
        yPos += 10;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);

        const fields = [
          { label: 'Past Illnesses', value: appointment.patientPastIllnesses },
          { label: 'Surgeries', value: appointment.patientSurgeries },
          { label: 'Allergies', value: appointment.patientAllergies },
          { label: 'Chronic Conditions', value: appointment.patientChronic },
          { label: 'Doctor Notes', value: appointment.doctorNote }
        ];

        fields.forEach(field => {
          if (field.value) {
            doc.setFont('helvetica', 'bold');
            doc.text(`${field.label}:`, 20, yPos);
            doc.setFont('helvetica', 'normal');

            // Handle multiline text
            const splitText = doc.splitTextToSize(field.value, pageWidth - 40);
            doc.text(splitText, 20, yPos + 7);
            yPos += 10 + (splitText.length * 5);
          }
        });

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text('Generated by DocLine System', pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });

        doc.save(`Medical_Report_${appointment.date || 'report'}.pdf`);
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

    getMinDate(): string {
        const today = new Date();
        const dayOfWeek = today.getDay();

        if (dayOfWeek === 0) {
            today.setDate(today.getDate() + 1);
        } else if (dayOfWeek === 6) {
            today.setDate(today.getDate() + 2);
        }

        return today.toISOString().split('T')[0];
    }

    getMaxDate(): string {
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 90);

        const dayOfWeek = maxDate.getDay();
        if (dayOfWeek === 0) {
            maxDate.setDate(maxDate.getDate() - 2);
        } else if (dayOfWeek === 6) {
            maxDate.setDate(maxDate.getDate() - 1);
        }

        return maxDate.toISOString().split('T')[0];
    }

    isWeekday(dateStr: string): boolean {
        const date = new Date(dateStr);
        const dayOfWeek = date.getDay();
        return dayOfWeek >= 1 && dayOfWeek <= 5;
    }
}

