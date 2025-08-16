/// Utilities for computing basal metabolic rate (BMR) and total daily energy
/// expenditure (TDEE) using the Mifflin–St Jeor equation【837205153352514†L133-L143】.  These
/// functions are used in the goal engine to determine nutritional targets.

/// Computes BMR for a person using weight (kg), height (cm), age (years) and
/// sex.  Based on the Mifflin–St Jeor equation【837205153352514†L133-L143】:
/// - For females: BMR = 10 × weight + 6.25 × height – 5 × age – 161
/// - For males:   BMR = 10 × weight + 6.25 × height – 5 × age + 5
double computeBmr({
  required String sex,
  required int age,
  required double weightKg,
  required double heightCm,
}) {
  final base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex.toLowerCase() == 'male' ? base + 5 : base - 161;
}

/// Computes TDEE by multiplying BMR by an activity factor.  Activity factors
/// typically range from 1.2 (sedentary) to 1.9 (very active)【837205153352514†L133-L143】.
double computeTdee({required double bmr, required double activityFactor}) {
  return bmr * activityFactor;
}