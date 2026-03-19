# Admin Dashboard - City and Specialty Management

## Overview

L'admin peut maintenant ajouter directement des villes et des spécialités depuis le dashboard admin.

## Features

### 1. Add City
- **Endpoint**: `POST /api/admin/cities`
- **Request Body**:
```json
{
  "cityName": "Casablanca"
}
```
- **Frontend Location**: Admin Dashboard → ➕ Add City section

### 2. Add Specialty
- **Endpoint**: `POST /api/admin/specialities`
- **Request Body**:
```json
{
  "specialiteName": "Cardiology"
}
```
- **Frontend Location**: Admin Dashboard → ➕ Add Specialty section

## UI Components

### Admin Dashboard (`/admin/dashboard`)

#### Add City Form
- Input field for city name
- Submit button with loading state
- Success/error message display
- Auto-clear form on success

#### Add Specialty Form
- Input field for specialty name
- Submit button with loading state
- Success/error message display
- Auto-clear form on success

#### Quick Links
- Link to Manage Doctors
- Link to View Patients

## Implementation Details

### Frontend Files Modified

1. **admin.service.ts**
   - Added `City` interface
   - Added `Specialty` interface
   - Added `addCity(city: City)` method
   - Added `addSpecialty(specialty: Specialty)` method

2. **admin-dashboard.component.ts**
   - Added form state management (newCity, newSpecialty)
   - Added loading states (addingCity, addingSpecialty)
   - Added message management (cityMessage, specialtyMessage)
   - Implemented `addCity()` method
   - Implemented `addSpecialty()` method
   - Added success/error handling with 3-second message timeout

3. **admin-dashboard.component.html**
   - Replaced stats cards with management forms
   - Added Add City form section
   - Added Add Specialty form section
   - Added Quick Links section
   - Added loading and error states

## Usage Flow

1. Admin logs in and navigates to `/admin/dashboard`
2. Scrolls to "Add City" section
3. Enters city name (e.g., "Marrakech")
4. Clicks "Add City" button
5. Receives success/error message
6. Form clears on success
7. Same process for specialties

## Error Handling

- **Empty Input**: Shows "❌ Please enter a city/specialty name"
- **Network Error**: Shows "❌ Failed to add city/specialty. Please try again."
- **Success**: Shows "✅ City/Specialty added successfully!"
- **Auto-clear**: Messages disappear after 3 seconds

## Notes

- Both forms use form validation with `#form="ngForm"` and `required` attribute
- Loading states disable buttons during submission
- Service methods use HTTP POST requests with auth interceptor
- Cities and specialties will be available immediately in filters on public doctors page

