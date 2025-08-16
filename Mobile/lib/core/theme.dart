import 'package:flutter/material.dart';

/// Defines the light theme used throughout the app.  Use [ThemeData]
/// properties to customise colours, typography and other appearance details.
final ThemeData lightTheme = ThemeData(
  colorScheme: ColorScheme.fromSeed(
    seedColor: const Color(0xFF008080), // teal seed for a health‑focused palette
  ),
  useMaterial3: true,
  fontFamily: 'NotoKufiArabic',
  visualDensity: VisualDensity.adaptivePlatformDensity,
);