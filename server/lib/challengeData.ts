// Server-side source of truth. Never trust client-supplied challenge data.

export interface ServerChallenge {
  id: string;
  week: number;
  title: string;
  badgeId: string;
  points: number;
}

export interface ServerBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  accentColor: string;
}

export const SERVER_CHALLENGES: ServerChallenge[] = [
  { id: "challenge-1", week: 1, title: "Cook One Meal from Scratch",     badgeId: "kitchen-confidence", points: 100 },
  { id: "challenge-2", week: 2, title: "Eat Five Different Vegetables",  badgeId: "healthy-plate",      points: 150 },
  { id: "challenge-3", week: 3, title: "Replace One Takeaway",           badgeId: "budget-hero",        points: 200 },
  { id: "challenge-4", week: 4, title: "Cook for Family or Friends",     badgeId: "food-waste",         points: 250 },
];

export const SERVER_BADGES: ServerBadge[] = [
  { id: "kitchen-confidence", name: "Kitchen Confidence",     description: "Earned by mastering a complete from-scratch meal in Week 1.", icon: "🍳", accentColor: "#D97706" },
  { id: "healthy-plate",      name: "Healthy Plate Champion", description: "Earned by adding a rainbow of five different vegetables in Week 2.", icon: "🥗", accentColor: "#059669" },
  { id: "budget-hero",        name: "Budget Hero",            description: "Earned by opting to cook at home and saving over takeaway in Week 3.", icon: "💰", accentColor: "#2563EB" },
  { id: "food-waste",         name: "Food Waste Warrior",     description: "Earned by hosting a shared zero-waste meal with loved ones in Week 4.", icon: "🌎", accentColor: "#DC2626" },
];

export function getChallenge(id: string): ServerChallenge | null {
  return SERVER_CHALLENGES.find((c) => c.id === id) ?? null;
}

export function getBadge(id: string): ServerBadge | null {
  return SERVER_BADGES.find((b) => b.id === id) ?? null;
}

export function getBadgesRemaining(userPoints: number, completedCount: number): number {
  return Math.max(0, SERVER_BADGES.length - completedCount);
}
