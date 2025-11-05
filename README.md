# ZeroWasteConnect

A Progressive Web App connecting food donors with receivers to reduce food waste and feed those in need.

## Overview

ZeroWasteConnect is a humanity-first platform that connects donors (hotels, restaurants, events, households) with receivers (NGOs, community helpers, individuals) to share surplus food in real-time.

**Core Principle:** No money, no points, no rewards — only kindness and zero waste.

## Features

- **Real-time Donations:** Post and view food donations instantly
- **Location-based Matching:** Find nearby donations using geolocation
- **User Roles:**
  - Donors: Share surplus food
  - Receivers: Collect and distribute food
  - Admin: Platform oversight and analytics
- **Status Tracking:** Track donations from pending to delivered
- **PWA Support:** Install on mobile devices for native app experience
- **Secure Authentication:** Email/password auth via Supabase
- **Real-time Updates:** Live donation status changes

## Tech Stack

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Realtime)
- **Icons:** Lucide React
- **Build Tool:** Vite

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. The project is pre-configured with Supabase. The database schema is already set up.

4. Start the development server:
   ```bash
   npm run dev
   ```

### Creating Test Accounts

1. Sign up through the app at `/` as a donor
2. Sign up another account as a receiver
3. Use the donor account to post food donations
4. Use the receiver account to collect donations

### Mock Data

To generate mock data for testing, you can use the SQL script in `scripts/generate-mock-data.sql`. This requires:
1. Creating test users through the app signup
2. Using their user IDs in the SQL script
3. Running the script via Supabase SQL Editor

## App Structure

```
src/
├── components/          # React components
│   ├── Auth.tsx        # Authentication
│   ├── Navbar.tsx      # Navigation
│   ├── Home.tsx        # Landing page
│   ├── DonatePage.tsx  # Donor form
│   ├── NearbyPage.tsx  # Receiver map view
│   ├── Dashboard.tsx   # User dashboard
│   ├── Profile.tsx     # User profile
│   └── AdminPanel.tsx  # Admin dashboard
├── contexts/           # React contexts
│   └── AuthContext.tsx # Auth state management
├── lib/                # Utilities
│   └── supabase.ts     # Supabase client
└── App.tsx            # Main app component
```

## Database Schema

### Tables

- **profiles:** User profiles (donors, receivers, admins)
- **donations:** Food donations with location and status
- **collection_logs:** History of food collections

## User Workflows

### Donor Flow
1. Sign up as donor
2. Set location
3. Post food donation with details (item, quantity, expiry, photo)
4. Track donation status
5. Mark as delivered when complete

### Receiver Flow
1. Sign up as receiver
2. View nearby donations on map
3. Collect food by claiming donation
4. Status automatically updated

## Key Features Explained

### Freshness Check
The app checks upload time to ensure food freshness. Donations with expiry times are highlighted as urgent when time is running out.

### Real-time Updates
Using Supabase Realtime, donation status changes are reflected instantly across all connected clients.

### Distance Calculation
The app calculates distances between users and donations using the Haversine formula for accurate proximity matching.

### QR Codes
Each donation gets a unique QR code for tracking and verification (mock implementation).

## Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## Progressive Web App

The app is configured as a PWA with:
- Installable on mobile devices
- Offline capability support
- App manifest with theme colors
- Mobile-optimized experience

## Color Theme

- Primary: Green (#16a34a, #22c55e)
- Secondary: White (#ffffff)
- Accents: Yellow, Blue for status indicators

## Security

- Row Level Security (RLS) enabled on all tables
- User data isolated by authentication
- Secure password handling via Supabase Auth
- Protected API endpoints

## Future Enhancements

- Multi-language support (English, Hindi, Kannada)
- Google Maps integration for visual map view
- Push notifications for nearby donations
- Photo-based AI freshness detection
- Community Kitchen mode
- Partnership integrations with NGOs
- Analytics dashboard improvements

## License

This project is built for educational and humanitarian purposes.

## Support

For issues or questions, please create an issue in the repository.

---

**Remember:** Every meal shared is a life touched. Thank you for being part of ZeroWasteConnect.
