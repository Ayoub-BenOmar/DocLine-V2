import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, Specialty } from '../services/admin.service';

@Component({
    selector: 'app-admin-specialties',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin-specialties.component.html',
    styleUrl: './admin-specialties.component.css'
})
export class AdminSpecialtiesComponent implements OnInit {
    specialties: Specialty[] = [];
    newSpecialtyName = '';
    editingId: number | null = null;
    editingName = '';

    loading = true;
    error = '';
    message = '';
    messageType: 'success' | 'error' = 'success';
    addingSpecialty = false;

    constructor(private adminService: AdminService, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.loadSpecialties();
    }

    loadSpecialties(): void {
        this.loading = true;
        this.adminService.getAllSpecialties().subscribe({
            next: (data) => {
                this.specialties = data;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading specialties:', err);
                this.error = 'Failed to load specialties';
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    addSpecialty(): void {
        if (!this.newSpecialtyName.trim()) {
            this.showMessage('❌ Please enter a specialty name', 'error');
            return;
        }

        this.addingSpecialty = true;
        const newSpecialty: Specialty = { specialiteName: this.newSpecialtyName };

        this.adminService.addSpecialty(newSpecialty).subscribe({
            next: (response) => {
                this.specialties.push(response);
                this.newSpecialtyName = '';
                this.addingSpecialty = false;
                this.cdr.detectChanges();
                this.showMessage('✅ Specialty added successfully!', 'success');
            },
            error: (err) => {
                console.error('Error adding specialty:', err);
                this.addingSpecialty = false;
                this.cdr.detectChanges();
                this.showMessage('❌ Failed to add specialty', 'error');
            }
        });
    }

    startEdit(specialty: Specialty): void {
        this.editingId = specialty.id ?? null;
        this.editingName = specialty.specialiteName;
        this.cdr.detectChanges();
    }

    cancelEdit(): void {
        this.editingId = null;
        this.editingName = '';
        this.cdr.detectChanges();
    }

    saveEdit(specialty: Specialty): void {
        if (!this.editingName.trim()) {
            this.showMessage('❌ Specialty name cannot be empty', 'error');
            return;
        }

        const updatedSpecialty: Specialty = { ...specialty, specialiteName: this.editingName };
        this.adminService.updateSpecialty(specialty.id!, updatedSpecialty).subscribe({
            next: () => {
                specialty.specialiteName = this.editingName;
                this.editingId = null;
                this.cdr.detectChanges();
                this.showMessage('✅ Specialty updated successfully', 'success');
            },
            error: (err) => {
                console.error('Error updating specialty:', err);
                this.cdr.detectChanges();
                this.showMessage('❌ Failed to update specialty', 'error');
            }
        });
    }

    deleteSpecialty(specialty: Specialty): void {
        if (confirm(`Are you sure you want to delete "${specialty.specialiteName}"?`)) {
            this.adminService.deleteSpecialty(specialty.id!).subscribe({
                next: () => {
                    const index = this.specialties.indexOf(specialty);
                    if (index > -1) {
                        this.specialties.splice(index, 1);
                    }
                    this.cdr.detectChanges();
                    this.showMessage('✅ Specialty deleted successfully', 'success');
                },
                error: (err) => {
                    console.error('Error deleting specialty:', err);
                    this.cdr.detectChanges();
                    this.showMessage('❌ Failed to delete specialty', 'error');
                }
            });
        }
    }

    private showMessage(msg: string, type: 'success' | 'error'): void {
        this.message = msg;
        this.messageType = type;
        this.cdr.detectChanges();
        setTimeout(() => {
            this.message = '';
            this.cdr.detectChanges();
        }, 4000);
    }
}

