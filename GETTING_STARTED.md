# Guide de démarrage - DocLine V2

## Démarrer l'application

### 1. Backend (Spring Boot)

#### Option A : Avec Maven (plus lent la première fois, ~3-5 minutes)
```bash
cd Backend
mvn spring-boot:run -DskipTests
```

#### Option B : Compiler en JAR puis exécuter (plus rapide après)
```bash
cd Backend
mvn clean package -DskipTests
java -jar target/DocLine-0.0.1-SNAPSHOT.jar
```

Le backend démarre sur `http://localhost:8080`

### 2. Frontend (Angular)

```bash
cd Frontend/frontend-app
ng serve
```

Le frontend démarre sur `http://localhost:4200`

## Points importants

- **Le backend DOIT être lancé avant de pouvoir afficher les docteurs**
- Les endpoints publics sont sur `/api/public/` :
  - `GET /api/public/doctors?page=0&size=10` - Liste des docteurs
  - `GET /api/public/cities` - Liste des villes
  - `GET /api/public/specialities` - Liste des spécialités

## Dépannage

### Si aucun docteur n'apparaît :
1. Vérifiez que le backend est en cours d'exécution sur `http://localhost:8080`
2. Vérifiez la console du navigateur (F12) pour les erreurs réseau
3. Cliquez sur le bouton "Retry Loading" sur la page Doctors

### Si le port 4200 est déjà utilisé :
```bash
ng serve --port 4300
```

### Si Maven est trop lent :
- Utilisez l'Option B ci-dessus pour la prochaine fois
- Ou attendez 5-10 minutes la première fois

## Structure des routes

- `/` - Page d'accueil (publique)
- `/doctors` - Liste des docteurs (publique)
- `/auth/login` - Login
- `/auth/register` - Inscription
- `/admin/dashboard` - Dashboard admin (protégé)
- `/doctor/dashboard` - Dashboard docteur (protégé)
- `/patient/dashboard` - Dashboard patient (protégé)

