import 'package:flutter/material.dart';

/// Meal and calorie logging placeholder.  A production implementation would
/// provide search, quick add, favorites and recent sections with offline
/// caching.  For now it allows the user to enter a food name and amount and
/// displays a confirmation.
class LoggerScreen extends StatefulWidget {
  const LoggerScreen({Key? key}) : super(key: key);

  @override
  State<LoggerScreen> createState() => _LoggerScreenState();
}

class _LoggerScreenState extends State<LoggerScreen> {
  final _controller = TextEditingController();
  double _amount = 100;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Log Meal')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _controller,
              decoration: const InputDecoration(labelText: 'Food name'),
            ),
            Row(
              children: [
                const Text('Amount (g):'),
                Expanded(
                  child: Slider(
                    min: 10,
                    max: 500,
                    divisions: 49,
                    label: _amount.round().toString(),
                    value: _amount,
                    onChanged: (v) => setState(() => _amount = v),
                  ),
                ),
              ],
            ),
            ElevatedButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Logged ${_controller.text} $_amount g')),
                );
                _controller.clear();
              },
              child: const Text('Log'),
            ),
          ],
        ),
      ),
    );
  }
}