import { Building2, Home, Dumbbell, BookOpen, UtensilsCrossed, Coffee, type LucideIcon } from "lucide-react";

export type CategoryKey = "hostel" | "pg" | "gym" | "library" | "mess" | "cafe";

export const CATEGORIES: Record<CategoryKey, {
  label: string;
  icon: LucideIcon;
  color: string; // hex for map pins
  tw: string;    // tailwind text class
}> = {
  hostel: { label: "Hostels", icon: Building2, color: "#3b82f6", tw: "text-blue-400" },
  pg:     { label: "PGs",     icon: Home,      color: "#6366f1", tw: "text-indigo-400" },
  gym:    { label: "Gyms",    icon: Dumbbell,  color: "#22c55e", tw: "text-green-400" },
  library:{ label: "Libraries", icon: BookOpen, color: "#a855f7", tw: "text-purple-400" },
  mess:   { label: "Mess",    icon: UtensilsCrossed, color: "#f97316", tw: "text-orange-400" },
  cafe:   { label: "Cafes",   icon: Coffee,    color: "#eab308", tw: "text-yellow-400" },
};

export const CATEGORY_KEYS = Object.keys(CATEGORIES) as CategoryKey[];