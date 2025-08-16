import 'package:flutter_test/flutter_test.dart';

import 'package:bebetter/utils/scoring.dart';

void main() {
  group('Suggestion scoring', () {
    test('Higher impact and lower effort yields higher score', () {
      final weights = SuggestionWeights(alpha: 0.7, beta: 0.3, wP: 0.6, wS: 0.2, wI: 0.15, wC: 0.05);
      final highImpact = computeSuggestionScore(
        proteinDensity: 0.8,
        satietyIndex: 0.8,
        insulinLoadNorm: 0.2,
        calorieFitPenalty: 0.1,
        stepsNorm: 0.1,
        timeNorm: 0.1,
        applianceFriction: 0.1,
        dishesNorm: 0.1,
        weights: weights,
      );
      final lowImpact = computeSuggestionScore(
        proteinDensity: 0.2,
        satietyIndex: 0.2,
        insulinLoadNorm: 0.5,
        calorieFitPenalty: 0.5,
        stepsNorm: 0.1,
        timeNorm: 0.1,
        applianceFriction: 0.1,
        dishesNorm: 0.1,
        weights: weights,
      );
      expect(highImpact.score, greaterThan(lowImpact.score));
    });
  });
}