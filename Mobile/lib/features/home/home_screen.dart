import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/directus_api.dart';
import '../../domain/entities.dart';

/// Provider that fetches the active SDUI screen for the home page from Directus.
final homeScreenProvider = FutureProvider<SDUIScreen>((ref) async {
  final api = ref.read(directusApiProvider);
  // In a real implementation you would read the user's goal and locale from
  // profile or settings.  For this scaffold we hardcode them.
  return api.fetchSduiScreen('home', goal: 'lose_weight', locale: 'en');
});

/// Home screen renders the SDUI payload returned from the backend.
class HomeScreen extends ConsumerWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final asyncScreen = ref.watch(homeScreenProvider);
    return Scaffold(
      appBar: AppBar(title: const Text('Home')),
      body: asyncScreen.when(
        data: (sdui) => SduiRenderer(node: sdui.payload),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Error loading screen: $e')),
      ),
    );
  }
}

/// A very simple renderer that interprets a limited subset of the SDUI schema.
class SduiRenderer extends StatelessWidget {
  final Map<String, dynamic> node;
  const SduiRenderer({Key? key, required this.node}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    switch (node['type']) {
      case 'List':
        final children = (node['children'] as List).cast<Map<String, dynamic>>();
        return ListView(
          children: children.map((child) => SduiRenderer(node: child)).toList(),
        );
      case 'Banner':
        final props = node['props'] as Map<String, dynamic>;
        return Card(
          color: Theme.of(context).colorScheme.secondaryContainer,
          margin: const EdgeInsets.all(8),
          child: ListTile(
            leading: Text(props['icon'] ?? ''),
            title: Text(props['title'] ?? ''),
            subtitle: Text(props['subtitle'] ?? ''),
          ),
        );
      case 'Card':
        final props = node['props'] as Map<String, dynamic>;
        return Card(
          margin: const EdgeInsets.all(8),
          child: ListTile(
            title: Text(props['title'] ?? ''),
            onTap: () {
              // In a real app, actions like open_pantry would navigate.
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Action: ${props['action']}')),
              );
            },
          ),
        );
      case 'VideoTile':
        final props = node['props'] as Map<String, dynamic>;
        return ListTile(
          title: Text(props['title'] ?? ''),
          subtitle: Text('Video tags: ${(props['tag_query'] as List).join(', ')}'),
        );
      default:
        return Text('Unknown component: ${node['type']}');
    }
  }
}