import '../../utils/tdee.dart';

/// A data class representing computed nutritional targets for a user.
class UserTargets {
  final int calories;
  final double protein;
  final double carbs;
  final double fat;
  const UserTargets({
    required this.calories,
    required this.protein,
    required this.carbs,
    required this.fat,
  });
}

/// Computes nutritional targets based on the user profile and goal defaults.
/// Returns a [UserTargets] object with calories (kcal), protein (g), carbs (g)
/// and fat (g).  Uses the Mifflin–St Jeor equation for BMR and multiplies
/// by an activity factor to get TDEE【837205153352514†L133-L143】.  The calories
/// are then adjusted according to the goal's deficit or surplus and split into
/// macronutrients using the provided macro split.
UserTargets computeTargets({
  required String sex,
  required int age,
  required double weightKg,
  required double heightCm,
  required String activityLevel,
  required String goal,
  required double deficitPct,
  required double surplusPct,
  required double proteinGPerKg,
  required Map<String, double> macroSplit,
  required Map<String, double> activityFactors,
}) {
  final bmr = computeBmr(
    sex: sex,
    age: age,
    weightKg: weightKg,
    heightCm: heightCm,
  );
  final activity = activityFactors[activityLevel] ?? 1.2;
  final tdee = computeTdee(bmr: bmr, activityFactor: activity);
  double calories = tdee;
  if (goal == 'lose_weight') {
    calories = tdee * (1 - deficitPct);
  } else if (goal == 'gain_weight') {
    calories = tdee * (1 + surplusPct);
  } else if (goal == 'healthy_life') {
    calories = tdee * 0.95;
  }
  final proteinTarget = (proteinGPerKg > 1.6 ? proteinGPerKg : 1.6) * weightKg;
  final carbsTarget = (calories * (macroSplit['carb'] ?? 0.4)) / 4.0;
  final fatTarget = (calories * (macroSplit['fat'] ?? 0.3)) / 9.0;
  return UserTargets(
    calories: calories.round(),
    protein: proteinTarget,
    carbs: carbsTarget,
    fat: fatTarget,
  );
}