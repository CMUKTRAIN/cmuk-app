export type Category = "fruit_veg" | "wholegrain" | "protein" | "dairy" | "fats";
export interface Ingredient {
  id: string;
  name: string;
  category: Category;
  cost: number; // in GBP
  co2: number; // in kg CO2 per serving
  tags: string[];
  isMisleading?: boolean; // true = deceptively tagged/labeled; excluded from legitimate scoring tallies
  swaps?: {
    with: string;
    benefit: string;
    savings: number;
    co2Savings: number;
  };
}
export interface Recipe {
  id: string;
  title: string;
  time: string;
  cost: number; // to show total cost
  costPerServing: number;
  image: string;
  category: "under2" | "under3" | "under5";
  tags: string[];
  ingredients: string[];
  instructions: string[];
  chefTips?: string;
  nutrition: {
    calories: number;
    protein: string;
    carbs: string;
    fiber: string;
  };
}
export interface Myth {
  id: string;
  title: string;
  myth: string;
  fact: string;
  customTip: string;
}
export interface Challenge {
  id: string;
  week: number;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  targetCount: number;
  currentCount: number;
  badgeId: string;
}
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
}
export interface WestminsterCourse {
  id: string;
  level: "skills" | "employment";
  title: string;
  duration: string;
  description: string;
  outcome: string;
  link: string;
}
export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}
