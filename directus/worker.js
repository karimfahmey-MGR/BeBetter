/*
 * Background worker entry point for BeBetter
 *
 * This script runs in the worker service and can handle asynchronous tasks,
 * such as recomputing nutritional targets or processing nightly
 * aggregations.  In this scaffold the worker exposes a simple HTTP
 * endpoint using the native `http` module so that Directus flows can
 * trigger tasks via HTTP.  Extend this file to support additional
 * operations, e.g. sending emails, processing event queues or performing
 * long‑running computations.
 */

const http = require('http');
const axios = require('axios');

const PORT = process.env.PORT || 8080;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const PUBLIC_URL = process.env.PUBLIC_URL;

/**
 * Authenticate with Directus using admin credentials and return a bearer token.
 */
async function getAdminToken() {
  const res = await axios.post(`${PUBLIC_URL}/auth/login`, {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  return res.data.data.access_token;
}

/**
 * Recompute targets for a given user.  This function fetches the user profile
 * and goal defaults from Directus, computes new nutritional targets on the
 * fly (using the same logic as the mobile client) and writes a new record
 * into `user_targets`.  This implementation is intentionally simplified;
 * replace it with your own computation logic if needed.
 */
async function recomputeTargets(userId) {
  const token = await getAdminToken();
  const headers = { Authorization: `Bearer ${token}` };
  // Fetch profile
  const profileRes = await axios.get(
    `${PUBLIC_URL}/items/user_profiles/${userId}`,
    { headers }
  );
  const profile = profileRes.data.data;
  // Fetch goal defaults
  const goalRes = await axios.get(
    `${PUBLIC_URL}/items/goal_defaults?filter[goal][_eq]=${profile.goal}`,
    { headers }
  );
  const defaults = goalRes.data.data[0];
  // Compute BMR (Mifflin–St Jeor)
  const now = new Date();
  const age = Math.floor(
    (now.getTime() - new Date(profile.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );
  const weight = profile.weight_kg;
  const height = profile.height_cm;
  const sex = profile.sex;
  let bmr = 10 * weight + 6.25 * height - 5 * age + (sex === 'male' ? 5 : -161);
  const activity = defaults.activity_factors_json[profile.activity_level] || 1.2;
  let tdee = bmr * activity;
  // Adjust for goal
  let calorieTarget = tdee;
  if (profile.goal === 'lose_weight') {
    calorieTarget = tdee * (1 - defaults.deficit_pct);
  } else if (profile.goal === 'gain_weight') {
    calorieTarget = tdee * (1 + defaults.surplus_pct);
  } else if (profile.goal === 'healthy_life') {
    calorieTarget = tdee * 0.95;
  }
  // Protein target (g)
  const proteinPerKg = Math.max(1.6, defaults.protein_g_per_kg);
  const proteinTarget = proteinPerKg * weight;
  // Macro split
  const macros = defaults.macro_split_json;
  const carbsTarget = calorieTarget * macros.carb / 4;
  const fatTarget = calorieTarget * macros.fat / 9;
  // Persist user_targets
  await axios.post(
    `${PUBLIC_URL}/items/user_targets`,
    {
      user_id: userId,
      calorie_kcal: Math.round(calorieTarget),
      protein_g: Math.round(proteinTarget),
      carbs_g: Math.round(carbsTarget),
      fat_g: Math.round(fatTarget),
      fasting_preset: profile.fasting_preset,
      algo_weights_json: defaults.algo_weights_json,
      computed_at: new Date().toISOString(),
    },
    { headers }
  );
  console.log(`Recomputed targets for user ${userId}`);
}

// Simple HTTP server: listens for POST /recompute/:userId
const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url.startsWith('/recompute/')) {
    const userId = req.url.split('/').pop();
    try {
      await recomputeTargets(userId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));
    } catch (err) {
      console.error(err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'failed to recompute' }));
    }
    return;
  }
  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log(`Worker listening on port ${PORT}`);
});