import {
  GlassWater,
  Martini,
  Coffee,
  Pizza,
  UtensilsCrossed,
  Grape,
  IceCream,
  Bed as Pillow,
  Headphones,
  Eye,
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
  Wine,
  Glass,
  Cocktail,
  Dosa,
  Bhature,
  Biryani,
  Paneer,
  Hamburger,
  Ham,
  Drumstick,
  Soup,
  CakeSlice,
  Donut,
  Dessert,
  Cherry,
  Armchair,
} from "../components/icons.jsx";

// MOCK DATA
export const mockPassenger = {
  name: "Amelia Harper",
  seat: "23A",
};

export const mockCrew = {
  name: "Emily Turner",
  role: "Lead Flight Attendant",
};

export const initialRequests = [
  {
    id: 1,
    title: "Medical Assistance",
    category: "Medical",
    passengerName: "John Doe",
    seat: "15B",
    status: "New",
    priority: "Urgent",
    timestamp: "10:32 AM",
    details: "Passenger reports feeling faint and dizzy.",
    items: ["Medical Kit", "Water"],
    chat: [
      {
        sender: "John Doe",
        message: "I feel very light-headed.",
        timestamp: "10:32 AM",
      },
    ],
  },
  {
    id: 2,
    title: "Security Concern",
    category: "Security",
    passengerName: "Jane Smith",
    seat: "9C",
    status: "In Progress",
    priority: "High",
    timestamp: "10:35 AM",
    details: "Unattended bag in the overhead compartment.",
    items: ["Security Check"],
    chat: [],
  },
  {
    id: 3,
    title: "Pillow & Blanket",
    category: "Comfort",
    passengerName: "Peter Jones",
    seat: "21F",
    status: "Acknowledged",
    priority: "Medium",
    timestamp: "10:38 AM",
    details: "Request for a pillow and blanket.",
    items: ["Pillow & Blanket"],
    chat: [
      {
        sender: "Peter Jones",
        message: "Can I get a pillow and blanket please?",
        timestamp: "10:38 AM",
      },
    ],
  },
  {
    id: 4,
    title: "Cookie",
    category: "Snacks",
    passengerName: "Susan Miller",
    seat: "12A",
    status: "Resolved",
    priority: "Low",
    timestamp: "10:25 AM",
    details: "Cookie snack request.",
    items: ["Cookie"],
    chat: [],
  },
  {
    id: 5,
    title: "Apple Juice",
    category: "Drinks",
    passengerName: "Mike Brown",
    seat: "30D",
    status: "New",
    priority: "Low",
    timestamp: "10:40 AM",
    details: "Apple Juice request.",
    items: ["Apple Juice"],
    chat: [],
  },
];

export const serviceCategories = {
  Drinks: [
    { name: "Sodas", icon: Droplets },
    { name: "Apple Juice", icon: Glass },
    { name: "Orange Juice", icon: Cocktail },
    { name: "Water", icon: GlassWater },
    { name: "Coffee", icon: CoffeeIcon },
    { name: "Tea", icon: CoffeeIcon },
    { name: "Beer", icon: Beer },
    { name: "Wine", icon: Wine },
  ],
  Snacks: [
    { name: "Pizza", icon: Pizza },
    { name: "Cookie", icon: Cookie },
    { name: "Sandwich", icon: Sandwich },
    { name: "Burger", icon: Hamburger },
    { name: "Ham", icon: Ham },
    { name: "Drumstick", icon: Drumstick },
    { name: "Soup", icon: Soup },
    { name: "Rice", icon: Circle },
  ],
  Fruits: [
    { name: "Apple", icon: Apple },
    { name: "Banana", icon: Banana },
    { name: "Grapes", icon: Grape },
    { name: "Cherry", icon: Cherry },
  ],
  Desserts: [
    { name: "Cake Slice", icon: CakeSlice },
    { name: "Ice Cream Bowl", icon: IceCream },
    { name: "Donut", icon: Donut },
    { name: "Dessert", icon: Dessert },
  ],
  Comfort: [
    { name: "Pillow & Blanket", icon: Armchair },
    { name: "Headphones", icon: Headphones },
    { name: "Eye Mask", icon: Eye },
  ],
};

// --- GEMINI API HELPER ---
export const callGeminiAPI = async (payload, retries = 3, delay = 1000) => {
  const apiKey = ""; // IMPORTANT: Add your Gemini API key here.
  if (!apiKey) {
    console.warn("Gemini API key is missing.");
    return "AI features are currently disabled. An API key is required.";
  }
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        console.error("API Error:", errorBody);
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) {
        return text;
      } else {
        console.error("Invalid response structure from API:", result);
        throw new Error("Invalid response structure from API.");
      }
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) {
        return "Sorry, I'm having trouble connecting to my brain right now. Please try again later.";
      }
      await new Promise((res) => setTimeout(res, delay * Math.pow(2, i)));
    }
  }
};
