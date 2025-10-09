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
} from "lucide-react";

// Custom Food Icons
const Hamburger = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 8h14a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2zm0 4h14a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2zm0 4h14a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2z" />
    <circle cx="12" cy="10" r="3" />
    <path d="M8 16h8v2H8z" />
  </svg>
);

const Ham = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <ellipse cx="12" cy="12" rx="8" ry="5" />
    <path d="M16 8l-2 4 2 4 2-4z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const Drumstick = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 6l4 4-4 4-2-2 2-2z" />
    <path d="M14 8l6 6-2 2-6-6z" />
    <circle cx="6" cy="18" r="2" />
  </svg>
);

const Soup = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    <path d="M10 8c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z" />
  </svg>
);

const iconMap = {
  Snacks: Utensils,
  Drinks: Wine,
  Comfort: Bed,
  "Wi-Fi": Wifi,
  "In-flight Entertainment": Headphones,
  Newspaper: Newspaper,
  "Medical Assistance": LifeBuoy,
  "AI Concierge": Sparkles,
  "Service Request": MessageSquare,
  // New category mappings
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
  // Custom Food Icons
  Hamburger,
  Ham,
  Drumstick,
  Soup,
};
