import 'package:flutter/material.dart';

/// A placeholder onboarding screen.  In a production app this would guide the
/// user through profile setup, goal selection, exclusions and fasting presets,
/// then compute nutritional targets.  For now it simply navigates to home.
class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Onboarding')),
      body: Center(
        child: ElevatedButton(
          onPressed: () => Navigator.of(context).pushReplacementNamed('/home'),
          child: const Text('Finish Onboarding'),
        ),
      ),
    );
  }
}