import 'package:flutter/material.dart';

/// Placeholder for the fasting screen.  In a full implementation this would
/// display the current fasting window, let the user start/end a fast and
/// configure presets and reminders.  For now it contains a simple message.
class FastingScreen extends StatelessWidget {
  const FastingScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Fasting')),
      body: const Center(
        child: Text('Fasting tracker goes here'),
      ),
    );
  }
}