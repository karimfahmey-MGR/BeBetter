/*
 * Directus schema and seed script
 *
 * This script creates all collections and fields required by the BeBetter
 * application and inserts starter records for goal defaults, fasting presets,
 * foods, recipes, videos, SDUI screens and brand links.  It authenticates
 * against the Directus API using the admin credentials in environment
 * variables and uses the REST API to create collections, fields and items.
 *
 * Run with: `yarn ts-node seed.ts`
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.DIRECTUS_BASE_URL || 'http://localhost:8055';
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Please set DIRECTUS_ADMIN_EMAIL and DIRECTUS_ADMIN_PASSWORD in your environment');
  process.exit(1);
}

async function login(): Promise<string> {
  const res = await axios.post(`${BASE_URL}/auth/login`, {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  return res.data.data.access_token;
}

interface FieldDefinition {
  field: string;
  type: string;
  primary?: boolean;
  special?: string[];
  defaultValue?: any;
  interface?: string;
  options?: any;
  meta?: any;
  required?: boolean;
}

interface CollectionDefinition {
  collection: string;
  schema: {
    fields: FieldDefinition[];
  };
  meta?: {
    collection: string;
    note?: string;
  };
}

/**
 * Create a collection with the specified fields.  If the collection already
 * exists, errors will be ignored.  Directus automatically creates `id`,
 * `created_at` and `updated_at` fields when they are not provided.
 */
async function createCollection(token: string, def: CollectionDefinition) {
  try {
    await axios.post(
      `${BASE_URL}/collections`,
      {
        collection: def.collection,
        meta: def.meta ?? { collection: def.collection },
        schema: def.schema,
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    console.log(`Created collection ${def.collection}`);
  } catch (err: any) {
    if (err.response && err.response.status === 409) {
      console.log(`Collection ${def.collection} already exists, skipping`);
    } else {
      console.error(`Failed to create collection ${def.collection}`);
      throw err;
    }
  }
}

/**
 * Insert multiple items into a collection.  Items should match the schema.
 */
async function insertItems(token: string, collection: string, items: any[]) {
  if (items.length === 0) return;
  await axios.post(
    `${BASE_URL}/items/${collection}`,
    items,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  console.log(`Inserted ${items.length} records into ${collection}`);
}

/**
 * Seed goal defaults, fasting presets, foods, recipes, videos, SDUI screens and brands.
 */
async function seedData(token: string) {
  // Goal defaults
  const goalDefaults = [
    {
      goal: 'lose_weight',
      deficit_pct: 0.2,
      surplus_pct: 0.0,
      protein_g_per_kg: 1.6,
      macro_split_json: { protein: 0.3, carb: 0.4, fat: 0.3 },
      mifflin_coeffs_json: { male: { s: 5 }, female: { s: -161 } },
      activity_factors_json: { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 },
      algo_weights_json: { alpha: 0.7, beta: 0.3, wP: 0.6, wS: 0.2, wI: 0.15, wC: 0.05 },
    },
    {
      goal: 'gain_weight',
      deficit_pct: 0.0,
      surplus_pct: 0.15,
      protein_g_per_kg: 1.8,
      macro_split_json: { protein: 0.3, carb: 0.45, fat: 0.25 },
      mifflin_coeffs_json: { male: { s: 5 }, female: { s: -161 } },
      activity_factors_json: { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 },
      algo_weights_json: { alpha: 0.7, beta: 0.3, wP: 0.5, wS: 0.3, wI: 0.1, wC: 0.1 },
    },
    {
      goal: 'healthy_life',
      deficit_pct: 0.05,
      surplus_pct: 0.0,
      protein_g_per_kg: 1.6,
      macro_split_json: { protein: 0.3, carb: 0.4, fat: 0.3 },
      mifflin_coeffs_json: { male: { s: 5 }, female: { s: -161 } },
      activity_factors_json: { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 },
      algo_weights_json: { alpha: 0.6, beta: 0.4, wP: 0.5, wS: 0.2, wI: 0.15, wC: 0.15 },
    },
    {
      goal: 'maintain',
      deficit_pct: 0.0,
      surplus_pct: 0.0,
      protein_g_per_kg: 1.6,
      macro_split_json: { protein: 0.3, carb: 0.4, fat: 0.3 },
      mifflin_coeffs_json: { male: { s: 5 }, female: { s: -161 } },
      activity_factors_json: { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 },
      algo_weights_json: { alpha: 0.5, beta: 0.5, wP: 0.4, wS: 0.3, wI: 0.2, wC: 0.1 },
    },
  ];

  await insertItems(token, 'goal_defaults', goalDefaults);

  // Fasting presets
  const fastingPresets = [
    { label: '12:12', start_hour: 20, end_hour: 8, reminders_json: { pre_start_min: 30, pre_end_min: 30 } },
    { label: '14:10', start_hour: 18, end_hour: 8, reminders_json: { pre_start_min: 30, pre_end_min: 30 } },
    { label: '16:8', start_hour: 16, end_hour: 8, reminders_json: { pre_start_min: 30, pre_end_min: 30 } },
    { label: '18:6', start_hour: 14, end_hour: 8, reminders_json: { pre_start_min: 30, pre_end_min: 30 } },
    { label: '20:4', start_hour: 12, end_hour: 8, reminders_json: { pre_start_min: 30, pre_end_min: 30 } },
    { label: '24h', start_hour: 0, end_hour: 0, reminders_json: { pre_start_min: 60, pre_end_min: 60 } },
  ];
  await insertItems(token, 'fasting_presets', fastingPresets);

  // Foods
  interface FoodSeed {
    name_en: string;
    name_ar: string;
    kcal: number;
    carbs_g: number;
    protein_g: number;
    fat_g: number;
    fiber_g: number;
    sugar_g: number;
    tags: string[];
    portion_images?: any;
    locale?: string;
  }
  const foods: FoodSeed[] = [
    { name_en: 'Black coffee', name_ar: 'قهوة سادة', kcal: 2, carbs_g: 0, protein_g: 0, fat_g: 0, fiber_g: 0, sugar_g: 0, tags: ['caffeine', 'breaks_fast_no'] },
    { name_en: 'Latte (250ml)', name_ar: 'لاتيه', kcal: 150, carbs_g: 12, protein_g: 8, fat_g: 7, fiber_g: 0, sugar_g: 10, tags: ['dairy', 'insulin', 'breaks_fast_yes'] },
    { name_en: 'Unsweetened tea', name_ar: 'شاي بدون سكر', kcal: 2, carbs_g: 0, protein_g: 0, fat_g: 0, fiber_g: 0, sugar_g: 0, tags: ['breaks_fast_no'] },
    { name_en: 'Water with lemon', name_ar: 'ماء بالليمون', kcal: 2, carbs_g: 0, protein_g: 0, fat_g: 0, fiber_g: 0, sugar_g: 0, tags: ['electrolytes_ok', 'breaks_fast_no'] },
    { name_en: 'Foul (200g)', name_ar: 'فول', kcal: 280, carbs_g: 42, protein_g: 16, fat_g: 6, fiber_g: 12, sugar_g: 2, tags: ['legume', 'fiber', 'satiety', 'breaks_fast_yes'] },
    { name_en: 'Falafel (4 pcs) baked/air-fried', name_ar: 'طعمية (٤ قطع)', kcal: 280, carbs_g: 24, protein_g: 10, fat_g: 16, fiber_g: 6, sugar_g: 1, tags: ['vegetarian', 'fried_or_airfried', 'breaks_fast_yes'] },
    { name_en: 'Balady bread (1 med pita)', name_ar: 'عيش بلدي', kcal: 170, carbs_g: 34, protein_g: 5, fat_g: 1, fiber_g: 3, sugar_g: 1, tags: ['starch', 'high_gi', 'breaks_fast_yes'] },
    { name_en: 'Cooked white rice (150g)', name_ar: 'أرز أبيض مطبوخ', kcal: 195, carbs_g: 42, protein_g: 4, fat_g: 0, fiber_g: 1, sugar_g: 0, tags: ['starch', 'high_gi', 'breaks_fast_yes'] },
    { name_en: 'Cooked brown rice (150g)', name_ar: 'أرز بني مطبوخ', kcal: 180, carbs_g: 38, protein_g: 4, fat_g: 1, fiber_g: 2, sugar_g: 0, tags: ['starch', 'fiber', 'breaks_fast_yes'] },
    { name_en: 'Pasta (cooked 150g)', name_ar: 'مكرونة مطبوخة', kcal: 230, carbs_g: 45, protein_g: 8, fat_g: 2, fiber_g: 2, sugar_g: 2, tags: ['starch', 'breaks_fast_yes'] },
    { name_en: 'Chicken breast (150g, grilled)', name_ar: 'صدر دجاج مشوي', kcal: 250, carbs_g: 0, protein_g: 42, fat_g: 6, fiber_g: 0, sugar_g: 0, tags: ['protein', 'breaks_fast_yes'] },
    { name_en: 'Minced beef lean (150g)', name_ar: 'لحمة مفرومة قليلة الدهن', kcal: 320, carbs_g: 0, protein_g: 30, fat_g: 22, fiber_g: 0, sugar_g: 0, tags: ['protein', 'satiety', 'breaks_fast_yes'] },
    { name_en: 'Eggs (2)', name_ar: 'بيض (٢)', kcal: 150, carbs_g: 2, protein_g: 13, fat_g: 10, fiber_g: 0, sugar_g: 0, tags: ['protein', 'leucine', 'breaks_fast_yes'] },
    { name_en: 'Cucumber (1)', name_ar: 'خيار', kcal: 10, carbs_g: 2, protein_g: 0, fat_g: 0, fiber_g: 1, sugar_g: 1, tags: ['low_cal', 'hydration', 'breaks_fast_yes'] },
    { name_en: 'Tomato (1)', name_ar: 'طماطم', kcal: 20, carbs_g: 4, protein_g: 1, fat_g: 0, fiber_g: 1, sugar_g: 3, tags: ['low_cal', 'breaks_fast_yes'] },
    { name_en: 'Onion (1 med)', name_ar: 'بصلة', kcal: 40, carbs_g: 9, protein_g: 1, fat_g: 0, fiber_g: 1, sugar_g: 4, tags: ['aroma', 'breaks_fast_yes'] },
    { name_en: 'Olive oil (1 tsp)', name_ar: 'زيت زيتون (ملعقة صغيرة)', kcal: 40, carbs_g: 0, protein_g: 0, fat_g: 4.5, fiber_g: 0, sugar_g: 0, tags: ['fat', 'satiety', 'breaks_fast_yes'] },
    { name_en: 'Oats (dry 50g)', name_ar: 'شوفان (50 جم)', kcal: 190, carbs_g: 32, protein_g: 7, fat_g: 4, fiber_g: 5, sugar_g: 1, tags: ['fiber', 'beta_glucan', 'breaks_fast_yes'] },
    { name_en: 'Yogurt plain (170g)', name_ar: 'زبادي سادة', kcal: 100, carbs_g: 8, protein_g: 9, fat_g: 3, fiber_g: 0, sugar_g: 8, tags: ['dairy', 'protein', 'breaks_fast_yes'] },
    { name_en: 'Guava (1)', name_ar: 'جوافة', kcal: 60, carbs_g: 14, protein_g: 2, fat_g: 1, fiber_g: 5, sugar_g: 9, tags: ['vitamin_c', 'fiber', 'breaks_fast_yes'] },
    { name_en: 'Orange (1)', name_ar: 'برتقالة', kcal: 62, carbs_g: 15, protein_g: 1, fat_g: 0, fiber_g: 3, sugar_g: 12, tags: ['vitamin_c', 'breaks_fast_yes'] },
    { name_en: 'Sardines (100g)', name_ar: 'سردين', kcal: 208, carbs_g: 0, protein_g: 25, fat_g: 11, fiber_g: 0, sugar_g: 0, tags: ['omega3', 'protein', 'breaks_fast_yes'] },
    { name_en: 'Mackerel (100g)', name_ar: 'ماكريل', kcal: 230, carbs_g: 0, protein_g: 21, fat_g: 15, fiber_g: 0, sugar_g: 0, tags: ['omega3', 'protein', 'breaks_fast_yes'] },
    { name_en: 'Walnuts (20g)', name_ar: 'عين جمل', kcal: 130, carbs_g: 3, protein_g: 3, fat_g: 13, fiber_g: 2, sugar_g: 1, tags: ['omega3', 'fat', 'breaks_fast_yes'] },
    { name_en: 'Diet soda (330ml)', name_ar: 'صودا دايت', kcal: 0, carbs_g: 0, protein_g: 0, fat_g: 0, fiber_g: 0, sugar_g: 0, tags: ['sweetener', 'breaks_fast_no'] },
    { name_en: 'Sugary soda (330ml)', name_ar: 'صودا سكر', kcal: 140, carbs_g: 35, protein_g: 0, fat_g: 0, fiber_g: 0, sugar_g: 35, tags: ['sugar', 'insulin', 'breaks_fast_yes'] },
    { name_en: 'Lentils (cooked 150g)', name_ar: 'عدس مطبوخ', kcal: 180, carbs_g: 30, protein_g: 12, fat_g: 1, fiber_g: 12, sugar_g: 1, tags: ['legume', 'fiber', 'breaks_fast_yes'] },
    { name_en: 'Molokhia (1 cup)', name_ar: 'ملوخية', kcal: 40, carbs_g: 7, protein_g: 3, fat_g: 1, fiber_g: 3, sugar_g: 1, tags: ['greens', 'fiber', 'breaks_fast_yes'] },
    { name_en: 'Tuna in water (100g)', name_ar: 'تونة بالماء', kcal: 120, carbs_g: 0, protein_g: 26, fat_g: 1, fiber_g: 0, sugar_g: 0, tags: ['protein', 'breaks_fast_yes'] },
    { name_en: 'Brown beans can (100g)', name_ar: 'فاصوليا بنية', kcal: 110, carbs_g: 19, protein_g: 7, fat_g: 0.5, fiber_g: 7, sugar_g: 1, tags: ['legume', 'fiber', 'breaks_fast_yes'] },
    { name_en: 'Tahina (1 tbsp)', name_ar: 'طحينة (ملعقة كبيرة)', kcal: 90, carbs_g: 3, protein_g: 3, fat_g: 8, fiber_g: 1, sugar_g: 0, tags: ['sesame', 'fat', 'breaks_fast_yes'] },
    { name_en: 'Hummus (100g)', name_ar: 'حمص', kcal: 165, carbs_g: 27, protein_g: 8, fat_g: 5, fiber_g: 7, sugar_g: 1, tags: ['legume', 'fiber', 'breaks_fast_yes'] },
    { name_en: 'Apple (1)', name_ar: 'تفاحة', kcal: 95, carbs_g: 25, protein_g: 0, fat_g: 0, fiber_g: 4, sugar_g: 19, tags: ['fruit', 'breaks_fast_yes'] },
    { name_en: 'Banana (1)', name_ar: 'موزة', kcal: 105, carbs_g: 27, protein_g: 1, fat_g: 0, fiber_g: 3, sugar_g: 14, tags: ['fruit', 'potassium', 'breaks_fast_yes'] },
    { name_en: 'Electrolyte water (no sugar)', name_ar: 'إلكتروليت بدون سكر', kcal: 0, carbs_g: 0, protein_g: 0, fat_g: 0, fiber_g: 0, sugar_g: 0, tags: ['electrolytes_ok', 'breaks_fast_no'] },
    { name_en: 'Cinnamon tea (no sugar)', name_ar: 'شاي بالقرفة بدون سكر', kcal: 2, carbs_g: 0, protein_g: 0, fat_g: 0, fiber_g: 0, sugar_g: 0, tags: ['breaks_fast_no'] },
  ];
  await insertItems(token, 'foods', foods);

  // Insert recipes.  We'll reference foods by name after insertion.  First, fetch all foods to get their IDs.
  const { data: foodsData } = await axios.get(`${BASE_URL}/items/foods?limit=100`, { headers: { Authorization: `Bearer ${token}` } });
  const foodIdByName: Record<string, string> = {};
  for (const item of foodsData.data) {
    foodIdByName[item.name_en] = item.id;
  }
  interface RecipeSeed {
    title_en: string;
    title_ar: string;
    steps: string[];
    time_min: number;
    ingredients: { food_id: string; grams: number }[];
    tags: string[];
    if_status: string;
  }
  const recipes: RecipeSeed[] = [
    {
      title_en: 'Tuna lemon plate',
      title_ar: 'طبق تونة بالليمون',
      steps: ['Drain tuna', 'Add lemon + salt', 'Add cucumber slices'],
      time_min: 5,
      ingredients: [
        { food_id: foodIdByName['Tuna in water (100g)'], grams: 100 },
        { food_id: foodIdByName['Cucumber (1)'], grams: 100 },
      ],
      tags: ['no_cook', 'high_protein'],
      if_status: 'breaks_fast_yes',
    },
    {
      title_en: 'Egg-white scramble + salad',
      title_ar: 'بيض بياض بالمقلاة + سلطة',
      steps: ['Whisk whites', 'Quick sauté', 'Serve with cucumber'],
      time_min: 7,
      ingredients: [
        { food_id: foodIdByName['Eggs (2)'], grams: 100 },
        { food_id: foodIdByName['Cucumber (1)'], grams: 100 },
      ],
      tags: ['quick', 'lean'],
      if_status: 'breaks_fast_yes',
    },
    {
      title_en: 'Lean foul bowl',
      title_ar: 'طبق فول خفيف',
      steps: ['Warm foul', 'Add lemon', '1 tsp olive oil'],
      time_min: 6,
      ingredients: [
        { food_id: foodIdByName['Foul (200g)'], grams: 200 },
        { food_id: foodIdByName['Olive oil (1 tsp)'], grams: 5 },
        { food_id: foodIdByName['Water with lemon'], grams: 30 },
      ],
      tags: ['fiber', 'budget'],
      if_status: 'breaks_fast_yes',
    },
    {
      title_en: 'Air-fried falafel',
      title_ar: 'طعميه في القلاية الهوائية',
      steps: ['Preheat AF', 'Arrange pieces', 'Cook 8–10 min'],
      time_min: 10,
      ingredients: [
        { food_id: foodIdByName['Falafel (4 pcs) baked/air-fried'], grams: 120 },
      ],
      tags: ['vegetarian', 'min_effort'],
      if_status: 'breaks_fast_yes',
    },
    {
      title_en: 'Chicken bites (AF)',
      title_ar: 'قطع دجاج في القلاية',
      steps: ['Cube chicken', 'Season', 'Air fry 10–12m'],
      time_min: 12,
      ingredients: [
        { food_id: foodIdByName['Chicken breast (150g, grilled)'], grams: 150 },
      ],
      tags: ['protein', 'quick'],
      if_status: 'breaks_fast_yes',
    },
    {
      title_en: 'Oats savory porridge',
      title_ar: 'شوفان مالح',
      steps: ['Boil oats', 'Add egg & salt', 'Serve'],
      time_min: 10,
      ingredients: [
        { food_id: foodIdByName['Oats (dry 50g)'], grams: 50 },
        { food_id: foodIdByName['Eggs (2)'], grams: 50 },
      ],
      tags: ['balanced', 'easy'],
      if_status: 'breaks_fast_yes',
    },
    {
      title_en: 'Minced beef + cucumber',
      title_ar: 'لحمة مفرومة وخيار',
      steps: ['Pan-fry beef', 'Serve with cucumber'],
      time_min: 10,
      ingredients: [
        { food_id: foodIdByName['Minced beef lean (150g)'], grams: 150 },
        { food_id: foodIdByName['Cucumber (1)'], grams: 100 },
      ],
      tags: ['low_carb', 'high_protein'],
      if_status: 'breaks_fast_yes',
    },
    {
      title_en: 'Chicken + rice (half)',
      title_ar: 'دجاج وأرز (نصف)',
      steps: ['Cook rice', 'Grill chicken', 'Serve'],
      time_min: 20,
      ingredients: [
        { food_id: foodIdByName['Chicken breast (150g, grilled)'], grams: 150 },
        { food_id: foodIdByName['Cooked white rice (150g)'], grams: 150 },
      ],
      tags: ['post_workout', 'balanced'],
      if_status: 'breaks_fast_yes',
    },
    {
      title_en: 'Molokhia side',
      title_ar: 'ملوخية جانبية',
      steps: ['Boil stock', 'Add molokhia', 'Serve'],
      time_min: 12,
      ingredients: [
        { food_id: foodIdByName['Molokhia (1 cup)'], grams: 200 },
      ],
      tags: ['fiber', 'greens'],
      if_status: 'breaks_fast_yes',
    },
    {
      title_en: 'Lentil bowl',
      title_ar: 'شوربة عدس',
      steps: ['Boil lentils', 'Season', 'Serve'],
      time_min: 20,
      ingredients: [
        { food_id: foodIdByName['Lentils (cooked 150g)'], grams: 150 },
      ],
      tags: ['fiber', 'comfort'],
      if_status: 'breaks_fast_yes',
    },
    {
      title_en: 'Yogurt power bowl',
      title_ar: 'وعاء زبادي',
      steps: ['Add yogurt', 'Top with walnuts'],
      time_min: 3,
      ingredients: [
        { food_id: foodIdByName['Yogurt plain (170g)'], grams: 170 },
        { food_id: foodIdByName['Walnuts (20g)'], grams: 20 },
      ],
      tags: ['balanced'],
      if_status: 'breaks_fast_yes',
    },
    {
      title_en: 'Rice swap: cucumber plate',
      title_ar: 'بديل الأرز: طبق خيار',
      steps: ['Slice cucumber', 'Drizzle lemon'],
      time_min: 2,
      ingredients: [
        { food_id: foodIdByName['Cucumber (1)'], grams: 200 },
      ],
      tags: ['low_cal', 'swap'],
      if_status: 'breaks_fast_yes',
    },
  ];
  await insertItems(token, 'recipes', recipes);

  // Videos
  interface VideoSeed {
    slug: string;
    url: string;
    duration_sec: number;
    tags: string[];
    locale: string;
  }
  const videos: VideoSeed[] = [
    { slug: 'coffee_fast_safe', url: 'https://youtube.com/watch?v=UNLISTED_1', duration_sec: 75, tags: ['caffeine', 'breaks_fast_no'], locale: 'global' },
    { slug: 'latte_breaks_fast', url: 'https://youtube.com/watch?v=UNLISTED_2', duration_sec: 80, tags: ['dairy', 'insulin', 'breaks_fast_yes'], locale: 'global' },
    { slug: 'foul_satiety', url: 'https://youtube.com/watch?v=UNLISTED_3', duration_sec: 85, tags: ['fiber', 'satiety'], locale: 'global' },
    { slug: 'chicken_protein', url: 'https://youtube.com/watch?v=UNLISTED_4', duration_sec: 70, tags: ['protein', 'muscle'], locale: 'global' },
    { slug: 'rice_glycemic', url: 'https://youtube.com/watch?v=UNLISTED_5', duration_sec: 90, tags: ['high_gi', 'insulin'], locale: 'global' },
    { slug: 'diet_soda_appetite', url: 'https://youtube.com/watch?v=UNLISTED_6', duration_sec: 70, tags: ['sweetener'], locale: 'global' },
    { slug: 'sardine_omega3', url: 'https://youtube.com/watch?v=UNLISTED_7', duration_sec: 75, tags: ['omega3'], locale: 'global' },
    { slug: '24h_fast_phases', url: 'https://youtube.com/watch?v=UNLISTED_8', duration_sec: 85, tags: ['fasting', 'autophagy'], locale: 'global' },
    { slug: 'electrolytes_fasting', url: 'https://youtube.com/watch?v=UNLISTED_9', duration_sec: 65, tags: ['electrolytes_ok'], locale: 'global' },
    { slug: 'oats_beta_glucan', url: 'https://youtube.com/watch?v=UNLISTED_10', duration_sec: 70, tags: ['fiber', 'satiety'], locale: 'global' },
    { slug: 'protein_timing', url: 'https://youtube.com/watch?v=UNLISTED_11', duration_sec: 80, tags: ['muscle', 'protein'], locale: 'global' },
    { slug: 'fat_vs_satiety', url: 'https://youtube.com/watch?v=UNLISTED_12', duration_sec: 75, tags: ['satiety'], locale: 'global' },
    { slug: 'glycemic_swaps', url: 'https://youtube.com/watch?v=UNLISTED_13', duration_sec: 80, tags: ['high_gi', 'swap'], locale: 'global' },
    { slug: 'hydration_focus', url: 'https://youtube.com/watch?v=UNLISTED_14', duration_sec: 60, tags: ['hydration'], locale: 'global' },
    { slug: 'fiber_targets', url: 'https://youtube.com/watch?v=UNLISTED_15', duration_sec: 70, tags: ['fiber'], locale: 'global' },
  ];
  await insertItems(token, 'videos', videos);

  // SDUI screens
  interface ScreenSeed {
    screen_key: string;
    goal: string;
    locale: string;
    schema_version: number;
    min_app_version: string;
    is_active: boolean;
    payload_json: any;
  }
  const sduiScreens: ScreenSeed[] = [
    {
      screen_key: 'home',
      goal: 'lose_weight',
      locale: 'en',
      schema_version: 1,
      min_app_version: '1.0.0',
      is_active: true,
      payload_json: {
        type: 'List',
        children: [
          { type: 'Banner', props: { title: 'Crush today', subtitle: 'Under target + hit your fast', icon: '🔥' } },
          { type: 'Card', props: { title: 'What can I make now?', action: 'open_pantry', variant: 'max_impact' } },
          { type: 'Card', props: { title: 'Your fast', action: 'open_fasting', variant: 'countdown' } },
          { type: 'VideoTile', props: { tag_query: ['insulin', 'satiety'], title: 'Watch: protein keeps you full' } },
        ],
      },
    },
    {
      screen_key: 'home',
      goal: 'lose_weight',
      locale: 'ar',
      schema_version: 1,
      min_app_version: '1.0.0',
      is_active: true,
      payload_json: {
        type: 'List',
        rtl: true,
        children: [
          { type: 'Banner', props: { title: 'ابدأ بقوة', subtitle: 'التزم بالسعرات وأكمل صيامك', icon: '🔥' } },
          { type: 'Card', props: { title: 'أطبخ إيه دلوقتي؟', action: 'open_pantry', variant: 'max_impact' } },
          { type: 'Card', props: { title: 'صيامك الآن', action: 'open_fasting', variant: 'countdown' } },
          { type: 'VideoTile', props: { tag_query: ['insulin', 'satiety'], title: 'شاهد: البروتين يشبع' } },
        ],
      },
    },
    {
      screen_key: 'logger',
      goal: '*',
      locale: 'en',
      schema_version: 1,
      min_app_version: '1.0.0',
      is_active: true,
      payload_json: {
        type: 'List',
        children: [
          { type: 'Banner', props: { title: 'Log a meal', subtitle: '3 taps or less', icon: '🍽️' } },
          { type: 'Card', props: { title: 'Recent', action: 'open_recent', variant: 'list' } },
          { type: 'Card', props: { title: 'Favorites', action: 'open_favorites', variant: 'list' } },
        ],
      },
    },
    {
      screen_key: 'logger',
      goal: '*',
      locale: 'ar',
      schema_version: 1,
      min_app_version: '1.0.0',
      is_active: true,
      payload_json: {
        type: 'List',
        rtl: true,
        children: [
          { type: 'Banner', props: { title: 'سجل وجبتك', subtitle: '٣ ضغطات بالكثير', icon: '🍽️' } },
          { type: 'Card', props: { title: 'الأخيرة', action: 'open_recent', variant: 'list' } },
          { type: 'Card', props: { title: 'المفضلة', action: 'open_favorites', variant: 'list' } },
        ],
      },
    },
    {
      screen_key: 'pantry',
      goal: '*',
      locale: 'en',
      schema_version: 1,
      min_app_version: '1.0.0',
      is_active: true,
      payload_json: {
        type: 'List',
        children: [
          { type: 'Banner', props: { title: 'What can I make now?', subtitle: 'From your fridge to your goal', icon: '🧑‍🍳' } },
          { type: 'Card', props: { title: 'Max Impact', action: 'open_suggestions', variant: 'max_impact' } },
          { type: 'Card', props: { title: 'Min Effort', action: 'open_suggestions', variant: 'min_effort' } },
          { type: 'Card', props: { title: 'Balanced', action: 'open_suggestions', variant: 'balanced' } },
        ],
      },
    },
    {
      screen_key: 'pantry',
      goal: '*',
      locale: 'ar',
      schema_version: 1,
      min_app_version: '1.0.0',
      is_active: true,
      payload_json: {
        type: 'List',
        rtl: true,
        children: [
          { type: 'Banner', props: { title: 'نطبخ إيه دلوقتي؟', subtitle: 'من التلاجة لهدفك', icon: '🧑‍🍳' } },
          { type: 'Card', props: { title: 'أعلى تأثير', action: 'open_suggestions', variant: 'max_impact' } },
          { type: 'Card', props: { title: 'أقل مجهود', action: 'open_suggestions', variant: 'min_effort' } },
          { type: 'Card', props: { title: 'متوازن', action: 'open_suggestions', variant: 'balanced' } },
        ],
      },
    },
    {
      screen_key: 'fasting',
      goal: '*',
      locale: 'en',
      schema_version: 1,
      min_app_version: '1.0.0',
      is_active: true,
      payload_json: {
        type: 'List',
        children: [
          { type: 'Banner', props: { title: 'Your fast', subtitle: 'Current window & reminders', icon: '⏳' } },
          { type: 'Card', props: { title: 'Start/End Fast', action: 'toggle_fast', variant: 'primary' } },
          { type: 'Card', props: { title: 'Presets', action: 'open_presets', variant: 'list' } },
        ],
      },
    },
    {
      screen_key: 'fasting',
      goal: '*',
      locale: 'ar',
      schema_version: 1,
      min_app_version: '1.0.0',
      is_active: true,
      payload_json: {
        type: 'List',
        rtl: true,
        children: [
          { type: 'Banner', props: { title: 'صيامك', subtitle: 'النافذة والتنبيهات', icon: '⏳' } },
          { type: 'Card', props: { title: 'ابدأ/أنه الصيام', action: 'toggle_fast', variant: 'primary' } },
          { type: 'Card', props: { title: 'الأنماط', action: 'open_presets', variant: 'list' } },
        ],
      },
    },
  ];
  await insertItems(token, 'sdui_screens', sduiScreens);

  // Brand links
  const brands = [
    { item_ref: 'Oats 1kg', partner: 'TALABAT', deep_link_url: 'https://talabat.link/search?q=oats%201kg', locale: 'ar', price_hint: '~70–90 EGP' },
    { item_ref: 'Canned Foul', partner: 'RABBIT', deep_link_url: 'https://rabbit.link/search?q=foul%20can', locale: 'ar', price_hint: null },
    { item_ref: 'Chicken Breast 1kg', partner: 'INSTASHOP', deep_link_url: 'https://instashop.link/search?q=chicken%20breast', locale: 'ar', price_hint: null },
  ];
  await insertItems(token, 'brands_links', brands);
}

async function main() {
  const token = await login();
  console.log('Authenticated');
  // Define collections and fields
  const collectionDefs: CollectionDefinition[] = [
    {
      collection: 'goal_defaults',
      schema: {
        fields: [
          { field: 'id', type: 'uuid', primary: true },
          { field: 'goal', type: 'string', required: true },
          { field: 'deficit_pct', type: 'float' },
          { field: 'surplus_pct', type: 'float' },
          { field: 'protein_g_per_kg', type: 'float' },
          { field: 'macro_split_json', type: 'json' },
          { field: 'mifflin_coeffs_json', type: 'json' },
          { field: 'activity_factors_json', type: 'json' },
          { field: 'algo_weights_json', type: 'json' },
        ],
      },
      meta: { collection: 'goal_defaults', note: 'Default nutritional parameters per goal' },
    },
    {
      collection: 'fasting_presets',
      schema: {
        fields: [
          { field: 'id', type: 'uuid', primary: true },
          { field: 'label', type: 'string', required: true },
          { field: 'start_hour', type: 'integer' },
          { field: 'end_hour', type: 'integer' },
          { field: 'reminders_json', type: 'json' },
        ],
      },
    },
    {
      collection: 'foods',
      schema: {
        fields: [
          { field: 'id', type: 'uuid', primary: true },
          { field: 'name_en', type: 'string', required: true },
          { field: 'name_ar', type: 'string', required: true },
          { field: 'kcal', type: 'integer' },
          { field: 'carbs_g', type: 'float' },
          { field: 'protein_g', type: 'float' },
          { field: 'fat_g', type: 'float' },
          { field: 'fiber_g', type: 'float' },
          { field: 'sugar_g', type: 'float' },
          { field: 'tags', type: 'json' },
          { field: 'portion_images', type: 'json' },
          { field: 'locale', type: 'string', defaultValue: 'global' },
        ],
      },
    },
    {
      collection: 'recipes',
      schema: {
        fields: [
          { field: 'id', type: 'uuid', primary: true },
          { field: 'title_en', type: 'string', required: true },
          { field: 'title_ar', type: 'string', required: true },
          { field: 'steps', type: 'json' },
          { field: 'time_min', type: 'integer' },
          { field: 'ingredients', type: 'json' },
          { field: 'tags', type: 'json' },
          { field: 'if_status', type: 'string' },
        ],
      },
    },
    {
      collection: 'videos',
      schema: {
        fields: [
          { field: 'id', type: 'uuid', primary: true },
          { field: 'slug', type: 'string', required: true },
          { field: 'url', type: 'string', required: true },
          { field: 'duration_sec', type: 'integer' },
          { field: 'tags', type: 'json' },
          { field: 'locale', type: 'string' },
          { field: 'linked_food_ids', type: 'json' },
        ],
      },
    },
    {
      collection: 'sdui_screens',
      schema: {
        fields: [
          { field: 'id', type: 'uuid', primary: true },
          { field: 'screen_key', type: 'string' },
          { field: 'goal', type: 'string' },
          { field: 'locale', type: 'string' },
          { field: 'schema_version', type: 'integer' },
          { field: 'min_app_version', type: 'string' },
          { field: 'is_active', type: 'boolean' },
          { field: 'payload_json', type: 'json' },
        ],
      },
    },
    {
      collection: 'brands_links',
      schema: {
        fields: [
          { field: 'id', type: 'uuid', primary: true },
          { field: 'item_ref', type: 'string' },
          { field: 'partner', type: 'string' },
          { field: 'deep_link_url', type: 'string' },
          { field: 'locale', type: 'string' },
          { field: 'price_hint', type: 'string' },
        ],
      },
    },
    {
      collection: 'user_profiles',
      schema: {
        fields: [
          { field: 'id', type: 'uuid', primary: true },
          { field: 'sex', type: 'string' },
          { field: 'dob', type: 'date' },
          { field: 'height_cm', type: 'integer' },
          { field: 'weight_kg', type: 'float' },
          { field: 'activity_level', type: 'string' },
          { field: 'goal', type: 'string' },
          { field: 'exclusions', type: 'json' },
          { field: 'fasting_preset', type: 'string' },
          { field: 'locale', type: 'string' },
          { field: 'notif_settings_json', type: 'json' },
        ],
      },
    },
    {
      collection: 'user_targets',
      schema: {
        fields: [
          { field: 'id', type: 'uuid', primary: true },
          { field: 'user_id', type: 'uuid' },
          { field: 'calorie_kcal', type: 'integer' },
          { field: 'protein_g', type: 'float' },
          { field: 'carbs_g', type: 'float' },
          { field: 'fat_g', type: 'float' },
          { field: 'fasting_preset', type: 'string' },
          { field: 'algo_weights_json', type: 'json' },
          { field: 'computed_at', type: 'datetime' },
        ],
      },
    },
    {
      collection: 'meal_logs',
      schema: {
        fields: [
          { field: 'id', type: 'uuid', primary: true },
          { field: 'user_id', type: 'uuid' },
          { field: 'ts', type: 'datetime' },
          { field: 'items', type: 'json' },
          { field: 'totals_json', type: 'json' },
        ],
      },
    },
    {
      collection: 'pantry',
      schema: {
        fields: [
          { field: 'id', type: 'uuid', primary: true },
          { field: 'user_id', type: 'uuid' },
          { field: 'ingredient_id', type: 'uuid' },
          { field: 'qty', type: 'float' },
          { field: 'unit', type: 'string' },
          { field: 'expires_on', type: 'date' },
        ],
      },
    },
    {
      collection: 'insights',
      schema: {
        fields: [
          { field: 'id', type: 'uuid', primary: true },
          { field: 'user_id', type: 'uuid' },
          { field: 'period', type: 'string' },
          { field: 'type', type: 'string' },
          { field: 'payload_json', type: 'json' },
        ],
      },
    },
    {
      collection: 'events',
      schema: {
        fields: [
          { field: 'id', type: 'uuid', primary: true },
          { field: 'user_id', type: 'uuid', required: false },
          { field: 'name', type: 'string' },
          { field: 'props_json', type: 'json' },
          { field: 'ts', type: 'datetime', defaultValue: () => new Date().toISOString() },
        ],
      },
    },
  ];
  for (const def of collectionDefs) {
    await createCollection(token, def);
  }
  // Seed data into collections
  await seedData(token);
  console.log('Seeding complete');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});