/// Provides compile‑time environment variables for the BeBetter app.
///
/// Use `--dart-define` flags during build/run to override these values.  See
/// README.md for required variables.
class Env {
  Env._();

  /// Base URL of the Directus API (e.g. https://api.bebetter.com)
  static const directusBaseUrl = String.fromEnvironment('DIRECTUS_BASE_URL');

  /// Supabase project URL for authentication
  static const supabaseUrl = String.fromEnvironment('SUPABASE_URL');

  /// Supabase public anon key
  static const supabaseAnonKey = String.fromEnvironment('SUPABASE_ANON_KEY');

  /// Minimum supported schema version.  If a fetched SDUI screen has a
  /// `schema_version` higher than this value, the app will still render it.
  static const appMinSupportedSchema = int.fromEnvironment('APP_MIN_SUPPORTED_SCHEMA', defaultValue: 1);
}