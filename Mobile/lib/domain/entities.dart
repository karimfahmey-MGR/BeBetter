/// Entities used throughout the BeBetter app.

class Food {
  final String id;
  final String nameEn;
  final String nameAr;
  final int kcal;
  final double carbs;
  final double protein;
  final double fat;
  final double fiber;
  final double sugar;
  final List<String> tags;

  Food({
    required this.id,
    required this.nameEn,
    required this.nameAr,
    required this.kcal,
    required this.carbs,
    required this.protein,
    required this.fat,
    required this.fiber,
    required this.sugar,
    required this.tags,
  });

  factory Food.fromJson(Map<String, dynamic> json) => Food(
        id: json['id'] as String,
        nameEn: json['name_en'] as String,
        nameAr: json['name_ar'] as String,
        kcal: json['kcal'] as int,
        carbs: (json['carbs_g'] as num).toDouble(),
        protein: (json['protein_g'] as num).toDouble(),
        fat: (json['fat_g'] as num).toDouble(),
        fiber: (json['fiber_g'] as num).toDouble(),
        sugar: (json['sugar_g'] as num).toDouble(),
        tags: (json['tags'] as List).cast<String>(),
      );
}

class Recipe {
  final String id;
  final String titleEn;
  final String titleAr;
  final List<String> steps;
  final int timeMin;
  final List<RecipeIngredient> ingredients;
  final List<String> tags;
  final String ifStatus;

  Recipe({
    required this.id,
    required this.titleEn,
    required this.titleAr,
    required this.steps,
    required this.timeMin,
    required this.ingredients,
    required this.tags,
    required this.ifStatus,
  });

  factory Recipe.fromJson(Map<String, dynamic> json) => Recipe(
        id: json['id'] as String,
        titleEn: json['title_en'] as String,
        titleAr: json['title_ar'] as String,
        steps: (json['steps'] as List).cast<String>(),
        timeMin: json['time_min'] as int,
        ingredients: (json['ingredients'] as List)
            .map((e) => RecipeIngredient.fromJson(e as Map<String, dynamic>))
            .toList(),
        tags: (json['tags'] as List).cast<String>(),
        ifStatus: json['if_status'] as String,
      );
}

class RecipeIngredient {
  final String foodId;
  final double grams;
  RecipeIngredient({required this.foodId, required this.grams});
  factory RecipeIngredient.fromJson(Map<String, dynamic> json) => RecipeIngredient(
        foodId: json['food_id'] as String,
        grams: (json['grams'] as num).toDouble(),
      );
}

class VideoClip {
  final String id;
  final String slug;
  final String url;
  final int durationSec;
  final List<String> tags;
  final String locale;

  VideoClip({
    required this.id,
    required this.slug,
    required this.url,
    required this.durationSec,
    required this.tags,
    required this.locale,
  });

  factory VideoClip.fromJson(Map<String, dynamic> json) => VideoClip(
        id: json['id'] as String,
        slug: json['slug'] as String,
        url: json['url'] as String,
        durationSec: json['duration_sec'] as int,
        tags: (json['tags'] as List).cast<String>(),
        locale: json['locale'] as String,
      );
}

class SDUIScreen {
  final String id;
  final String screenKey;
  final String goal;
  final String locale;
  final int schemaVersion;
  final String minAppVersion;
  final bool isActive;
  final Map<String, dynamic> payload;

  SDUIScreen({
    required this.id,
    required this.screenKey,
    required this.goal,
    required this.locale,
    required this.schemaVersion,
    required this.minAppVersion,
    required this.isActive,
    required this.payload,
  });
}