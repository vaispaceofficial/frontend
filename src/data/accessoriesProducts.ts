export interface AccessoryCategory {
  name: string;
  slug: string;
}

export interface AccessoryProduct {
  id: number;
  name: string;
  category: string;
  categorySlug: string;

  price: number;
  oldPrice: number;

  image: string;
  images: string[];

  rating: number;
  reviews: number;

  badge: string;

  description: string;

  highlights: string[];

  specifications: {
    label: string;
    value: string;
  }[];

  inStock: boolean;
}

export const accessoryCategories: AccessoryCategory[] = [
  {
    name: "All Products",
    slug: "all",
  },
  {
    name: "AC Accessories",
    slug: "ac-accessories",
  },
  {
    name: "Washing Machine Accessories",
    slug: "washing-machine-accessories",
  },
  {
    name: "Refrigerator Accessories",
    slug: "refrigerator-accessories",
  },
  {
    name: "TV Accessories",
    slug: "tv-accessories",
  },
  {
    name: "Kitchen Appliances",
    slug: "kitchen-appliances",
  },
  {
    name: "Electrical Accessories",
    slug: "electrical-accessories",
  },
  {
    name: "Other Accessories",
    slug: "other-accessories",
  },
];

export const accessoryProducts: AccessoryProduct[] = [
  {
    id: 1,

    name: "Universal AC Remote",

    category: "AC Accessories",

    categorySlug: "ac-accessories",

    price: 499,

    oldPrice: 699,

    image: "📱",

    images: [
      "📱",
      "❄️",
      "🔘",
      "📡",
      "🛠️",
    ],

    rating: 4.4,

    reviews: 128,

    badge: "Popular",

    description:
      "A reliable universal AC remote designed for convenient everyday control. The remote features a clean button layout, easy-to-read controls and broad compatibility with supported air conditioner models.",

    highlights: [
      "Universal compatibility with supported AC models",
      "Easy-to-use button layout",
      "Clear and responsive controls",
      "Compact and lightweight design",
      "Suitable for everyday home use",
      "Simple replacement for a lost or damaged remote",
    ],

    specifications: [
      {
        label: "Product Type",
        value: "Universal AC Remote",
      },
      {
        label: "Compatibility",
        value: "Compatible AC models",
      },
      {
        label: "Control Type",
        value: "Infrared Remote",
      },
      {
        label: "Usage",
        value: "Home / Office",
      },
      {
        label: "Battery",
        value: "Requires compatible batteries",
      },
      {
        label: "Colour",
        value: "White",
      },
    ],

    inStock: true,
  },

  {
    id: 2,

    name: "AC Dust Filter",

    category: "AC Accessories",

    categorySlug: "ac-accessories",

    price: 349,

    oldPrice: 499,

    image: "❄️",

    images: [
      "❄️",
      "🌬️",
      "🧹",
      "✨",
      "🛠️",
    ],

    rating: 4.2,

    reviews: 84,

    badge: "New",

    description:
      "Replacement AC dust filter designed to help maintain cleaner airflow and support regular air conditioner maintenance.",

    highlights: [
      "Designed for regular AC maintenance",
      "Helps reduce dust accumulation",
      "Easy to clean and maintain",
      "Lightweight replacement design",
      "Suitable for regular replacement",
      "Helps maintain cleaner airflow",
    ],

    specifications: [
      {
        label: "Product Type",
        value: "AC Dust Filter",
      },
      {
        label: "Material",
        value: "Filter Mesh",
      },
      {
        label: "Usage",
        value: "Air Conditioner",
      },
      {
        label: "Maintenance",
        value: "Washable / Cleanable",
      },
      {
        label: "Installation",
        value: "Easy replacement",
      },
    ],

    inStock: true,
  },

  {
    id: 3,

    name: "Washing Machine Cover",

    category: "Washing Machine Accessories",

    categorySlug: "washing-machine-accessories",

    price: 599,

    oldPrice: 799,

    image: "🫧",

    images: [
      "🫧",
      "🧺",
      "💧",
      "🏠",
      "✨",
    ],

    rating: 4.5,

    reviews: 96,

    badge: "Popular",

    description:
      "Protective washing machine cover designed to help protect your appliance from dust, moisture and everyday environmental exposure.",

    highlights: [
      "Helps protect against dust",
      "Helps protect the appliance surface",
      "Easy to put on and remove",
      "Suitable for everyday household use",
      "Lightweight and convenient",
      "Easy to maintain",
    ],

    specifications: [
      {
        label: "Product Type",
        value: "Washing Machine Cover",
      },
      {
        label: "Material",
        value: "Protective Fabric",
      },
      {
        label: "Usage",
        value: "Washing Machine",
      },
      {
        label: "Design",
        value: "Full Cover",
      },
      {
        label: "Maintenance",
        value: "Easy Clean",
      },
    ],

    inStock: true,
  },

  {
    id: 4,

    name: "Universal TV Remote",

    category: "TV Accessories",

    categorySlug: "tv-accessories",

    price: 299,

    oldPrice: 399,

    image: "📺",

    images: [
      "📺",
      "🔘",
      "🎛️",
      "📡",
      "🛠️",
    ],

    rating: 4.1,

    reviews: 62,

    badge: "",

    description:
      "Universal replacement TV remote designed for convenient everyday television control with an easy-to-use button arrangement.",

    highlights: [
      "Universal replacement remote",
      "Simple button layout",
      "Easy everyday operation",
      "Compact design",
      "Suitable as a replacement remote",
      "Easy to handle",
    ],

    specifications: [
      {
        label: "Product Type",
        value: "Universal TV Remote",
      },
      {
        label: "Control Type",
        value: "Infrared",
      },
      {
        label: "Usage",
        value: "Television",
      },
      {
        label: "Design",
        value: "Compact",
      },
      {
        label: "Battery",
        value: "Requires compatible batteries",
      },
    ],

    inStock: true,
  },

  {
    id: 5,

    name: "Refrigerator Mat",

    category: "Refrigerator Accessories",

    categorySlug: "refrigerator-accessories",

    price: 399,

    oldPrice: 549,

    image: "🧊",

    images: [
      "🧊",
      "🥶",
      "✨",
      "🏠",
      "🧽",
    ],

    rating: 4.3,

    reviews: 71,

    badge: "New",

    description:
      "Easy-to-clean refrigerator mat designed to help keep refrigerator shelves protected, clean and organized.",

    highlights: [
      "Helps protect refrigerator shelves",
      "Easy to clean",
      "Helps organize shelf space",
      "Lightweight design",
      "Suitable for everyday use",
      "Simple to install and remove",
    ],

    specifications: [
      {
        label: "Product Type",
        value: "Refrigerator Mat",
      },
      {
        label: "Material",
        value: "Protective Mat",
      },
      {
        label: "Usage",
        value: "Refrigerator Shelf",
      },
      {
        label: "Maintenance",
        value: "Easy Clean",
      },
    ],

    inStock: true,
  },

  {
    id: 6,

    name: "HDMI Cable",

    category: "Electrical Accessories",

    categorySlug: "electrical-accessories",

    price: 449,

    oldPrice: 599,

    image: "🔌",

    images: [
      "🔌",
      "📺",
      "💻",
      "🎮",
      "🔗",
    ],

    rating: 4.6,

    reviews: 143,

    badge: "",

    description:
      "High-quality HDMI cable suitable for connecting compatible televisions, monitors, laptops, streaming devices and other equipment.",

    highlights: [
      "Suitable for compatible HDMI devices",
      "Useful for TV and monitor connections",
      "Flexible cable design",
      "Suitable for home entertainment setups",
      "Easy plug-and-use connection",
      "Designed for everyday use",
    ],

    specifications: [
      {
        label: "Product Type",
        value: "HDMI Cable",
      },
      {
        label: "Connector",
        value: "HDMI",
      },
      {
        label: "Usage",
        value: "TV / Monitor / Laptop",
      },
      {
        label: "Cable Type",
        value: "Digital HDMI",
      },
    ],

    inStock: true,
  },

  {
    id: 7,

    name: "AC Installation Stand",

    category: "AC Accessories",

    categorySlug: "ac-accessories",

    price: 899,

    oldPrice: 1199,

    image: "🛠️",

    images: [
      "🛠️",
      "❄️",
      "🏠",
      "🔩",
      "📐",
    ],

    rating: 4.5,

    reviews: 54,

    badge: "Popular",

    description:
      "Strong and durable AC installation stand designed to provide stable support for compatible outdoor AC units.",

    highlights: [
      "Designed for AC outdoor unit support",
      "Strong support structure",
      "Suitable for compatible installations",
      "Designed for stability",
      "Useful for residential installation",
      "Professional installation recommended",
    ],

    specifications: [
      {
        label: "Product Type",
        value: "AC Installation Stand",
      },
      {
        label: "Usage",
        value: "Outdoor AC Unit",
      },
      {
        label: "Material",
        value: "Metal",
      },
      {
        label: "Installation",
        value: "Professional installation recommended",
      },
    ],

    inStock: true,
  },

  {
    id: 8,

    name: "Washing Machine Inlet Hose",

    category: "Washing Machine Accessories",

    categorySlug: "washing-machine-accessories",

    price: 299,

    oldPrice: 449,

    image: "〰️",

    images: [
      "〰️",
      "💧",
      "🧺",
      "🔩",
      "🛠️",
    ],

    rating: 4.2,

    reviews: 39,

    badge: "",

    description:
      "Replacement washing machine inlet hose designed for reliable water connection and convenient appliance installation.",

    highlights: [
      "Replacement inlet hose",
      "Suitable for compatible washing machines",
      "Designed for water connection",
      "Flexible construction",
      "Easy to replace",
      "Suitable for home appliance maintenance",
    ],

    specifications: [
      {
        label: "Product Type",
        value: "Washing Machine Inlet Hose",
      },
      {
        label: "Usage",
        value: "Washing Machine",
      },
      {
        label: "Connection",
        value: "Compatible Water Inlet",
      },
      {
        label: "Installation",
        value: "Easy replacement",
      },
    ],

    inStock: true,
  },
];