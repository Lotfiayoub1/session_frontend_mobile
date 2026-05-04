# Session Booking Mobile App

React Native (Expo) mobile app that mirrors the Session Booking web platform.

## Quick Start

```bash
npm install
npx expo start
```

Then press:
- `i` — iOS simulator
- `a` — Android emulator
- `w` — Web browser
- Scan the QR code with **Expo Go** on your device

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Student | `alice@student.com` | `password` |
| Admin | `admin@jean-moulin.edu` | `admin123` |
| Super Admin | `superadmin@app.com` | `super123` |

---

## Project Structure

```
src/
├── models/          # TypeScript interfaces (User, Session, Booking, …)
├── data/            # Static mock data (same entities as web app)
├── services/        # Data access layer — swap for API calls later
├── context/         # AuthContext, AppContext (React Context + hooks)
├── navigation/      # React Navigation (stack + bottom tabs per role)
├── screens/
│   ├── auth/          # LoginScreen
│   ├── sessions/      # SessionList, SessionDetail, SessionCalendar
│   ├── booking/       # MyBookings, BookingForm
│   ├── student/       # ProgramsScreen (chapter interests + auto-booking)
│   ├── documents/     # DocumentsScreen
│   ├── profile/       # ProfileScreen
│   ├── admin/         # Dashboard, Sessions, Students, Credits, Analytics
│   └── super-admin/   # Overview, Schools, Users
└── components/      # SessionCard, BookingCard, StatusBadge, EmptyState
└── utils/           # theme.ts, format.ts
```

---

## Architecture (Backend-Ready)

All data access goes through a **service layer** (`src/services/`). Each service exposes an interface:

```ts
export interface SessionServiceInterface {
  getSessions(filter?: SessionFilter): Promise<Session[]>;
  getSessionById(id: number): Promise<Session | null>;
  createSession(req: CreateSessionRequest): Promise<Session>;
  // …
}
```

To connect to a real backend, replace the mock implementations in each service file with API calls — **no screen or component changes needed**.

---

## Features

### Student
- Browse & search sessions (subject, status filters)
- Calendar view of sessions
- Book / cancel sessions
- My Bookings with status filter
- Academic Programs with chapter interest toggling (drives auto-booking)
- Documents library
- Profile & sign out

### Admin
- Dashboard with school stats
- Session management (create, edit, delete, classroom view with attendance)
- Student management (list, profile, create)
- Credit management (add / deduct with reason)
- Interest analytics (ranked chapter popularity)
- Document upload

### Super Admin
- Platform overview (all schools)
- School management (activate / deactivate)
- User management (admins & students)

---

## Persistence

Bookings and chapter interests are persisted via **AsyncStorage** so they survive app restarts. Auth session is also stored locally.

---

## Tech Stack

- React Native 0.74 + Expo 51
- TypeScript (strict)
- React Navigation 6 (Stack + Bottom Tabs)
- React Native Paper (Material Design 3)
- AsyncStorage (local persistence)
- date-fns (date formatting)
- @expo/vector-icons (Ionicons)
