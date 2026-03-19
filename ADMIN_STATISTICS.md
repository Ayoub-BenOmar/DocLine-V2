# Admin Statistics - Cities & Specialties Overview

## Overview

La page de statistiques permet à l'admin de visualiser un aperçu complet des villes et spécialités enregistrées, avec des statistiques sur le nombre de docteurs par ville et par spécialité.

## Features

### 1. Top 3 Cities with Most Doctors
- Affichage visuel des 3 villes avec le plus de docteurs
- Cartes individuelles avec :
  - Nom de la ville
  - Nombre total de docteurs
  - Rang (1er, 2e, 3e)
  - Barre de progression relative

### 2. Top 3 Specialties with Most Doctors
- Affichage visuel des 3 spécialités avec le plus de docteurs
- Cartes individuelles avec :
  - Nom de la spécialité
  - Nombre total de docteurs
  - Rang (1er, 2e, 3e)
  - Barre de progression relative

### 3. All Cities Overview Table
- Tableau complet de toutes les villes
- Colonnes :
  - Nom de la ville
  - Nombre de docteurs (badge coloré)
  - Barre de progression relative

### 4. All Specialties Overview Table
- Tableau complet de toutes les spécialités
- Colonnes :
  - Nom de la spécialité
  - Nombre de docteurs (badge coloré)
  - Barre de progression relative

## Accès à la fonctionnalité

- **URL**: `http://localhost:4200/admin/statistics`
- **Navigation**: Admin Dashboard → 📊 Statistics
- **Permission**: ROLE_ADMIN uniquement

## Architecture

### Frontend

#### Composant (`admin-statistics.component.ts`)
```typescript
- cities: City[]
- specialties: Specialty[]
- cityStatistics: CityStatistic[]
- specialtyStatistics: SpecialtyStatistic[]
- loading: boolean
- error: string
```

Méthodes :
- `loadStatistics()` - Charge toutes les données
- `loadCityStats()` - Charge statistiques des villes
- `loadSpecialtyStats()` - Charge statistiques des spécialités
- `getTopCities()` - Retourne les 3 premiers
- `getTopSpecialties()` - Retourne les 3 premiers
- `getTotalDoctorsInCity()` - Compte docteurs par ville
- `getTotalDoctorsInSpecialty()` - Compte docteurs par spécialité

#### Service (`admin.service.ts`)
```typescript
- getAllCities(): Observable<City[]>
- getAllSpecialties(): Observable<Specialty[]>
- getCityStatistics(): Observable<CityStatistic[]>
- getSpecialtyStatistics(): Observable<SpecialtyStatistic[]>
```

### Backend

#### DTOs créés
- `CityStatisticDto` : { cityName, doctorCount }
- `SpecialtyStatisticDto` : { specialiteName, doctorCount }

#### Endpoints
```
GET /api/admin/cities/statistics
- Returns: List<CityStatisticDto>
- Auth: ROLE_ADMIN
- Retourne la statistique de tous les villes avec nombre de docteurs

GET /api/admin/specialities/statistics
- Returns: List<SpecialtyStatisticDto>
- Auth: ROLE_ADMIN
- Retourne la statistique de tous les spécialités avec nombre de docteurs
```

#### Service Implementation
```java
AdminServiceImpl.getCityStatistics()
- Récupère tous les villes
- Compte les docteurs pour chaque ville
- Retourne liste de CityStatisticDto

AdminServiceImpl.getSpecialtyStatistics()
- Récupère toutes les spécialités
- Compte les docteurs pour chaque spécialité
- Retourne liste de SpecialtyStatisticDto
```

## States

### Loading State
- Affiche "⏳ Loading statistics..."
- Désactive l'interaction avec la page

### Error State
- Affiche message d'erreur avec icône "❌"
- Permet à l'utilisateur de comprendre le problème

### Success State
- Affiche :
  - Top 3 sections avec cartes colorées
  - Tableaux complets avec barres de progression
  - Empty states si pas de données

## UI Components

### Top 3 Cards
- Gradient background (blue pour villes, purple pour spécialités)
- Display du rang avec numéro
- Compteur large du nombre de docteurs
- Barre de progression relative au maximum

### Tables
- Design responsive
- Hover effects
- Badges colorés pour les compteurs
- Barres de progression visuelles
- Support des états vides

## Interactions

### Chargement parallèle
- Utilise `forkJoin()` pour charger toutes les données en parallèle
- Affiche les résultats une fois tous les appels complétés
- Gère les erreurs individuellement

### Tri automatique
- Les statistiques sont triées par nombre de docteurs (décroissant)
- Les top 3 sont automatiquement affichés en premier

## Notes d'implémentation

- **Chargement**: Les données sont chargées au NgOnInit du composant
- **Tri**: Les arrays sont triés client-side pour éviter des requêtes supplémentaires
- **Responsivité**: Design fully responsive (mobile, tablet, desktop)
- **Performance**: Les statistiques sont calculées côté backend pour éviter la surcharge client
- **Auth**: Tous les endpoints sont protégés par @PreAuthorize("hasAuthority('ROLE_ADMIN')")

## Exemple de réponse API

```json
// GET /api/admin/cities/statistics
[
  { "cityName": "Casablanca", "doctorCount": 15 },
  { "cityName": "Marrakech", "doctorCount": 12 },
  { "cityName": "Rabat", "doctorCount": 8 },
  { "cityName": "Fes", "doctorCount": 5 }
]

// GET /api/admin/specialities/statistics
[
  { "specialiteName": "Cardiology", "doctorCount": 10 },
  { "specialiteName": "Dermatology", "doctorCount": 8 },
  { "specialiteName": "Pediatrics", "doctorCount": 7 },
  { "specialiteName": "Neurology", "doctorCount": 5 }
]
```

## Commits

- `175eb54` - feat: add admin statistics page with top 3 cities and specialties
- `1d792b0` - feat: implement statistics methods in admin service and controller
- `6ba0fa7` - fix: update statistics component and related files

## Prochaines améliorations possibles

- [ ] Export des statistiques en CSV/PDF
- [ ] Graphiques plus avancés (charts, pie charts)
- [ ] Filtre temporel (statistiques par mois/année)
- [ ] Comparaison entre périodes
- [ ] Alertes si une ville/spécialité n'a pas de docteur

