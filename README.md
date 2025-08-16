## BeBetter Mobile & Backend Scaffold

This repository contains a production‑ready scaffold for **BeBetter**, a bi‑lingual (Arabic/English) nutrition and fasting mobile application built with **Flutter** and a **Directus** backend.  The goal of this scaffold is to provide a solid foundation you can extend into a full product.  It includes:

* A Flutter project configured for Android and iOS with Riverpod, go_router, Drift for offline persistence, Dio for HTTP, and support for local notifications and FCM.  The app is organised into feature modules (auth, onboarding, home, fasting, logger, pantry, videos, grocery and settings) and respects right‑to‑left layouts.  Minimal placeholder screens and providers are included—add your own screens and logic on top.
* A Directus deployment on Render.  The blueprint provisions a PostgreSQL database, Redis cache, web service running Directus (Node), a background worker and a nightly cron job.  The provided Dockerfile wraps Directus and installs a few helper packages.
* A schema and seed script that creates all collections described in the specification (foods, recipes, videos, fasting presets, SDUI screens, brands links, goal defaults, user profiles, user targets, meal logs, pantry, insights and events) and inserts initial data.  Collections enforce validation rules, row‑level security, JSON schema validation for SDUI payloads and enumerated field values.
* Unit tests for the goal engine (TDEE calculation and macro distribution), the scoring function for meal suggestions, and the SDUI parser.  These tests run with `flutter test` under GitHub Actions.
* A **render.yaml** blueprint to deploy the backend and worker services on Render, along with example environment files for the mobile app, Directus and Render secrets.
* Documentation in **OPERATIONS.md** that explains how to manage content in Directus, publish flows, roll back changes, bump schema versions and force client upgrades via the SDUI screen settings.

### Repository layout

```
bebetter/
├── mobile/               # Flutter application (Android/iOS)
│   ├── lib/
│   │   ├── core/         # Theme, localisation, env reader, error handling
│   │   ├── data/         # Dio client, Directus API wrapper, repositories
│   │   ├── domain/       # Entities and use cases (compute targets, suggest meals)
│   │   ├── features/     # Feature modules (auth, onboarding, home, fasting, logger, pantry, videos, grocery, settings)
│   │   └── utils/        # Shared utility functions (TDEE, scoring, date helpers)
│   └── test/             # Unit tests
├── directus/
│   ├── Dockerfile        # Docker image to run Directus on Render
│   ├── seed.ts           # Node script to create collections and seed data via Directus API
│   ├── package.json      # Dependencies for the seed script
│   └── tsconfig.json     # TypeScript configuration
├── devops/
│   ├── render.yaml       # Render blueprint (services, databases, workers, cron jobs)
│   └── github/
│       └── workflows/
│           └── flutter.yml  # GitHub Actions pipeline for Flutter
├── OPERATIONS.md         # How to operate and maintain this stack
└── README.md             # This document
```

### Getting started

1. **Install dependencies**
   - Install Flutter (stable channel) and set up Xcode/Android tooling.  See <https://docs.flutter.dev/get-started/install> for instructions.
   - Install Node.js (v18+) and Yarn.  These are needed for the Directus seed script.

2. **Clone the repository** and install Flutter dependencies:

   ```bash
   git clone <your-fork-url> bebetter
   cd bebetter/mobile
   flutter pub get
   ```

3. **Configure environment variables**
   - Create a `.env` file in `mobile/` (or use `--dart-define` at build time) containing the variables defined in [`.env.example`](#).  At minimum you must set `DIRECTUS_BASE_URL`, `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
   - For the Directus backend, set up secrets in Render for database connection, admin credentials and the public URL.  See `devops/render.yaml` for details.

4. **Deploy Directus to Render**
   - Sign up for a [Render](https://render.com/) account and create a new Blueprint from the `devops/render.yaml` file.  Render will provision a PostgreSQL instance, a Redis cache, a web service running Directus, a background worker and a nightly cron job.
   - After the services are live, run the seed script to initialise the schema and insert starter content:

     ```bash
     cd bebetter/directus
     yarn install
     # Set environment variables for the admin login and base URL
     export DIRECTUS_ADMIN_EMAIL=admin@example.com
     export DIRECTUS_ADMIN_PASSWORD=supersecret
     export DIRECTUS_BASE_URL=https://your-directus-service.onrender.com
     # Run the seed script
     yarn ts-node seed.ts
     ```

5. **Run the mobile app**
   - From the `mobile` directory, run `flutter run` to launch the application on a simulator or device.  The default flavour will use environment variables from `--dart-define`.  The onboarding flow will guide you through account creation via Supabase and compute your nutritional targets.

6. **Continuous integration**
   - GitHub Actions is configured to run `flutter analyze` and `flutter test` on every push.  See `.github/workflows/flutter.yml` for details.  Feel free to extend this pipeline to run integration tests or build and deploy artifacts.

### Goal engine and Mifflin–St Jeor reference

The goal engine uses the Mifflin–St Jeor equation to estimate basal metabolic rate (BMR).  The equation takes weight (kg), height (cm), age (years) and sex to compute BMR:

```
Females: BMR = 10 × weight + 6.25 × height – 5 × age – 161
Males:   BMR = 10 × weight + 6.25 × height – 5 × age + 5
```

An activity factor (1.2 for sedentary, 1.375 for lightly active, 1.55 for moderately active, 1.725 for active and 1.9 for very active) is then applied to obtain total daily energy expenditure (TDEE)【837205153352514†L133-L143】.  The TDEE is adjusted up or down depending on the user’s goal (e.g., a deficit for weight loss).  These formulas are implemented in `mobile/lib/utils/tdee.dart` with tests under `mobile/test/` to ensure correctness.  A more detailed explanation of the Mifflin–St Jeor equation can be found in the referenced literature【156483812100354†L85-L93】.

### Contributing

This scaffold is intentionally lean—many features are stubbed out or simplified.  Contributions are welcome!  If you add new Directus collections or flows, update the seed script and documentation accordingly.  Please ensure that new code passes `flutter analyze` and is covered by tests where appropriate.