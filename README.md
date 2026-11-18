# StackMeet

A full-stack platform for finding, booking and hosting developer events: hackathons, meetups and conferences.

> **Status:** in active development. The site redesign is in progress, so some features described here are still changing.

## Tech stack

| Area | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Database | MongoDB with Mongoose |
| Authentication | Auth.js (NextAuth v5) with email and password |
| Image storage | Cloudinary |
| Analytics | PostHog |

## Getting started

**1. Install the dependencies**

```bash
npm install
```

**2. Create your `.env` file**

```bash
cp .env.example .env
```

Then replace the placeholder values in `.env` with your own. Never commit this file, because it contains passwords and keys.

**3. Start the development server**

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

| Command | What it does |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Creates the production build |
| `npm start` | Runs the production build |
| `npm run lint` | Checks the code with ESLint |

## Folder structure

```text
stack-meet/
├── app/                        # Pages and API routes
│   ├── page.tsx                # Home page
│   ├── layout.tsx              # Layout shared by every page
│   ├── not-found.tsx           # 404 page
│   ├── globals.css             # Global styles and design tokens
│   ├── auth/
│   │   ├── sign-in/            # Sign-in page
│   │   └── sign-up/            # Sign-up page
│   ├── events/
│   │   ├── [slug]/             # Event details page
│   │   └── create/             # Create event page
│   └── api/
│       ├── auth/               # Sign-in, sign-out and sign-up endpoints
│       └── events/             # Create, read, update and delete events
├── components/
│   ├── ui/                     # Shared building blocks: buttons, inputs, badges
│   ├── layout/                 # Header, account menu and footer
│   ├── events/                 # Event page: details, booking form and similar events
│   ├── home/                   # Home page components, including the event card
│   ├── auth/                   # Sign-in and sign-up forms
│   ├── createEvent/            # Create event page form
│   ├── editEvent/              # Edit event page and form
│   └── eventForm/              # Form steps and preview shared by Create and Edit event
├── database/                   # Mongoose models: User, Event, Booking
├── context/                    # React context providers
├── lib/
│   ├── actions/                # Server Actions for bookings
│   ├── data/                   # Event queries and the cached database connection
│   ├── events/                 # Event display text, search filters and the create event form
│   └── url/                    # Reading the query strings of the home and sign-in pages
├── public/                     # Icons and images
├── types/                      # Shared TypeScript types and type extensions
├── auth.ts                     # Auth.js configuration
├── instrumentation-client.ts   # PostHog setup
└── next.config.ts              # Next.js configuration
```

## Project structure and conventions

Each file has one job: pages put sections together, components render UI, and logic lives in plain functions or hooks.

### Where code goes

| Kind of code | Folder | Example |
|---|---|---|
| Routes: pages, layouts, API handlers | `app/` | `app/events/[slug]/page.tsx` |
| Building blocks shared across the site | `components/ui/` | `Button`, `Input`, `FormatBadge` |
| Components for one area of the site | `components/<area>/` | `components/home/Hero.tsx` |
| Custom hooks used by more than one component | `hooks/` | `useDropdownMenu` |
| Plain functions, types and constants | `lib/` | `lib/events/search.ts` |
| Database reads and permission checks | `lib/data/` | event queries, marked `server-only` |
| Server Actions that change data | `lib/actions/` | `createBooking` |

### Conventions

- **Components render UI.** Keep them small, with one component per file, named in PascalCase.
- **Custom hooks (`useX`) hold client-side state and behavior**, like form state or a toggle, so components stay readable.
- **Plain functions in `lib/` hold logic that isn't React:** formatting, filtering, validation and database access.
- **Colocate first, share later.** Keep code next to where it's used, and move it to a shared folder only when a second place needs it.
- **Constants used in more than one file go in `lib/constants.ts`**, including Tailwind class strings. A constant used by one file stays in that file.
- **Server Components by default.** Add `"use client"` only where interactivity is needed, as low in the tree as possible.
- **Fetch data on the server**, in Server Components or server functions, not in `useEffect`. A Server Component calls the data functions directly instead of fetching the app's own `/api` routes.
- **Keep a data access layer.** Database reads and auth checks live in `lib/data/`, marked `import "server-only"`, so they can't leak into client code.
- **Server Actions are for changing data.** Each one is a public endpoint, so it checks the user and validates its input every time.
- **Keep pages thin.** `page.tsx` reads params, calls data functions and arranges components, and that's all.

## How it works

### Booking a spot

Booking needs an account. Signed-out visitors see a **Sign in to book** button, which brings them back to the event after they sign in.

```text
Book now button
  → createBooking Server Action (lib/actions/booking.action.ts)
  → checks that the person is signed in and the event hasn't ended
  → takes the name, email and phone from their account
  → checks the limits (not their own event, not already booked, 3 upcoming bookings per user)
  → saves the booking in MongoDB with their user ID
  → the card shows the "You're in!" box
```

Each user can book an event only once, which a unique database index on the event and user enforces.

### Signing up and signing in

```text
Sign up:  form → POST /api/auth/signup → validates → hashes the password with bcrypt → saves the user
Sign in:  form → Auth.js → checks the password → creates a JWT session cookie
```

Sessions include the user's ID and role, so the server can check permissions.

### Protected pages

Create event, My events and Edit event need an account. Each one is checked twice:

```text
Request for /events/create, /my-events or /events/[slug]/edit
  → proxy.ts: signed out? → redirect to sign-in (307), and the page never renders
  → the page's own check: signed out? → redirect to sign-in
```

`proxy.ts` runs before the page, so a signed-out visitor is sent to sign-in without the page loading. The page's own check catches any request that gets past the proxy, for example when the proxy doesn't run. The Edit event page also checks that the user owns the event, which the proxy can't do. The API routes check the session again before changing any data.

### Creating an event

Creating an event requires an account.

```text
Create event form
  → POST /api/events
  → checks the session and the event limit
  → uploads the cover image to Cloudinary
  → saves the event in MongoDB with the image URL and owner
```

### Editing or deleting an event

Only the owner can open the Edit event page, and only while the event is upcoming. It uses the same three steps as Create event, filled in with the saved event: Continue checks each step, and Save changes on the last step appears once something has changed. A new cover image is optional, and the slug never changes, so shared links keep working.

```text
Edit event form (step 3, Save changes)
  → PATCH /api/events/[slug]
  → opens the event page
```

```text
PATCH or DELETE /api/events/[slug]
  → checks the user is signed in (401 if not)
  → finds the event (404 if missing)
  → checks the user is the owner or an admin (403 if not)
  → applies the change
```

## Backend

The app uses API routes and Server Actions, which both reach MongoDB through Mongoose models.

| Type | Location | Used for |
|---|---|---|
| API routes | `app/api/auth/` | Sign up, sign in and sign out |
| API routes | `app/api/events/` | Create, list, read, edit and delete events |
| Server Actions | `lib/actions/booking.action.ts` | Create a booking, count bookings |

## Data models

| Model | Purpose | Main fields |
|---|---|---|
| **User** | An account | `name`, `email`, `password` (hashed), `phone`, `role` |
| **Event** | An event listing | `title`, `slug`, `description`, `overview`, `image`, `date`, `time`, `mode`, `venue`, `location`, `onlineUrl`, `agenda`, `tags`, `createdBy` |
| **Booking** | A reserved spot | `eventId`, `userId`, `name`, `email`, `phone`, `hiddenByUser` |

Events link to their owner through `createdBy`, and bookings link to their event through `eventId` and to the account that booked through `userId`.

An event's `mode` is `online`, `in-person` or `hybrid`. In-person and hybrid events require a `venue` and `location`. `onlineUrl` is hidden from public responses, and each `agenda` item has a `start` and a `title`.

## Known issues

### Next.js needs a security update

The app runs on Next.js 16.0.0 and React 19.2.0, which have published security warnings. `npm audit` reports, among others:

| Severity | Problem | Advisory |
|---|---|---|
| Critical | Remote code execution through the React Server Components protocol | [GHSA-9qr9-h5gf-34mp](https://github.com/advisories/GHSA-9qr9-h5gf-34mp) |
| High | Denial of service through Server Components | [GHSA-mwv6-3258-q52c](https://github.com/advisories/GHSA-mwv6-3258-q52c) |
| Moderate | Server Action source code exposure | [GHSA-w37m-7fhw-fmv9](https://github.com/advisories/GHSA-w37m-7fhw-fmv9) |
| Moderate | Denial of service through the Image Optimizer's `remotePatterns` | [GHSA-9g9p-9gw9-jx7f](https://github.com/advisories/GHSA-9g9p-9gw9-jx7f) |

The app uses Server Components and a Server Action, so it's affected. On a development machine the risk is low, because only the local network can reach the dev server. Before the site is deployed, Next.js must be updated to 16.4.6 or later, with React and `eslint-config-next` to their matching versions. Run `npm audit` afterwards to confirm the warnings are gone.

### The proxy doesn't run in builds made on Windows

In Next.js 16.0.0, `next build` on Windows doesn't register `proxy.ts`, because it compares the file's path with `/proxy` while Windows paths use `\`. Builds on Linux aren't affected. Signed-out visitors are still sent to sign-in by each page's own check (see [Protected pages](#protected-pages)), but the response is a 200 that redirects in the browser, not a 307. Newer Next.js versions fix part of this, so check the build's route list for "ƒ Proxy (Middleware)" after updating.
