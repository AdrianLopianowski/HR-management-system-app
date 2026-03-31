# 🚀 Stafflou - System Zarządzania Zespołem (SaaS)

🎓 **Projekt zrealizowany w ramach pracy inżynierskiej.**

Stafflou to nowoczesna aplikacja webowa typu SaaS (Software as a Service) służąca do kompleksowego zarządzania przestrzeniami roboczymi, zespołami oraz zadaniami wewnątrz firmy. Projekt został zaprojektowany z myślą o wysokiej wydajności, skalowalności oraz nowoczesnym interfejsie użytkownika inspirowanym najlepszymi rozwiązaniami na rynku (m.in. Discord, Slack).

## 🛠️ Wykorzystane Technologie

Projekt został zbudowany w architekturze Full-Stack z wykorzystaniem najnowszych standardów rynkowych:

### Frontend

- **Angular 19** - Główny framework SPA (Single Page Application)
- **Tailwind CSS** - Stylowanie i responsywność (RWD) interfejsu
- **Firebase Auth** - Zewnętrzny dostawca usług autoryzacji (Identity Provider)

### Backend (W trakcie wdrażania)

- **NestJS** - Nowoczesny framework Node.js oparty na architekturze modułowej
- **PostgreSQL** - Relacyjna baza danych
- **Docker** - Konteneryzacja środowiska deweloperskiego i produkcyjnego

---

## ✨ Zrealizowane Funkcjonalności

Obecnie aplikacja posiada w pełni funkcjonalny, bezpieczny moduł autoryzacji oraz interfejs użytkownika:

- 🔒 **Kompleksowa Autoryzacja (Firebase):**
  - Rejestracja i logowanie przy użyciu adresu e-mail i hasła.
  - Logowanie federacyjne przez konto **Google (OAuth)**.
  - Twarda weryfikacja adresów e-mail (wstrzymywanie dostępu do czasu potwierdzenia linku).
  - System resetowania hasła.
- 🛡️ **Ochrona Ścieżek (Route Guards):**
  - `AuthGuard` - Zabezpiecza aplikację przed dostępem osób wylogowanych.
  - `GuestGuard` - Zapobiega ponownemu logowaniu/rejestracji przez aktywnych użytkowników.
- 🎨 **Nowoczesny Interfejs (UI/UX):**
  - Responsywny Landing Page (Marketing/Logowanie).
  - Trójkolumnowy **Dashboard** (Przestrzenie robocze -> Zespoły -> Obszar roboczy/Zadania).
  - Automatyczne zarządzanie stanem sesji i płynne przekierowania.

---

## 🚀 Uruchomienie projektu (Środowisko deweloperskie)

### Wymagania wstępne:

- Node.js (wersja 20+)
- Angular CLI (`npm install -g @angular/cli`)
- Docker i Docker Compose (dla bazy danych)

### 1. Uruchomienie Frontendu

Wejdź do folderu frontend, zainstaluj zależności i uruchom serwer deweloperski:

```bash
cd frontend
npm install
ng serve
```
