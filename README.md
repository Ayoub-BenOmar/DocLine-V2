<p align="center">
  <img src="Frontend/frontend-app/public/logo.png" alt="DocLine Logo" width="200"/>
</p>

<h1 align="center">DocLine</h1>

<p align="center">
  <strong>Healthcare Appointment Booking Platform for Morocco</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#api-endpoints">API</a> •
  <a href="#project-structure">Structure</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular"/>
  <img src="https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot"/>
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
</p>

---

## Overview

**DocLine** is a modern healthcare appointment booking platform designed specifically for Morocco. It connects patients with verified doctors, enabling seamless appointment scheduling across multiple cities and medical specialties.

---

## Features

### For Patients
- Register with complete medical history (blood type, allergies, chronic conditions)
- Search doctors by city, specialty, and name
- Book appointments with real-time slot availability
- Manage appointments (view, cancel, reschedule)
- Access medical reports after appointments

### For Doctors
- Professional registration with document verification
- Manage profile (bio, fees, experience, education)
- View and complete appointments with medical notes
- Set unavailability periods
- Generate medical reports

### For Administrators
- Verify and approve doctor registrations
- Manage users (suspend patients/doctors)
- Manage system data (cities, specialties)
- View statistics and analytics

---

## Tech Stack

### Frontend

<p>
  <img src="https://img.shields.io/badge/Angular-21.1.0-DD0031?style=flat-square&logo=angular&logoColor=white" alt="Angular"/>
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/RxJS-7.8-B7178C?style=flat-square&logo=reactivex&logoColor=white" alt="RxJS"/>
  <img src="https://img.shields.io/badge/Vitest-4.0-6E9F18?style=flat-square&logo=vitest&logoColor=white" alt="Vitest"/>
</p>

### Backend

<p>
  <img src="https://img.shields.io/badge/Java-17-ED8B00?style=flat-square&logo=openjdk&logoColor=white" alt="Java"/>
  <img src="https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?style=flat-square&logo=spring-boot&logoColor=white" alt="Spring Boot"/>
  <img src="https://img.shields.io/badge/Spring_Security-JWT-6DB33F?style=flat-square&logo=spring-security&logoColor=white" alt="Spring Security"/>
  <img src="https://img.shields.io/badge/Hibernate-JPA-59666C?style=flat-square&logo=hibernate&logoColor=white" alt="Hibernate"/>
  <img src="https://img.shields.io/badge/MapStruct-1.5-FF6B6B?style=flat-square" alt="MapStruct"/>
</p>

### Database & DevOps

<p>
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/Nginx-Alpine-009639?style=flat-square&logo=nginx&logoColor=white" alt="Nginx"/>
  <img src="https://img.shields.io/badge/GitHub_Actions-CI/CD-2088FF?style=flat-square&logo=github-actions&logoColor=white" alt="GitHub Actions"/>
</p>

---

## Getting Started

### Prerequisites

- Node.js 22+
- Java 17+
- Docker & Docker Compose
- PostgreSQL 16 (or use Docker)

### Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/yourusername/DocLine-V2.git
cd DocLine-V2

# Create environment file
cp .env.example .env
# Edit .env with your configuration

# Start all services
docker-compose up -d
```

Access the application:
- Frontend: http://localhost:4200
- Backend API: http://localhost:8080
- PostgreSQL: localhost:5432

### Manual Setup

#### Backend

```bash
cd Backend

# Configure database in application.properties or .env
# DB_PASSWORD=your_password
# JWT_SECRET=your_jwt_secret

# Build and run
./mvnw spring-boot:run
```

#### Frontend

```bash
cd Frontend/frontend-app

# Install dependencies
npm install

# Start development server
npm start
```

---

## Project Structure

```
DocLine-V2/
├── Backend/
│   └── src/main/java/org/ayoub/docline/
│       ├── config/           # Security & JWT configuration
│       ├── controller/       # REST API endpoints
│       │   ├── admin/        # Admin operations
│       │   ├── auth/         # Authentication
│       │   ├── doctor/       # Doctor operations
│       │   ├── patient/      # Patient operations
│       │   └── public_data/  # Public endpoints
│       ├── model/
│       │   ├── dto/          # Data Transfer Objects
│       │   ├── entity/       # JPA entities
│       │   └── enums/        # Enumerations
│       ├── repository/       # JPA repositories
│       └── service/          # Business logic
│
├── Frontend/frontend-app/
│   └── src/app/
│       ├── core/             # Guards, interceptors, services
│       ├── features/
│       │   ├── admin/        # Admin dashboard
│       │   ├── auth/         # Login & registration
│       │   ├── doctor/       # Doctor dashboard
│       │   ├── patient/      # Patient dashboard
│       │   └── public/       # Public pages
│       └── shared/           # Shared components
│
├── .github/workflows/        # CI/CD pipelines
└── docker-compose.yml        # Docker orchestration
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/authenticate` | Login |
| GET | `/api/auth/me` | Get current user |

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/doctors` | List doctors (paginated) |
| GET | `/api/public/cities` | List all cities |
| GET | `/api/public/specialities` | List all specialties |

### Patient
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patient/doctors` | Search doctors |
| GET | `/api/patient/doctors/{id}/slots` | Get available slots |
| POST | `/api/patient/appointments` | Book appointment |
| GET | `/api/patient/appointments` | View appointments |
| PUT | `/api/patient/appointments/{id}/cancel` | Cancel appointment |

### Doctor
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctor/appointments` | View appointments |
| POST | `/api/doctor/appointments/{id}/complete` | Complete with report |
| GET/POST | `/api/doctor/unavailability` | Manage unavailability |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/doctors/pending` | List pending doctors |
| PUT | `/api/admin/doctors/{id}/approve` | Approve doctor |
| PUT | `/api/admin/doctors/{id}/reject` | Reject doctor |
| CRUD | `/api/admin/cities` | Manage cities |
| CRUD | `/api/admin/specialities` | Manage specialties |

---

## Database Schema

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │     │   Doctor    │     │   Patient   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id          │◄────│ (inherits)  │     │ (inherits)  │
│ firstName   │     │ specialty   │     │ birthdate   │
│ lastName    │     │ city        │     │ bloodType   │
│ email       │     │ fees        │     │ allergies   │
│ password    │     │ experience  │     │ surgeries   │
│ phone       │     │ status      │     │ conditions  │
│ role        │     └─────────────┘     └─────────────┘
└─────────────┘
        │
        ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Appointment │     │    City     │     │  Specialty  │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id          │     │ id          │     │ id          │
│ doctor_id   │     │ name        │     │ name        │
│ patient_id  │     └─────────────┘     └─────────────┘
│ dateTime    │
│ status      │     ┌─────────────┐
│ reason      │     │Unavailability│
│ doctorNote  │     ├─────────────┤
└─────────────┘     │ doctor_id   │
                    │ startDate   │
                    │ endDate     │
                    │ reason      │
                    └─────────────┘
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DB_PASSWORD` | PostgreSQL password |
| `JWT_SECRET` | Secret key for JWT signing (min 256 bits) |
| `SPRING_DATASOURCE_URL` | Database connection URL |

---

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment:

1. **Build & Test** - Runs on every push and PR
   - Frontend: Lint, test, and build
   - Backend: Maven verify with PostgreSQL

2. **Docker Build** - On push to main
   - Builds Docker images for both services

---

## License

This project is licensed under the MIT License.

---

<p align="center">
  Made with ❤️ for healthcare in Morocco
</p>
