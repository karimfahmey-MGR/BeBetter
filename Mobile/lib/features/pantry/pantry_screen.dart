import 'package:flutter/material.dart';

/// Placeholder pantry screen.  The full version would list the user's stored
/// ingredients, compute suggestions using the scoring algorithm and allow
/// editing inventory.  Here we simply present three suggestion cards.
class PantryScreen extends StatelessWidget {
  const PantryScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final suggestions = [
      {'title': 'Max Impact Suggestion', 'score': 0.9},
      {'title': 'Min Effort Suggestion', 'score': 0.7},
      {'title': 'Balanced Suggestion', 'score': 0.8},
    ];
    return Scaffold(
      appBar: AppBar(title: const Text('Pantry')),
      body: ListView.builder(
        itemCount: suggestions.length,
        itemBuilder: (context, index) {
          final item = suggestions[index];
          return ListTile(
            title: Text(item['title'] as String),
            subtitle: Text('Score: ${(item['score'] as double).toStringAsFixed(2)}'),
          );
        },
      ),
    );
  }
}