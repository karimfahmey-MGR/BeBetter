## Operations and Maintenance Guide

This document outlines how to operate the BeBetter platform after deployment.  It covers content management via Directus, flows and automations, rolling back changes, bumping schema versions, and forcing mobile clients to upgrade when breaking changes occur.

### Editing content

1. **Log in to the Directus admin** using the credentials configured in Render.  The admin URL is the `PUBLIC_URL` defined in your Render secret.
2. **Collections overview**:
   - **foods**, **recipes**, **videos**, **fasting_presets**, **goal_defaults** and **brands_links** are publicly readable.  Only administrators can modify these collections.  When adding foods or recipes, ensure that both English and Arabic names/titles are provided and that the `tags` array includes relevant nutrition tags.  Videos must have HTTPS URLs and a slug that is unique.
   - **sdui_screens** stores Server‑Driven UI definitions.  Each row is keyed by `screen_key`, `goal` and `locale`.  To update the home screen, edit the JSON payload under `payload_json`.  The `schema_version` and `min_app_version` fields control compatibility: bump `schema_version` whenever you introduce new component types; increment `min_app_version` to force clients below a certain version to upgrade before loading the screen.
   - **user_profiles**, **meal_logs**, **pantry**, **insights**, **user_targets** and **events** are private.  The Directus role configuration (row‑level security) ensures that users can only read or write their own records.

### Publishing flows and automations

Directus flows are defined in the admin UI under **Settings → Flows**.  This scaffold expects three flows:

| Flow name             | Trigger                           | Purpose                                               |
|----------------------|------------------------------------|-------------------------------------------------------|
| `on_content_publish` | Manual trigger or Item updated     | Purges cache keys in Redis and sets `Cache‑Control` headers on changed collections (e.g., `sdui_screens` or `foods`) to force client refreshes.  This flow should run whenever editors publish new content. |
| `nightly_housekeeping` | Scheduled (02:00)                 | Aggregates fasting statistics into the `insights` table and archives events older than 90 days. |
| `recompute_targets`   | User profile updated (hook)       | Whenever `user_profiles` is changed (e.g., weight or goal update) this flow invokes a worker endpoint to recompute nutritional targets and writes a new record into `user_targets`. |

Flows can be modified or extended in the Directus UI.  When editing flows:

1. Avoid long‑running tasks in the web service; schedule heavy jobs in the worker using `@directus/sdk` or a custom endpoint.
2. Always update documentation when flows change.

### Rolling back changes

*Schema and data changes are versioned* via Git and the seed script.  If a migration causes issues:

1. Revert the offending change in your repository and re‑deploy.  Render will rebuild the service automatically.
2. If seed data is corrupted, re‑run the seed script with the `--force` flag to purge and recreate the affected collections.  **Caution:** purging collections will permanently remove data.
3. Use Directus’s item revisions (enabled by default) to restore previous versions of individual records.

### Bumping schema version and forcing upgrades

The mobile app caches SDUI definitions locally.  If you introduce breaking changes to the UI schema (e.g., new component types or removed properties), you must bump `schema_version` in the `sdui_screens` table.  The app will fetch fresh layouts when it sees a higher schema version than its last stored value.

To force users to upgrade the app (for example, when an incompatible API change is released):

1. Edit the row(s) in `sdui_screens` corresponding to the critical screens (e.g., `home`).
2. Set the `min_app_version` field to a version higher than the currently released version (e.g., `2.0.0`).
3. Clients with older app versions will receive a “force upgrade” message and cannot continue until they install an update.

### Cache invalidation

The app uses HTTP `ETag` caching for SDUI definitions and foods.  When you publish new content, call the `on_content_publish` flow or send a `PURGE` request to the relevant cache key in Redis.  This ensures that mobile clients fetch the latest data on the next request.

### Monitoring and analytics

All user interactions are recorded in the `events` table.  You can connect a BI tool or export this table periodically for analysis.  To respect user privacy, only hashed user IDs are stored.  Example events include `auth_signup`, `fast_started`, `meal_logged`, `suggestion_viewed` and `video_completed`.  See the analytics section in the README for a full list.

### Disaster recovery

Render snapshots the PostgreSQL database daily.  To restore from a snapshot, use Render’s database management UI.  For additional peace of mind you can set up logical replication or streaming backups.  Secrets and environment variables should be stored in a password manager and rotated regularly.