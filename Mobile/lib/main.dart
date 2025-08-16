import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'core/theme.dart';
import 'core/env.dart';
import 'features/home/home_screen.dart';
import 'features/onboarding/onboarding_screen.dart';
import 'features/fasting/fasting_screen.dart';
import 'features/logger/logger_screen.dart';
import 'features/pantry/pantry_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ProviderScope(child: BeBetterApp()));
}

/// Root widget for the application.
class BeBetterApp extends ConsumerWidget {
  const BeBetterApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Configure GoRouter
    final GoRouter router = GoRouter(
      initialLocation: '/onboarding',
      routes: <GoRoute>[
        GoRoute(
          path: '/onboarding',
          builder: (context, state) => const OnboardingScreen(),
        ),
        GoRoute(
          path: '/home',
          builder: (context, state) => const HomeScreen(),
        ),
        GoRoute(
          path: '/fasting',
          builder: (context, state) => const FastingScreen(),
        ),
        GoRoute(
          path: '/logger',
          builder: (context, state) => const LoggerScreen(),
        ),
        GoRoute(
          path: '/pantry',
          builder: (context, state) => const PantryScreen(),
        ),
      ],
    );

    return MaterialApp.router(
      debugShowCheckedModeBanner: false,
      title: 'BeBetter',
      theme: lightTheme,
      routerConfig: router,
      locale: const Locale('en'),
      supportedLocales: const [Locale('en'), Locale('ar')],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
    );
  }
}