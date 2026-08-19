Absolutely. Since this is going into your GitHub repository, I’d make the README professional and developer-friendly, while keeping your original architecture and feature scope intact.

# 🕉️ Japa Counter

A native Android mantra japa counting application built with **React Native + Expo**, designed for focused, eyes-closed counting sessions with configurable milestones, voice/bell announcements, haptic feedback, session history, and multi-profile support.

The app is designed to work **offline-first** and can optionally synchronize session history across devices using Firebase Authentication and MongoDB Atlas.

> **Distribution:** Android sideloaded APK
> **Target users:** Personal use and a small group of trusted users
> **Primary focus:** Simple, distraction-free, reliable japa counting

---

## ✨ Features

### 🔢 Profile-Driven Japa Counter

The counting engine is completely independent of any specific mantra.

Users can create multiple profiles such as:

* Gayatri Mantra
* Mahamrityunjaya Mantra
* Hanuman Chalisa
* Custom Japa
* Any other counting-based practice

Each profile has its own configuration.

* Full-screen tap-to-count
* Targets: `108`, `1008`, or custom
* Configurable milestone intervals
* Custom milestone announcement phrase
* Voice announcements
* Bell/gong announcements
* Voice + bell mode
* Haptic feedback
* Optional background ambience
* Pause/resume
* Undo last count
* Long-press reset protection
* Multi-touch protection
* Automatic completion detection
* Mala tracking for 1008-count sessions

Adding a new mantra does **not** require changes to the counting engine.

---

## 🧘 Session Experience

The counting screen is designed specifically for distraction-free and eyes-closed usage.

### Session screen

* Pure-black interface
* Full-screen tap area
* Minimal visual elements
* Screen stays awake during the session
* No unnecessary UI interaction
* Haptic feedback for counting
* Milestone feedback
* Completion feedback

### Example

```text
              Gayatri

                48

        Tap anywhere to count

              ─────

        Target: 108
```

The user can focus on the mantra without needing to look at the screen.

---

## 🔔 Milestone Announcements

Milestones can be configured independently for every profile.

Example:

```text
Count: 50
↓
Voice: "50 completed"
```

Or with a custom phrase:

```text
"50 japa complete"
```

Supported audio modes:

| Mode  | Description                  |
| ----- | ---------------------------- |
| Voice | Text-to-speech announcements |
| Bell  | Bell/gong sound              |
| Both  | Voice + bell                 |
| Off   | No audio                     |

Milestone intervals are configurable.

Default:

```text
Every 50 counts
```

---

## 📿 Mala Tracking

For a `1008` target, the application automatically tracks 108-count malas.

```text
108  → 1 Mala
216  → 2 Malas
324  → 3 Malas
...
972  → 9 Malas
1008 → Complete
```

The application can announce each completed mala.

---

## 📱 Mantra Profiles

Profiles are a core part of the application.

Each profile contains its own settings.

```typescript
interface MantraProfile {
  id: string;
  userId: string;
  name: string;
  icon?: string;
  defaultTarget: number;
  milestoneInterval: number;
  milestonePhrase: string;
  audioMode: 'voice' | 'bell' | 'both' | 'off';
  vibrationEnabled: boolean;
  voiceURI?: string;
  ambienceEnabled: boolean;
  createdAt: number;
  archived: boolean;
}
```

### Profile operations

* Create
* Edit
* Duplicate
* Archive
* Switch active profile

Archived profiles are hidden from the active profile list but their historical sessions remain available.

---

## 📊 History & Statistics

Every completed session is automatically stored.

History contains:

* Date
* Time
* Profile
* Session period
* Count
* Target
* Completion status
* Duration

### Session periods

Sessions are automatically classified as:

| Time          | Period    |
| ------------- | --------- |
| 04:00 – 12:00 | Morning   |
| 12:00 – 17:00 | Afternoon |
| 17:00 – 22:00 | Evening   |

The period can be edited when required.

Multiple sessions can exist within the same period.

---

## 📈 Statistics

Statistics are available both **per profile** and across **all profiles**.

### Available statistics

* Current streak
* All-time total
* Weekly total
* Monthly total
* Yearly total
* Daily totals
* Session totals
* Completed vs incomplete sessions

### Calendar heatmap

A GitHub-style activity heatmap visualizes japa activity over time.

Users can view:

* Individual profile activity
* Combined activity across profiles

---

## 💾 Offline-First Architecture

The application is designed to remain functional without an internet connection.

### Local-first flow

```text
User taps
   ↓
Counter updates immediately
   ↓
Session completed
   ↓
Saved locally
   ↓
Internet available?
   ├── Yes → Sync with server
   └── No  → Keep pending locally
                ↓
             Retry later
```

Counting does not depend on an active internet connection.

---

## ☁️ Cloud Synchronization

When authentication and synchronization are enabled, session data is synchronized across devices.

### Sync architecture

```text
┌───────────────────────────────┐
│       React Native App        │
│                               │
│  Local SQLite / AsyncStorage  │
└───────────────┬───────────────┘
                │
                │ Background Sync
                ▼
┌───────────────────────────────┐
│       Next.js API Routes      │
│                               │
│      JWT Authentication       │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│        MongoDB Atlas           │
│                               │
│  profiles    sessions         │
└───────────────────────────────┘
```

Session IDs are client-generated UUIDs and act as idempotency keys to prevent duplicate records during retries.

---

## 🔐 Authentication

Authentication uses:

**Firebase Authentication**

Login flow:

```text
Phone Number
     ↓
OTP
     ↓
Firebase Authentication
     ↓
Firebase UID
     ↓
Authenticated API requests
```

The server validates the Firebase JWT before processing protected requests.

The `userId` is derived from the verified token rather than being trusted from the client request body.

---

## 🗄️ Database

The application uses **MongoDB Atlas**.

### Collections

```text
profiles
sessions
```

### Profiles indexes

```text
userId
```

### Sessions indexes

```text
userId + profileId + date
```

---

## 📦 Session Data Model

```typescript
interface SessionLog {
  id: string;
  userId: string;
  profileId: string;
  date: string;
  period: 'morning' | 'afternoon' | 'evening';
  count: number;
  target: number;
  completed: boolean;
  startedAt: number;
  completedAt: number;
  durationSec: number;
}
```

---

## 🎨 Theming

### Counting screen

The counting screen uses a pure-black theme to minimize distractions and prevent bright flashes during eyes-closed sessions.

### Other screens

Setup, history, and settings support:

* Dark mode
* Light mode

---

## 🔊 Audio & Haptics

### Text-to-Speech

Uses:

```text
expo-speech
```

TTS is initialized during session startup to reduce the possibility of the first announcement being silent or delayed.

### Haptics

Uses:

```text
expo-haptics
```

Different patterns are used for:

* Normal count
* Milestone
* Completion

### Ambience

Optional offline ambience can be bundled with the application.

Examples:

* Om chant
* Soft bell drone
* Meditation ambience

---

## 🔋 Device Features

The application uses:

| Feature          | Technology                     |
| ---------------- | ------------------------------ |
| Screen Wake      | `expo-keep-awake`              |
| TTS              | `expo-speech`                  |
| Haptics          | `expo-haptics`                 |
| Background Tasks | `expo-task-manager`            |
| Background Fetch | `expo-background-fetch`        |
| Notifications    | `expo-notifications`           |
| Local Storage    | `expo-sqlite` / `AsyncStorage` |

The screen wake lock is re-acquired when the application returns to the foreground.

---

## 🛡️ Session Safety

Several mechanisms prevent accidental counts or resets.

### Multi-touch protection

Secondary touches are ignored to prevent accidental double counting.

### Reset protection

Reset requires a deliberate **2-second long press** followed by confirmation.

### Undo

The previous count can be undone using the configured gesture.

### Crash recovery

An in-progress session is persisted locally so that the application can recover after an unexpected reload or crash.

---

## 🔋 Battery Warning

Long sessions, especially `1008`-count sessions, can keep the screen awake for an extended period.

The application can display a battery warning before starting a long session when the device battery is low.

---

## 📤 Export & Backup

Users can manually export their history.

Supported formats:

```text
CSV
JSON
```

Exported data includes:

* Profile name
* Profile ID
* Date
* Period
* Count
* Target
* Completion status
* Start time
* Completion time
* Duration

Periodic backup reminders can also be enabled.

---

## 📱 Application Screens

### 1. Login

```text
Phone Number
      ↓
Send OTP
      ↓
Verify OTP
```

### 2. Home / Profile Switcher

Displays active mantra profiles.

Actions:

* Select profile
* Create profile
* Edit profile
* Duplicate profile
* Archive profile

### 3. Profile Setup

Configure:

* Name
* Icon
* Target
* Milestone interval
* Milestone phrase
* Audio mode
* Vibration
* Voice
* Ambience

### 4. Counting Session

Minimal full-screen interface.

```text
        Profile Name

             72


       Tap anywhere


       Target: 108
```

### 5. Session Complete

Displays:

* Total count
* Target
* Duration
* Completion status

Actions:

* Repeat
* Return home
* View history

### 6. History

Includes:

* Profile filtering
* All Profiles view
* Date grouping
* Morning/Afternoon/Evening sessions
* Calendar heatmap
* Statistics

### 7. Settings

Includes:

* Theme
* Export
* Backup
* Account
* Application preferences

---

## 🏗️ Architecture

```text
                         ┌─────────────────────┐
                         │   Firebase Auth      │
                         │    Phone + OTP       │
                         └──────────┬──────────┘
                                    │
                                    │ JWT
                                    ▼
┌─────────────────────────────────────────────────────┐
│                  React Native + Expo                 │
│                                                     │
│  ┌───────────────┐     ┌─────────────────────────┐ │
│  │ Profile Layer │────▶│ Profile-Driven Counter  │ │
│  └───────────────┘     └────────────┬────────────┘ │
│                                     │              │
│  ┌───────────────┐                  │              │
│  │ History/Stats │◀─────────────────┤              │
│  └───────────────┘                  │              │
│                                     ▼              │
│                         ┌────────────────────────┐ │
│                         │ Local Storage           │ │
│                         │ SQLite / AsyncStorage   │ │
│                         └────────────┬───────────┘ │
└──────────────────────────────────────┼─────────────┘
                                       │
                                 Background Sync
                                       │
                                       ▼
                         ┌─────────────────────────┐
                         │ Next.js API / Express   │
                         │                         │
                         │ JWT Verification        │
                         │ Session API             │
                         │ Profile API             │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │     MongoDB Atlas       │
                         │                         │
                         │ profiles                │
                         │ sessions                │
                         └─────────────────────────┘
```

---

## 🧩 Tech Stack

| Layer             | Technology                   |
| ----------------- | ---------------------------- |
| Mobile Framework  | React Native                 |
| Framework Runtime | Expo                         |
| Language          | TypeScript                   |
| Navigation        | Expo Router                  |
| Styling           | NativeWind                   |
| Authentication    | Firebase Authentication      |
| Database          | MongoDB Atlas                |
| API               | Next.js API Routes / Express |
| Local Storage     | expo-sqlite / AsyncStorage   |
| Voice             | expo-speech                  |
| Haptics           | expo-haptics                 |
| Wake Lock         | expo-keep-awake              |
| Background Tasks  | expo-task-manager            |
| Notifications     | expo-notifications           |
| Build             | Expo EAS                     |
| Distribution      | Android APK                  |

---

## 📁 Suggested Project Structure

```text
japa-counter/
│
├── app/
│   ├── index.tsx
│   ├── login.tsx
│   │
│   ├── home/
│   │   └── index.tsx
│   │
│   ├── profile/
│   │   ├── create.tsx
│   │   └── edit.tsx
│   │
│   ├── session/
│   │   └── [profileId].tsx
│   │
│   ├── complete.tsx
│   │
│   ├── history/
│   │   └── index.tsx
│   │
│   └── settings.tsx
│
├── components/
│   ├── ProfileCard.tsx
│   ├── ProfileSwitcher.tsx
│   ├── Counter.tsx
│   ├── MilestoneIndicator.tsx
│   ├── SessionStats.tsx
│   └── Heatmap.tsx
│
├── services/
│   ├── auth.ts
│   ├── api.ts
│   ├── sync.ts
│   ├── audio.ts
│   ├── haptics.ts
│   └── notifications.ts
│
├── storage/
│   ├── database.ts
│   ├── profiles.ts
│   └── sessions.ts
│
├── hooks/
│   ├── useCounter.ts
│   ├── useProfiles.ts
│   ├── useSession.ts
│   └── useSync.ts
│
├── types/
│   ├── profile.ts
│   └── session.ts
│
├── constants/
│   └── config.ts
│
├── assets/
│   ├── audio/
│   └── icons/
│
├── api/
│   └── ...
│
├── package.json
├── app.json
├── eas.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Core Design Principle

The most important architectural rule is:

> **The counting engine must never contain mantra-specific logic.**

The counter receives the active `MantraProfile` as configuration.

```text
MantraProfile
      │
      ▼
┌──────────────────────────┐
│    Counting Engine       │
│                          │
│ target                   │
│ milestoneInterval        │
│ milestonePhrase          │
│ audioMode                │
│ vibrationEnabled         │
│ ambienceEnabled          │
└─────────────┬────────────┘
              │
              ▼
       Session Behaviour
```

This means adding:

```text
Gayatri
Mahamrityunjaya
Hanuman
Custom
New Profile
```

does not require modifying the counter implementation.

---

## 🔄 Session Lifecycle

```text
Select Profile
      ↓
Configure Session
      ↓
Start
      ↓
Counter Active
      │
      ├── Pause
      │
      ├── Resume
      │
      ├── Undo
      │
      └── Milestone
              ↓
        Audio + Haptics
              ↓
        Target Reached
              ↓
        Session Complete
              ↓
        Save Locally
              ↓
        Sync to Server
```

---

## 🔐 Data Isolation

Every user-owned resource is associated with a Firebase UID.

```text
Firebase UID
     │
     ├── profiles
     │
     └── sessions
```

API requests must authenticate the Firebase token and derive the user identity server-side.

The client must never be able to access another user's data simply by modifying a `userId` value in a request.

---

## 💰 Cost Target

The application is designed around free-tier services.

| Service                 | Planned Tier         |
| ----------------------- | -------------------- |
| Expo                    | Free                 |
| Firebase Authentication | Free tier            |
| MongoDB Atlas           | M0 Free              |
| Vercel                  | Free                 |
| EAS Build               | Free/available quota |
| Android Distribution    | Direct APK           |

### Target operating cost

**₹0/month** for the expected small-scale usage.

> Actual free-tier limits should be monitored as the number of users and authentication requests grows.

---

## 🚀 Development Roadmap

### Phase 1 — Project Setup

* [ ] Initialize Expo project
* [ ] Configure TypeScript strict mode
* [ ] Configure Expo Router
* [ ] Configure NativeWind
* [ ] Establish project architecture

### Phase 2 — Counter Engine

* [ ] Full-screen tap counter
* [ ] Target handling
* [ ] Milestone detection
* [ ] Pause/resume
* [ ] Undo
* [ ] Reset protection
* [ ] Multi-touch protection
* [ ] Session persistence

### Phase 3 — Audio & Haptics

* [ ] TTS integration
* [ ] Bell audio
* [ ] Audio modes
* [ ] Haptic patterns
* [ ] Ambience loop
* [ ] Mala announcements

### Phase 4 — Profiles

* [ ] Profile creation
* [ ] Profile editing
* [ ] Profile duplication
* [ ] Profile archiving
* [ ] Profile switcher

### Phase 5 — History

* [ ] Session storage
* [ ] Daily history
* [ ] Period classification
* [ ] Profile filtering
* [ ] Combined history
* [ ] Statistics
* [ ] Streaks
* [ ] Calendar heatmap

### Phase 6 — Authentication & Sync

* [ ] Firebase phone authentication
* [ ] OTP verification
* [ ] API authentication
* [ ] MongoDB integration
* [ ] Local-first sync
* [ ] Retry mechanism
* [ ] Idempotent session uploads

### Phase 7 — Export & Backup

* [ ] CSV export
* [ ] JSON export
* [ ] Backup reminders

### Phase 8 — Release

* [ ] Android device testing
* [ ] Background behavior testing
* [ ] Audio testing
* [ ] Offline testing
* [ ] Crash recovery testing
* [ ] EAS APK build
* [ ] Sideload testing

---

## ⏱️ Initial Development Estimate

| Task                                    |       Estimate |
| --------------------------------------- | -------------: |
| Expo setup + counter                    |         ~3 hrs |
| Profile management                      |         ~2 hrs |
| Authentication + API + MongoDB          |       ~3–4 hrs |
| History + statistics + export           |         ~3 hrs |
| Background tasks + audio/haptics polish |         ~2 hrs |
| EAS build + device testing              |          ~1 hr |
| **Total**                               | **~14–15 hrs** |

Actual development time may vary depending on device testing, Firebase configuration, audio behavior, background execution limitations, and sync edge cases.

---

## 🚫 Out of Scope

The initial version intentionally does not include:

* Social sharing
* Leaderboards
* Cross-user comparisons
* Community features
* Public profiles
* Play Store publishing
* Social login
* Web application
* iOS distribution

The application is intended primarily for **personal use and a small group of trusted users through APK distribution**.

---

## 🛠️ Development Requirements

Recommended development environment:

```text
Node.js
npm / pnpm
Expo CLI
Android Studio
Android SDK
Java / JDK
Git
```

For development:

```bash
npm install
npx expo start
```

For Android development:

```bash
npx expo run:android
```

For an installable APK, use Expo EAS Build.

---

## 📄 License

This project is currently intended for private/personal use.

License terms can be added when the project is ready for public distribution.

---

## 🕉️ Philosophy

The application is designed around a simple principle:

> **The phone should disappear during japa.**

The interface should stay quiet, the counter should be reliable, and the user should be able to focus on the practice rather than the technology.
