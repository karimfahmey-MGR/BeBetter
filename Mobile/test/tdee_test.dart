import 'package:flutter_test/flutter_test.dart';

import 'package:bebetter/utils/tdee.dart';

void main() {
  group('BMR and TDEE calculations', () {
    test('Computes male BMR correctly', () {
      final bmr = computeBmr(sex: 'male', age: 30, weightKg: 70, heightCm: 175);
      // Expected BMR = 10*70 + 6.25*175 - 5*30 + 5 = 700 + 1093.75 - 150 + 5 = 1648.75
      expect(bmr, closeTo(1648.75, 0.1));
    });
    test('Computes female BMR correctly', () {
      final bmr = computeBmr(sex: 'female', age: 25, weightKg: 60, heightCm: 165);
      // Expected BMR = 10*60 + 6.25*165 - 5*25 - 161 = 600 + 1031.25 - 125 -161 = 1345.25
      expect(bmr, closeTo(1345.25, 0.1));
    });
    test('Computes TDEE using activity factor', () {
      final bmr = computeBmr(sex: 'male', age: 30, weightKg: 70, heightCm: 175);
      final tdee = computeTdee(bmr: bmr, activityFactor: 1.55);
      expect(tdee, closeTo(bmr * 1.55, 0.1));
    });
  });
}