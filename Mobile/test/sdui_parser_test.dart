import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:bebetter/features/home/home_screen.dart';

void main() {
  testWidgets('SDUI renderer shows fallback for unknown component', (tester) async {
    const node = {'type': 'UnknownComponent'};
    await tester.pumpWidget(const MaterialApp(
      home: Scaffold(body: SduiRenderer(node: node)),
    ));
    expect(find.textContaining('Unknown component'), findsOneWidget);
  });
}