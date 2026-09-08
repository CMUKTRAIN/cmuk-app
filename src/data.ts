import { Ingredient, Recipe, Myth, Challenge, Badge, WestminsterCourse } from "./types";

export const INITIAL_INGREDIENTS: Ingredient[] = [
  // Veg & Fruit
  {
    id: "spinach",
    name: "Fresh Spinach",
    category: "fruit_veg",
    cost: 0.35,
    co2: 0.1,
    tags: ["High Iron", "Quick"],
    swaps: {
      with: "Frozen Spinach",
      benefit: "Saves 40% cost, prevents waste, keeps 3x longer.",
      savings: 0.15,
      co2Savings: 0.02,
    },
  },
  {
    id: "tomatoes",
    name: "Chopped Canned Tomatoes",
    category: "fruit_veg",
    cost: 0.28,
    co2: 0.15,
    tags: ["Antioxidant", "Pantry Essential"],
  },
  {
    id: "carrots",
    name: "Carrots (In-Season)",
    category: "fruit_veg",
    cost: 0.12,
    co2: 0.05,
    tags: ["Vitamin A", "Cheap", "Seasonal"],
  },
  {
    id: "broccoli",
    name: "Broccoli",
    category: "fruit_veg",
    cost: 0.40,
    co2: 0.12,
    tags: ["High Fiber", "Calcium"],
  },
  {
    id: "peas",
    name: "Frozen Peas",
    category: "fruit_veg",
    cost: 0.15,
    co2: 0.08,
    tags: ["Protein Boost", "Pantry Essential"],
  },
  {
    id: "sweetcorn",
    name: "Canned Sweetcorn",
    category: "fruit_veg",
    cost: 0.22,
    co2: 0.11,
    tags: ["Sweet", "Fiber"],
  },
  {
    id: "apple",
    name: "Apple (UK)",
    category: "fruit_veg",
    cost: 0.25,
    co2: 0.06,
    tags: ["Healthy Snack", "UK In-Season"],
  },
  {
    id: "onion",
    name: "Yellow Onion",
    category: "fruit_veg",
    cost: 0.10,
    co2: 0.04,
    tags: ["Flavor Base", "Cheap"],
  },

  // Wholegrains
  {
    id: "brown_rice",
    name: "Brown Rice",
    category: "wholegrain",
    cost: 0.15,
    co2: 0.25,
    tags: ["Sustained Energy", "High Fiber"],
  },
  {
    id: "whole_pasta",
    name: "Wholewheat Pasta",
    category: "wholegrain",
    cost: 0.18,
    co2: 0.20,
    tags: ["Slow Release Carbs", "Fiber"],
    swaps: {
      with: "White Pasta",
      benefit: "Slightly cheaper, but wholewheat has 3x fiber & 2x magnesium.",
      savings: -0.05,
      co2Savings: 0,
    },
  },
  {
    id: "oats",
    name: "Porridge Oats",
    category: "wholegrain",
    cost: 0.08,
    co2: 0.09,
    tags: ["Super Cheap", "Heart Healthy", "Beta-Glucan"],
  },
  {
    id: "sweet_potato",
    name: "Sweet Potato",
    category: "wholegrain",
    cost: 0.38,
    co2: 0.11,
    tags: ["Vitamin A", "Low GI"],
  },
  {
    id: "wholemeal_bread",
    name: "Wholemeal Sliced Bread",
    category: "wholegrain",
    cost: 0.12,
    co2: 0.14,
    tags: ["Fiber", "Convenient"],
  },

  // Protein
  {
    id: "lentils",
    name: "Red Split Lentils",
    category: "protein",
    cost: 0.14,
    co2: 0.08,
    tags: ["Very Cheap", "Zero Waste", "Vegan", "High Fiber"],
  },
  {
    id: "chickpeas",
    name: "Canned Chickpeas",
    category: "protein",
    cost: 0.25,
    co2: 0.09,
    tags: ["Plant Protein", "Fiber Rich"],
    swaps: {
      with: "Dried Chickpeas",
      benefit: "Saves 50% extra cost. Cook in large batches & freeze.",
      savings: 0.12,
      co2Savings: 0.02,
    },
  },
  {
    id: "kidney_beans",
    name: "Canned Kidney Beans",
    category: "protein",
    cost: 0.22,
    co2: 0.10,
    tags: ["Iron Rich", "Plant Protein"],
  },
  {
    id: "eggs",
    name: "Free Range Eggs (2x)",
    category: "protein",
    cost: 0.45,
    co2: 0.35,
    tags: ["B12", "Versatile", "Quick Protein"],
  },
  {
    id: "tuna",
    name: "Canned Tuna in Spring Water",
    category: "protein",
    cost: 0.85,
    co2: 0.55,
    tags: ["Omega-3", "High Protein", "Pantry Essential"],
  },
  {
    id: "tofu",
    name: "Firm Tofu",
    category: "protein",
    cost: 0.60,
    co2: 0.18,
    tags: ["Vegan", "Complete Protein", "Calcium fortified"],
  },
  {
    id: "chicken_breast",
    name: "Chicken Breast",
    category: "protein",
    cost: 1.45,
    co2: 1.55,
    tags: ["High Protein", "Lean Meat"],
    swaps: {
      with: "Lentils",
      benefit: "Saves 90% CO2, cuts cost by £1.31, adds 15g helpful dietary fiber.",
      savings: 1.31,
      co2Savings: 1.47,
    },
  },

  // Dairy & Alternatives
  {
    id: "yoghurt",
    name: "Plain Greek Yoghurt",
    category: "dairy",
    cost: 0.22,
    co2: 0.28,
    tags: ["Probiotics", "Calcium", "High Protein"],
  },
  {
    id: "soy_milk",
    name: "Fortified Soy Milk",
    category: "dairy",
    cost: 0.18,
    co2: 0.12,
    tags: ["Vegan", "Calcium", "Vitamin D"],
  },
  {
    id: "cheddar",
    name: "Mature Cheddar Cheese",
    category: "dairy",
    cost: 0.45,
    co2: 0.65,
    tags: ["High Calcium", "Rich Taste"],
  },
  {
    id: "cottage_cheese",
    name: "Cottage Cheese",
    category: "dairy",
    cost: 0.35,
    co2: 0.24,
    tags: ["Low Fat", "High Casein Protein"],
  },

  // Healthy Fats
  {
    id: "olive_oil",
    name: "Olive Oil (1 tbsp)",
    category: "fats",
    cost: 0.10,
    co2: 0.05,
    tags: ["Monounsaturated Fats", "Polyphenols"],
  },
  {
    id: "rapeseed_oil",
    name: "Rapeseed Oil (1 tbsp)",
    category: "fats",
    cost: 0.06,
    co2: 0.04,
    tags: ["UK Grown", "Omega-3", "Cheaper"],
  },
  {
    id: "avocado",
    name: "Half Avocado",
    category: "fats",
    cost: 0.55,
    co2: 0.38,
    tags: ["Heart Healthy", "Fiber", "Potassium"],
    swaps: {
      with: "Sunflower Seeds",
      benefit: "Saves 70% cost, zero air miles/imported water footprint, similar healthy fats.",
      savings: 0.38,
      co2Savings: 0.25,
    },
  },
  {
    id: "sunflower_seeds",
    name: "Sunflower Seeds (1 tbsp)",
    category: "fats",
    cost: 0.12,
    co2: 0.08,
    tags: ["Vitamin E", "Budget-friendly Healthy Fats"],
  },

  // --- New genuine additions (Harvard-plate teaching list) ---
  {
    id: "strawberries",
    name: "Strawberries",
    category: "fruit_veg",
    cost: 0.45,
    co2: 0.18,
    tags: ["Vitamin C", "Antioxidant"],
  },
  {
    id: "quinoa",
    name: "Quinoa",
    category: "wholegrain",
    cost: 0.35,
    co2: 0.22,
    tags: ["Complete Protein", "Gluten-Free"],
  },
  {
    id: "grilled_chicken",
    name: "Grilled Chicken Breast",
    category: "protein",
    cost: 0.95,
    co2: 0.85,
    tags: ["Lean Protein", "High Protein"],
  },
  {
    id: "pear",
    name: "Pear",
    category: "fruit_veg",
    cost: 0.28,
    co2: 0.07,
    tags: ["Fiber", "Seasonal"],
  },
  {
    id: "orange",
    name: "Orange",
    category: "fruit_veg",
    cost: 0.20,
    co2: 0.09,
    tags: ["Vitamin C"],
  },
  {
    id: "peppers",
    name: "Bell Peppers",
    category: "fruit_veg",
    cost: 0.30,
    co2: 0.10,
    tags: ["Vitamin C", "Colorful"],
  },
  {
    id: "salmon",
    name: "Salmon Fillet",
    category: "protein",
    cost: 1.60,
    co2: 0.75,
    tags: ["Omega-3", "High Protein"],
  },
  {
    id: "barley",
    name: "Pearl Barley",
    category: "wholegrain",
    cost: 0.16,
    co2: 0.14,
    tags: ["High Fiber", "Cheap"],
  },
  {
    id: "blueberries",
    name: "Blueberries",
    category: "fruit_veg",
    cost: 0.55,
    co2: 0.20,
    tags: ["Antioxidant", "Superfood"],
  },
  {
    id: "banana",
    name: "Banana",
    category: "fruit_veg",
    cost: 0.15,
    co2: 0.08,
    tags: ["Potassium", "Quick Energy"],
  },
  {
    id: "cauliflower",
    name: "Cauliflower",
    category: "fruit_veg",
    cost: 0.32,
    co2: 0.11,
    tags: ["Low Carb", "Versatile"],
  },

  // --- Deliberately mis-tagged items (teaching trap: category may not match reality) ---
  {
    id: "white_bread",
    name: "White Sliced Bread",
    category: "protein",
    cost: 0.10,
    co2: 0.12,
    tags: ["Refined Grain"],
    isMisleading: true,
  },
  {
    id: "fried_chips",
    name: "Fried Chips",
    category: "dairy",
    cost: 0.45,
    co2: 0.35,
    tags: ["Fried", "High Fat"],
    isMisleading: true,
  },
  {
    id: "fruit_sweets",
    name: "Fruit Sweets",
    category: "fruit_veg",
    cost: 0.30,
    co2: 0.10,
    tags: ["Sugary", "Processed"],
    isMisleading: true,
  },
  {
    id: "tinned_fruit_syrup",
    name: "Tinned Fruit in Syrup",
    category: "fruit_veg",
    cost: 0.35,
    co2: 0.13,
    tags: ["Added Sugar", "Processed"],
    isMisleading: true,
  },
  {
    id: "battered_onion_rings",
    name: "Battered Onion Rings",
    category: "wholegrain",
    cost: 0.40,
    co2: 0.30,
    tags: ["Fried", "Processed"],
    isMisleading: true,
  },
  {
    id: "breakfast_cereal",
    name: "Sugary Breakfast Cereal",
    category: "wholegrain",
    cost: 0.20,
    co2: 0.15,
    tags: ["High Sugar", "Processed"],
    isMisleading: true,
  },
  {
    id: "sausages",
    name: "Sausages",
    category: "protein",
    cost: 0.55,
    co2: 0.65,
    tags: ["Processed Meat", "High Fat"],
    isMisleading: true,
  },
  {
    id: "fried_chicken",
    name: "Fried Chicken",
    category: "fruit_veg",
    cost: 0.85,
    co2: 0.90,
    tags: ["Fried", "Processed"],
    isMisleading: true,
  },
];

export const STUDENT_MEALS: Recipe[] = [
  {
    id: "veg-stir-fry",
    title: "Vibrant Veggie Sizzler Stir-Fry",
    time: "10 mins",
    cost: 1.55,
    costPerServing: 0.78,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600",
    category: "under2",
    tags: ["Vegetarian", "Vegan", "15 mins or less", "High Fiber"],
    ingredients: ["1 cup Brown Rice (cooked)", "1 cup Carrots (sliced)", "1 cup Broccoli (florets)", "1 cup Spinach", "1 tbsp Rapeseed Oil", "1 tbsp Soy Sauce & Garlic"],
    instructions: [
      "Prepare your brown rice in advance or use leftover brown rice.",
      "Heat the rapeseed oil in a frying pan or wok on medium-high heat.",
      "Add sliced carrots and broccoli florets. Stir vigorously for 4-5 minutes until bright but slightly crunch-tender.",
      "Toss in the fresh spinach and cook for 1 minute until wilted.",
      "Stir-in soy sauce, minced garlic, and toss with the cooked brown rice.",
      "Serve hot and appreciate the natural colors!"
    ],
    chefTips: "Toss in leftover frozen peas for a quick plant-protein boost and extra sweetness!",
    nutrition: {
      calories: 380,
      protein: "9g",
      carbs: "54g",
      fiber: "8g"
    }
  },
  {
    id: "lentil-curry",
    title: "Creamy Westminster Red Lentil Curry",
    time: "20 mins",
    cost: 1.40,
    costPerServing: 0.70,
    image: "https://rainbowplantlife.com/wp-content/uploads/2020/09/redlentilcurryflatstraight-2020update281of129-scaled.jpg",
    category: "under2",
    tags: ["Vegan", "High Protein", "Vegetarian"],
    ingredients: ["1/2 cup Red Split Lentils", "1 can Chopped Tomatoes", "1 cup Yellow Onion (diced)", "1 cup Spinach", "1 tbsp Curry Powder & Ginger", "1 tbsp Rapeseed Oil"],
    instructions: [
      "Sauté diced yellow onions in rapeseed oil in a heavy saucepan over medium heat until golden (3-4 minutes).",
      "Add curry powder and grated ginger; fry for 30 seconds until fragrant.",
      "Add thoroughly washed red lentils, chopped canned tomatoes, and 1.5 cups of water. Bring to a boil.",
      "Reduce heat, cover, and let simmer for 15-18 minutes until lentils are soft and thick.",
      "Stir in spinach during the last minute of cooking until wilted.",
      "Serve individually or alongside wholewheat flatbread."
    ],
    chefTips: "Lentils don't need pre-soaking! This makes them a lightning-fast, high-fiber pantry legend.",
    nutrition: {
      calories: 340,
      protein: "18g",
      carbs: "45g",
      fiber: "14g"
    }
  },
  {
    id: "tuna-pasta-salad",
    title: "Mediterranean High-Protein Tuna Pasta Salad",
    time: "12 mins",
    cost: 2.10,
    costPerServing: 1.05,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600",
    category: "under3",
    tags: ["High protein", "15 minutes or less", "Quick Lunch"],
    ingredients: ["1 cup Wholewheat Pasta", "1 can Canned Tuna (drained)", "1/2 cup Canned Sweetcorn", "1 cup Fresh Broccoli (small raw florets)", "1 tbsp Plain Greek Yoghurt (as dressing)", "1 tsp Olive Oil"],
    instructions: [
      "Boil the wholewheat pasta in slightly salted water according to packet instructions (about 8-10 minutes).",
      "During the last 2 minutes of pasta boiling, drop the broccoli florets in the same water to blanch them slightly.",
      "Drain pasta and broccoli, then run under cold water to cool down.",
      "In a bowl, mix drained tuna, sweetcorn, pasta, and broccoli.",
      "Combine Plain Greek Yoghurt and olive oil with a pinch of black pepper, then fold into the salad as a light, creamy, nutritious dressing.",
      "Enjoy immediately or box up for a perfect Westminster lecture lunch!"
    ],
    chefTips: "Canned salmon or chickpeas also work wonderfully in place of tuna for varying nutrient intakes.",
    nutrition: {
      calories: 420,
      protein: "26g",
      carbs: "51g",
      fiber: "7g"
    }
  },
  {
    id: "scrambled-eggs-and-beans",
    title: "The Ultimate Protein Power Breakfast-for-Dinner",
    time: "8 mins",
    cost: 1.80,
    costPerServing: 0.90,
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=600",
    category: "under2",
    tags: ["Vegetarian", "15 minutes or less", "High protein"],
    ingredients: ["2x Free Range Eggs", "1 cup Canned Kidney Beans (rinsed)", "1/2 cup Spinach", "2 slices Wholemeal Sliced Bread (toasted)", "1 tsp Olive Oil", "Pinch of cumin & black pepper"],
    instructions: [
      "In a small saucepan, warm the kidney beans with a splash of water, cumin, and black pepper until hot.",
      "In a frying pan, heat 1 tsp olive oil on low-medium. Crack the eggs in and whisk gently in the pan with spinach until softly scrambled (about 2 minutes).",
      "Toast your wholemeal bread slices.",
      "Layer the soft, iron-rich spinach-scrambled eggs and flavorful warm beans onto your toasted bread.",
      "Finish with an extra pinch of black pepper and serve immediately."
    ],
    chefTips: "Replacing canned baked beans in sugary syrup with seasoned canned kidney beans or cannellini beans cuts sugar intake drastically and saves money!",
    nutrition: {
      calories: 460,
      protein: "24g",
      carbs: "38g",
      fiber: "9g"
    }
  },
  {
    id: "one-pot-turkey-pasta",
    title: "One-Pot Rustic Turkey & Tomato Penne",
    time: "15 mins",
    cost: 3.40,
    costPerServing: 1.70,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=600",
    category: "under5",
    tags: ["High protein", "One-pot dinners"],
    ingredients: ["150g Minced Turkey or Chicken", "1 cup Wholewheat Pasta", "1 can Chopped Tomatoes", "1 cup Carrots (finely diced)", "1 cup Onion (diced)", "1 tbsp Olive Oil", "1 clove Garlic (chopped)"],
    instructions: [
      "In a deep saucepan, heat olive oil and sauté onions, garlic, and finely diced carrots on medium heat for 3 minutes.",
      "Add minced turkey, cooking until browned (about 3-4 minutes).",
      "Stir in the canned chopped tomatoes, dry wholewheat pasta, and 1.5 cups of boiling water.",
      "Cover, reduce heat, and let simmer for 10-12 minutes until pasta is tender and has absorbed most sauce, stirring occasionally to prevent sticking.",
      "Spoon out into a plate and enjoy a hearty, highly nutritious meal with minimal washing up!"
    ],
    chefTips: "One-pot cooking lets starch from the pasta thicken the tomato sauce naturally, giving it a rich texture without needing cream or excessive butter.",
    nutrition: {
      calories: 520,
      protein: "32g",
      carbs: "58g",
      fiber: "8g"
    }
  },
  {
    id: "sweet-potato-protein-boat",
    title: "Baked Sweet Potato Protein Boat",
    time: "25 mins (or 6 mins micro)",
    cost: 2.30,
    costPerServing: 1.15,
    image: "https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?auto=format&fit=crop&q=80&w=600",
    category: "under3",
    tags: ["Vegetarian", "High protein", "One-pot dinners"],
    ingredients: ["1 Large Sweet Potato", "1 cup Cottage Cheese", "1/2 cup Frozen Peas (steamed)", "2 tbsp Sunflower Seeds", "1 tsp Paprika & Chili Flakes"],
    instructions: [
      "Scrub the sweet potato and prick it several times with a fork.",
      "Microwave on high for 5-7 minutes, turning halfway, until completely soft (or bake in the oven at 200°C for 45 minutes for crispy skin).",
      "Slit the sweet potato open down the center.",
      "Mash the glowing orange inside slightly, then stuff generously with high-protein chilled cottage cheese.",
      "Top with warm steamed green peas and a crunchy scatter of roasted sunflower seeds.",
      "Dust with paprika and chili flakes for an exciting spicy bite!"
    ],
    chefTips: "Microwaving sweet potatoes is a giant energy-saver compared to running a large oven, reducing utility bills and study anxiety simultaneously!",
    nutrition: {
      calories: 410,
      protein: "21g",
      carbs: "49g",
      fiber: "10g"
    }
  }
];

export const NUTRITION_MYTHS: Myth[] = [
  {
    id: "breakfast",
    title: "Is breakfast really the most important meal of the day?",
    myth: "You must eat breakfast immediately after waking up to restart your metabolism, otherwise your body goes into 'starvation mode' and you will gain weight.",
    fact: "Scientific evidence shows that meal timing is highly individual. While a healthy breakfast rich in fiber and protein (like oats or eggs) provides sustained study focus and prevents mid-morning vending machine runs, skipping it isn't harmful if you eat well-balanced meals later. What matters is the nutrient quality of your total day, not arbitrary timers.",
    customTip: "If you aren't hungry early, don't force it. Pack a portable boiled egg and an apple for a 10:30 AM energy boost instead of grab-and-go sugary croissants."
  },
  {
    id: "carbs",
    title: "Are carbohydrates bad for you and cause weight gain?",
    myth: "Carbs are inherently fattening, and you should eliminate pasta, rice, and bread entirely to stay healthy.",
    fact: "Not all carbs are created equal! Refined sugars and white flour cause rapid glucose spikes. However, complex carbohydrates (wholewheat pasta, brown rice, oats, sweet potatoes) are loaded with fiber, B vitamins, and trace minerals. They release energy slowly, feeding your brain and skeletal muscles gradually without insulin spikes.",
    customTip: "Suckers for pasta? Simply switch from white penne to wholemeal penne. You get 3x the fiber, which feeds healthy gut gut bacteria and keeps you fuller for hours longer."
  },
  {
    id: "protein",
    title: "Do you need expensive protein powders and supplements?",
    myth: "To build muscle or stay healthy, you must consume whey protein isolates, amino-acid shakes, and specialized fitness supplements.",
    fact: "The vast majority of people—including active students—can easily exceed their daily protein requirements using whole foods. Whole plant proteins like lentils, chickpeas, and beans are incredibly cheap, contain zero ultra-processed binders, and come packed with dietary fiber and heart-healthy minerals.",
    customTip: "A simple serving of red lentils (£0.14) has 18g of complete protein accompanied by 14g of digestion-boosting fiber. Don't waste money on highly synthetic plastic tubs of chocolate powder!"
  },
  {
    id: "energy-drinks",
    title: "Are energy drinks great for long study sessions?",
    myth: "Energy drinks enhance cognitive focus, improve exam grades, and are healthy study aids.",
    fact: "Energy drinks trigger massive spikes in heart rate and blood sugar due to heavy caffeine and sweet syrups. This is followed by a brutal 'sugar crash' 1-2 hours later, causing fatigue, brain fog, and anxiety. They also severely disrupt REM sleep, which is when your brain consolidates memory and learning.",
    customTip: "Try drinking iced peppermint or green tea with a squeeze of fresh lemon, alongside a banana. It sustains alertness, hydrates brain cells, and costs 90% less."
  },
  {
    id: "rushed-eating",
    title: "Does grabbing food quickly at work not really matter, as long as you eat something?",
    myth: "As long as you eat something during a busy shift, it doesn't matter how rushed or irregular the timing is.",
    fact: "Rushed, irregular eating causes blood-glucose dips that trigger irritability and reduced concentration, and pushes people toward 'grab-and-go' ultra-processed snacks that spike energy then crash it. Long gaps followed by heavy evening eating also disrupt sleep and next-day mood.",
    customTip: "Batch-prep boxed meals with fibre and protein (e.g., lentils, eggs, wholegrains) so a fast option is also a balanced one, even on your busiest shift."
  },
  {
    id: "plant-based-strict",
    title: "Do you have to go fully vegan for a 'plant-based' diet to actually help your health?",
    myth: "Only strict vegan diets count as genuinely healthy plant-based eating — anything less doesn't make a real difference.",
    fact: "The Mediterranean diet is plant-rich (vegetables, wholegrains, legumes, nuts) but includes regular fish and olive oil, not zero animal products — and it has some of the strongest evidence for lower cardiovascular disease risk and better blood sugar control of any dietary pattern studied.",
    customTip: "Shift your plate's balance toward vegetables, wholegrains and legumes first. You don't need to eliminate every animal product to get most of the benefit."
  },
  {
    id: "individual-food-choices",
    title: "Do personal food choices even matter for the planet?",
    myth: "Climate change is driven by industry and transport — what one person or one kitchen orders doesn't move the needle.",
    fact: "Food production accounts for roughly 30% of global greenhouse gas emissions. Purchasing decisions ripple through the entire supply chain (Scope 3 emissions), meaning menu and procurement choices in a single catering operation have a measurable, trackable environmental footprint.",
    customTip: "Track food-waste kg per cover and swap in more pulses, wholegrains and seasonal veg — small kitchen-level shifts add up across every meal served."
  },
  {
    id: "upf-portion-control",
    title: "Is it fine to eat ultra-processed food often, as long as portions are controlled?",
    myth: "Ultra-processed foods are okay in any quantity, as long as you watch your portion sizes.",
    fact: "Over 57% of adult daily energy intake in the UK already comes from ultra-processed foods, and higher UPF intake is linked to higher BMI and greater risk of obesity, cardiovascular disease, and death — independent of simple calorie counting or portion size.",
    customTip: "Prioritise swapping one ultra-processed item a day for a whole-food equivalent (e.g., porridge oats instead of sugary cereal) rather than just shrinking portions of the same food."
  },
  {
    id: "allergy-vs-intolerance",
    title: "Are food allergies and food intolerances basically the same thing?",
    myth: "Allergies and intolerances are just different words for the same reaction to food.",
    fact: "A food allergy is an immune-mediated reaction (IgE or non-IgE) that can range from hives to life-threatening anaphylaxis. A food intolerance is usually caused by an enzyme deficiency (like lactase for dairy) and, while uncomfortable, is not immune-related and not life-threatening in the same way.",
    customTip: "If a customer mentions a reaction to food, ask which type they mean — the safety protocol (strict avoidance and cross-contact control) is far stricter for a true allergy than for an intolerance."
  },
  {
    id: "flavor-needs-salt-sugar",
    title: "Do you need lots of salt and sugar to make food taste good?",
    myth: "Cutting back on salt and sugar in cooking automatically means sacrificing flavour.",
    fact: "Professional kitchens can build big flavour using acids, herbs, umami-rich ingredients, spices, and citrus and aromatics instead of relying on salt and sugar — this is a standard technique for hitting national salt-reduction targets without customers noticing a difference.",
    customTip: "Next time a dish tastes flat, reach for a squeeze of lemon or a splash of vinegar before reaching for the salt shaker — acid often fixes what salt is being used to mask."
  },
  {
    id: "public-catering-rules",
    title: "Do schools, hospitals, and prisons just leave nutrition up to the chef's judgement?",
    myth: "Public sector kitchens can serve whatever menu the chef thinks is best — nutrition rules are just guidelines.",
    fact: "Statutory School Food Standards, NHS National Standards, and the Food in Prisons Policy Framework are legal requirements, not suggestions — with board-level accountability, compliance monitoring (e.g., by HMIP), and specific limits on fried food, salt, and sugary drinks.",
    customTip: "If you're catering in a public-sector setting, check the specific statutory standard for that sector first — the baseline isn't optional, even if house-style creativity is welcome on top of it."
  },
  {
    id: "healthy-costs-more",
    title: "Does eating healthy always cost more than eating unhealthy?",
    myth: "A nutritious diet is inherently more expensive than a typical unhealthy one, so healthy eating is a luxury.",
    fact: "Cheap plant proteins like pulses, wholegrains, and seasonal vegetables are among the most affordable ingredients available, and swapping animal protein for a source like lentils can cut both cost and carbon footprint at the same time.",
    customTip: "Build a meal around a base of pulses or wholegrains first, then add smaller amounts of pricier protein — it's often cheaper than a protein-heavy plate and just as filling."
  },
  {
    id: "local-always-greener",
    title: "Is locally grown, seasonal food always the most environmentally friendly choice?",
    myth: "If food is grown locally and in season, it's automatically the lowest-impact option available.",
    fact: "Production method and energy use often dominate the footprint more than distance travelled — winter tomatoes grown in a heated glasshouse can have a bigger carbon footprint than tomatoes trucked in from the sunny Mediterranean. Air-freighted produce is usually the worst option regardless of how far it travelled.",
    customTip: "Before assuming 'local' means 'low-impact', ask how the food was grown — a heated greenhouse or long cold storage can outweigh the benefit of a shorter delivery distance."
  },
  {
    id: "cravings-willpower",
    title: "Are food cravings just a sign of weak willpower?",
    myth: "If you can't resist junk food cravings, it simply means you lack self-control.",
    fact: "Ultra-processed foods are engineered to be 'hyper-palatable', triggering the brain's dopamine reward system so strongly that repetition creates genuine habit loops — this is a designed biological response, not a personal character flaw.",
    customTip: "Break the loop by changing the cue, not just relying on willpower: keep tempting items out of sight, and plan regular fibre-and-protein meals so cravings have less room to take hold."
  },
  {
    id: "weight-only-marker",
    title: "If you're not overweight, does your diet quality even matter?",
    myth: "As long as your weight is in a healthy range, what you actually eat doesn't matter much.",
    fact: "Diet quality affects disease risk, mood, and cognitive performance independent of body weight — a person at a healthy weight can still have high salt intake, low fibre, and nutrient gaps that raise long-term health risks.",
    customTip: "Judge a plate by what's on it — vegetables, wholegrains, protein variety — rather than assuming a person's weight tells you anything about their nutrient intake."
  },
  {
    id: "fat-same-calories",
    title: "Do fats have the same amount of calories as carbs and protein?",
    myth: "A gram of fat, a gram of carbohydrate, and a gram of protein all provide roughly the same energy.",
    fact: "Fat provides about 9 kcal per gram, more than double the roughly 4 kcal per gram provided by carbohydrates or protein — meaning fat-heavy dishes carry far more energy density per bite than their carb or protein counterparts.",
    customTip: "When portioning a dish high in oils, cheese, or fatty cuts, remember it's more calorie-dense gram-for-gram than the veg or grains next to it on the plate."
  },
  {
    id: "diet-vs-medicine",
    title: "Once you're diagnosed with a health condition, does diet take a back seat to medication?",
    myth: "Medication is what actually treats a health condition — diet is just a nice-to-have on the side.",
    fact: "'Food as medicine' approaches are used directly alongside medication and care plans — for example, reducing salt for hypertension, changing fat sources for cholesterol management, or a dietitian-guided low-FODMAP diet for IBS — because consistent dietary change produces measurable clinical results.",
    customTip: "Menus for people managing a health condition need standardisation and consistency, not sporadic 'healthy specials' — the benefit comes from sustained exposure over time."
  },
  {
    id: "one-sustainable-diet",
    title: "Is there one single 'correct' sustainable diet everyone should be following?",
    myth: "There's one official sustainable diet model, and any other approach is doing it wrong.",
    fact: "Multiple credible models exist — the EAT-Lancet Planetary Health Diet, the UK Eatwell Guide, WWF Livewell, the Mediterranean diet, and plant-forward eating — and while their specifics differ, they share the same core principles: plant-rich plates, wholegrains and pulses, healthy fats, and fewer processed or red meats.",
    customTip: "Don't chase a single 'perfect' diet label — apply the shared principles (more plants, more wholegrains, less processed meat) to whichever model fits your kitchen and customers best."
  },
  {
    id: "supplements-vs-food",
    title: "Do fish oil supplements work just as well as eating fish?",
    myth: "Taking an omega-3 supplement gives you the same benefit as eating oily fish.",
    fact: "A food-first approach matters because whole foods provide the full 'food matrix' — fibre and protective compounds that isolated supplements typically lack — and absorption depends on that matrix, gut health, and meal composition, not just the presence of the isolated nutrient.",
    customTip: "Where possible, build omega-3s in through actual oily fish (salmon, mackerel, sardines) or plant sources like walnuts and flaxseed, rather than defaulting straight to a supplement."
  },
  {
    id: "plant-milk-always-better",
    title: "Are plant-based dairy alternatives always healthier and greener than dairy?",
    myth: "Any plant-based milk or cheese alternative is automatically a healthier and more sustainable choice than the dairy version.",
    fact: "Some plant-based dairy alternatives contain significant amounts of refined oil and are heavily processed — meaning 'plant-based' doesn't automatically mean minimally processed or genuinely lower-impact. This is a common greenwashing trap.",
    customTip: "Check the ingredients list on plant-based alternatives the same way you'd check any processed product — 'plant-based' is not a stand-in for 'healthy' or 'clean label'."
  },
  {
    id: "mood-not-food",
    title: "Is mental wellbeing unrelated to what you eat?",
    myth: "Mood and mental health are 'all in your head' and have nothing to do with diet.",
    fact: "The brain needs steady glucose to function well, and key nutrients — omega-3s, B vitamins, iron, zinc, and fibre that feeds the gut microbiome — are directly linked to brain chemistry and mood. Mediterranean-style eating patterns are associated with better mood, while high ultra-processed intake is linked to lower mood.",
    customTip: "Diet supports mental health but doesn't replace mental health care — think of steady meals and key nutrients as one part of a bigger wellbeing picture, not a stand-alone fix."
  },
  {
    id: "fibre-veg-already-enough",
    title: "Do most people already get enough fibre and vegetables in their diet?",
    myth: "Most adults are already hitting their fibre and vegetable targets without really trying.",
    fact: "96% of UK adults fail to meet the 30g/day fibre target, with average intakes closer to 18–19g/day, and only around 31% of adults meet the '5-a-day' fruit and vegetable recommendation.",
    customTip: "Add one extra source of fibre per meal — beans in a soup, oats at breakfast, or an extra veg side — rather than trying to overhaul a whole day's meals at once."
  },
  {
    id: "bigger-portions-better-value",
    title: "Do bigger portions always mean better value and happier customers?",
    myth: "Serving larger portions is a simple way to make customers feel they're getting good value.",
    fact: "The 'portion-size effect' is well documented: people eat more simply because they're served more, contributing to overconsumption regardless of hunger. Right-sizing portions quietly supports healthier eating without customers even noticing — sometimes called a 'health by stealth' approach.",
    customTip: "If you want to boost perceived value without oversized portions, focus on plate presentation and flavour-forward descriptions instead of simply piling on more food."
  },
  {
    id: "meat-footprint-transport",
    title: "Is the environmental impact of meat mostly about how far it travelled?",
    myth: "A meat dish's carbon footprint comes mainly from transport and food miles.",
    fact: "On-farm production and land-use change together account for the large majority of food's greenhouse gas emissions — far more than the post-farm supply chain of processing, packaging, and transport combined.",
    customTip: "If you want to lower a dish's footprint, changing the protein source (e.g., more pulses, less red meat) matters far more than sourcing the same meat from a nearer supplier."
  }
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: "challenge-1",
    week: 1,
    title: "Cook One Meal from Scratch",
    description: "Instead of a ready-meal or microwave packet, prepare a simple recipe using fresh, single ingredients.",
    points: 100,
    completed: false,
    targetCount: 1,
    currentCount: 0,
    badgeId: "kitchen-confidence"
  },
  {
    id: "challenge-2",
    week: 2,
    title: "Eat Five Different Vegetables",
    description: "Boost your micronutrients and fiber. Can be frozen, fresh, or canned (peas, carrots, spinach, tomatoes, broccoli, onions).",
    points: 150,
    completed: false,
    targetCount: 5,
    currentCount: 0,
    badgeId: "healthy-plate"
  },
  {
    id: "challenge-3",
    week: 3,
    title: "Replace One Takeaway",
    description: "Save £6-10 and cut ultra-processed fats by preparing a fast 'fakeaway' (like a vegetable stir-fry or curry) instead of ordering online.",
    points: 200,
    completed: false,
    targetCount: 1,
    currentCount: 0,
    badgeId: "budget-hero"
  },
  {
    id: "challenge-4",
    week: 4,
    title: "Cook for Family or Friends",
    description: "Spread Culinary Medicine wisdom! Prepare a balanced, zero-waste meal for housemates, friends, or family.",
    points: 250,
    completed: false,
    targetCount: 1,
    currentCount: 0,
    badgeId: "food-waste"
  }
];

export const BADGES: Badge[] = [
  {
    id: "kitchen-confidence",
    name: "Kitchen Confidence",
    description: "Earned by mastering a complete from-scratch meal in Week 1.",
    icon: "🍳",
    color: "bg-amber-100 text-amber-800 border-amber-300",
    unlocked: false
  },
  {
    id: "healthy-plate",
    name: "Healthy Plate Champion",
    description: "Earned by adding a rainbow of five different vegetables in Week 2.",
    icon: "🥗",
    color: "bg-emerald-100 text-emerald-800 border-emerald-300",
    unlocked: false
  },
  {
    id: "budget-hero",
    name: "Budget Hero",
    description: "Earned by opting to cook at home and saving over takeaway in Week 3.",
    icon: "💰",
    color: "bg-blue-100 text-blue-800 border-blue-300",
    unlocked: false
  },
  {
    id: "food-waste",
    name: "Food Waste Warrior",
    description: "Earned by hosting a shared zero-waste meal with loved ones in Week 4.",
    icon: "🌎",
    color: "bg-red-100 text-red-800 border-red-300",
    unlocked: false
  }
];

export const WESTMINSTER_COURSES: WestminsterCourse[] = [
  {
    id: "westminster-1",
    level: "skills",
    title: "Saturday Kitchen Club",
    duration: "4 weeks (Saturdays)",
    description: "Gain fundamental professional culinary skills in state-of-the-art Westminster commercial training kitchens guided by expert chefs.",
    outcome: "Boosts immediate cooking confidence, knives skills, and prepares for hospitality entrance.",
    link: "https://culinarymedicineuk.org/education/"
  },
  {
    id: "westminster-2",
    level: "skills",
    title: "Essential Baking Skills",
    duration: "3 weeks",
    description: "Learn professional bakery and pastry techniques, understanding starch gluten biochemistry and high-fiber alternatives.",
    outcome: "Specialist certificate in foundational baking.",
    link: "https://culinarymedicineuk.org/"
  },
  {
    id: "westminster-3",
    level: "skills",
    title: "Bar Skills & Wine Pairing",
    duration: "2 weeks",
    description: "A fast, immersive introducing to mixology, professional barista skills, service ethics, and healthy botanical ingredients.",
    outcome: "Direct employment ready for premium bars & hotels.",
    link: "https://culinarymedicineuk.org/"
  },
  {
    id: "westminster-4",
    level: "employment",
    title: "Catering Assistant Programme",
    duration: "6 weeks + Placement",
    description: "Structured fast-track skill development including Food Safety Level 2, commercial prep workflows, and culinary operation routines.",
    outcome: "Direct interview placements with contract caterers around London (NHS, corporations, education).",
    link: "https://culinarymedicineuk.org/"
  },
  {
    id: "westminster-5",
    level: "employment",
    title: "Hospitality Skills Academy",
    duration: "Flexible (Part-Time)",
    description: "Comprehensive front and back-of-house training combined with digital workforce skills and interview prep designed for Westminster students.",
    outcome: "Guaranteed interviews with premium industry partners.",
    link: "https://culinarymedicineuk.org/"
  }
];
