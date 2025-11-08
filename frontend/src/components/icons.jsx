import React from "react";
import {
  PlaneTakeoff,
  PlaneLanding,
  User,
  LogIn,
  LogOut,
  ChevronDown,
  ChevronLeft,
  MessageSquare,
  Bell,
  LifeBuoy,
  Shield,
  Sparkles,
  Bot,
  Send,
  X,
  GripVertical,
  AlertTriangle,
  CheckCircle,
  Clock,
  Info,
  Coffee,
  Bed,
  Headphones,
  Newspaper,
  Utensils,
  Wifi,
  Wine,
  HelpCircle,
  GlassWater,
  Martini,
  Pizza,
  UtensilsCrossed,
  Grape,
  IceCream,
  Eye,
  Heart,
  Cross,
  Apple,
  Banana,
  Cookie,
  CircleDot,
  Triangle,
  Bean,
  Sandwich,
  Droplets,
  Beer,
  Coffee as CoffeeIcon,
  Circle,
  CakeSlice,
  Donut,
  Dessert,
  Beef,
  Salad,
  Drumstick as LucideDrumstick,
  Cherry,
  Armchair,
  Star,
} from "lucide-react";

// Custom Food Icons (keeping Soup, Ham, and Hamburger as custom since lucide doesn't have them)
const Hamburger = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 8h18a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2zm0 4h18a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2zm0 4h18a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2z" />
    <circle cx="12" cy="10" r="2" />
    <circle cx="12" cy="14" r="2" />
  </svg>
);

const Ham = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <ellipse cx="12" cy="12" rx="8" ry="5" />
    <path d="M16 8l-2 4 2 4 2-4z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const Soup = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M6 10c0-2 1.5-4 4-4s4 2 4 4v8c0 2-1.5 4-4 4s-4-2-4-4v-8z" />
    <path d="M10 6v-2a2 2 0 0 1 4 0v2" />
    <path d="M8 12h8" />
    <path d="M9 16h6" />
  </svg>
);

const iconMap = {
  // Service Categories
  Snacks: Utensils,
  Drinks: Wine,
  Comfort: Bed,
  Fruits: Apple,
  Desserts: IceCream,
  // Request Categories
  Medical: LifeBuoy,
  Security: Shield,
  // Legacy mappings
  "Wi-Fi": Wifi,
  "In-flight Entertainment": Headphones,
  Newspaper: Newspaper,
  "Medical Assistance": LifeBuoy,
  "AI Concierge": Sparkles,
  "Service Request": MessageSquare,
  // Old mappings for compatibility
  drink: Wine,
  food: Utensils,
  comfort: Bed,
  medical: LifeBuoy,
  security: Shield,
  general: HelpCircle,
  default: HelpCircle,
};

export const getIconForCategory = (category) => {
  return iconMap[category] || iconMap.default;
};

export {
  PlaneTakeoff,
  PlaneLanding,
  User,
  LogIn,
  LogOut,
  ChevronDown,
  ChevronLeft,
  MessageSquare,
  Bell,
  LifeBuoy,
  Shield,
  Sparkles,
  Bot,
  Send,
  X,
  GripVertical,
  AlertTriangle,
  CheckCircle,
  Clock,
  Info,
  Coffee,
  Bed,
  Headphones,
  Newspaper,
  Utensils,
  Wifi,
  Wine,
  GlassWater,
  Martini,
  Pizza,
  UtensilsCrossed,
  Grape,
  IceCream,
  Eye,
  Heart,
  Cross,
  Apple,
  Banana,
  Cookie,
  CircleDot,
  Triangle,
  Bean,
  Sandwich,
  Droplets,
  Beer,
  CoffeeIcon,
  Circle,
  // Main Course Icons
  GlassWater as Glass,
  Martini as Cocktail,
  UtensilsCrossed as Dosa,
  CircleDot as Bhature,
  Pizza as Biryani,
  Cookie as Paneer,
  // Custom Food Icons
  Hamburger,
  Ham,
  LucideDrumstick as Drumstick,
  Soup,
  // Dessert Icons
  CakeSlice,
  Donut,
  Dessert,
  // Fruit Icons
  Cherry,
  // Comfort Icons
  Armchair,
  // Feedback Icons
  Star,
};
