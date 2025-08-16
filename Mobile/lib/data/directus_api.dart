import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/env.dart';
import '../domain/entities.dart';

/// Provides an instance of [DirectusApi] for dependency injection.  Uses
/// Riverpod's [Provider] to keep a singleton of the API client.
final directusApiProvider = Provider<DirectusApi>((ref) {
  final dio = Dio(BaseOptions(
    baseUrl: Env.directusBaseUrl,
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 10),
  ));
  return DirectusApi(dio);
});

/// A minimal wrapper around the Directus REST API.  Handles GET requests
/// and JSON parsing.  Extend this class to cover additional endpoints.
class DirectusApi {
  final Dio _dio;
  DirectusApi(this._dio);

  /// Fetch the active SDUI screen matching the given key, goal and locale.  If
  /// multiple screens match, the first one is returned.  Throws on error.
  Future<SDUIScreen> fetchSduiScreen(String screenKey,
      {required String goal, required String locale}) async {
    final response = await _dio.get(
      '/items/sdui_screens',
      queryParameters: {
        'filter[screen_key][_eq]': screenKey,
        'filter[goal][_in]': [goal, '*'],
        'filter[locale][_eq]': locale,
        'filter[is_active][_eq]': true,
        'limit': 1,
        'sort': '-schema_version',
      },
    );
    final data = response.data['data'] as List<dynamic>;
    if (data.isEmpty) {
      throw Exception('No SDUI screen found for $screenKey');
    }
    final item = data.first as Map<String, dynamic>;
    return SDUIScreen(
      id: item['id'] as String,
      screenKey: item['screen_key'] as String,
      goal: item['goal'] as String,
      locale: item['locale'] as String,
      schemaVersion: item['schema_version'] as int,
      minAppVersion: item['min_app_version'] as String,
      isActive: item['is_active'] as bool,
      payload: item['payload_json'] as Map<String, dynamic>,
    );
  }
}