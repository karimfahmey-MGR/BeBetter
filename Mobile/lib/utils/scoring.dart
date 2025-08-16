/// Suggestion scoring utilities.  The algorithm ranks meal suggestions based on
/// protein density, satiety, insulin load and calorie fit (Impact) and the
/// estimated effort required to prepare the meal.  See README for details.

class SuggestionWeights {
  final double alpha;
  final double beta;
  final double wP;
  final double wS;
  final double wI;
  final double wC;
  const SuggestionWeights({
    required this.alpha,
    required this.beta,
    required this.wP,
    required this.wS,
    required this.wI,
    required this.wC,
  });
}

class SuggestionScore {
  final double impact;
  final double effort;
  final double score;
  const SuggestionScore({required this.impact, required this.effort, required this.score});
}

/// Computes the impact, effort and overall score for a suggestion.  All
/// parameters should be normalised between 0 and 1.  The returned [SuggestionScore]
/// can be used to rank suggestions.
SuggestionScore computeSuggestionScore({
  required double proteinDensity,
  required double satietyIndex,
  required double insulinLoadNorm,
  required double calorieFitPenalty,
  required double stepsNorm,
  required double timeNorm,
  required double applianceFriction,
  required double dishesNorm,
  required SuggestionWeights weights,
}) {
  final impact = weights.wP * proteinDensity +
      weights.wS * satietyIndex -
      weights.wI * insulinLoadNorm -
      weights.wC * calorieFitPenalty;
  final effort = stepsNorm + timeNorm + applianceFriction + dishesNorm;
  final score = weights.alpha * impact - weights.beta * effort;
  return SuggestionScore(impact: impact, effort: effort, score: score);
}