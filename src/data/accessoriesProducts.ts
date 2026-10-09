export interface AccessoryProduct {
  id: number;
  name: string;
  category: string;
  categorySlug: string;
  subcategorySlug?: string;
  price: number;
  oldPrice: number;
  image: string;
  images: string[];
  rating: number;
  reviews: number;
  badge: string;
  description: string;
  highlights: string[];
  specifications: { label: string; value: string }[];
  inStock: boolean;
  fastDelivery?: boolean;
  installationAvailable?: boolean;
}


export interface AccessorySubcategory {
  name: string;
  slug: string;
}

export interface AccessoryCategory {
  name: string;
  slug: string;
  subcategories: AccessorySubcategory[];
}

export const accessoryCategories: AccessoryCategory[] = [
  {
    name: "Home Appliances",
    slug: "home-appliances",
    subcategories: [
      { name: "Washing Machines", slug: "washing-machines" },
      { name: "Refrigerators", slug: "refrigerators" },
      { name: "Air Conditioners", slug: "air-conditioners" },
      { name: "Microwave Ovens", slug: "microwave-ovens" },
      { name: "Water Purifiers", slug: "water-purifiers" },
      { name: "Geysers & Chimneys", slug: "geysers-chimneys" },
      {
        name: "Small Home Appliances",
        slug: "small-home-appliances",
      },
    ],
  },
  {
    name: "Electronics, Mobile & Computer Accessories",
    slug: "electronics-mobile-computer-accessories",
    subcategories: [
      { name: "Mobiles & Tablets", slug: "mobiles-tablets" },
      { name: "Laptops & Desktops", slug: "laptops-desktops" },
      { name: "Audio & Entertainment", slug: "audio-entertainment" },
      {
        name: "CCTV & Security Equipment",
        slug: "cctv-security-equipment",
      },
    ],
  },
  {
    name: "Fashion, Clothing & Apparel",
    slug: "fashion-clothing-apparel",
    subcategories: [
      { name: "Men's Fashion", slug: "mens-fashion" },
      { name: "Women's Fashion", slug: "womens-fashion" },
      { name: "Kids & Baby Fashion", slug: "kids-baby-fashion" },
      { name: "Footwear", slug: "footwear" },
    ],
  },
  {
    name: "Furniture, Home Decor & Lighting",
    slug: "furniture-home-decor-lighting",
    subcategories: [
      { name: "Home Furniture", slug: "home-furniture" },
      { name: "Office Furniture", slug: "office-furniture" },
      {
        name: "Home Decor & Lighting",
        slug: "home-decor-lighting",
      },
    ],
  },
  {
    name: "Sports, Fitness & Outdoor Goods",
    slug: "sports-fitness-outdoor-goods",
    subcategories: [
      {
        name: "Fitness & Gym Equipment",
        slug: "fitness-gym-equipment",
      },
      { name: "Sports Goods", slug: "sports-goods" },
    ],
  },
];



export const accessoryProducts: AccessoryProduct[] = [
  {
    id: 1,
    name: "Universal AC Remote",
    category: "Home Appliances",
    categorySlug: "home-appliances",
    subcategorySlug: "air-conditioners",
    price: 499,
    oldPrice: 799,
    image: "🌬️",
    images: ["https://www.aldahome.com/media/catalog/product/cache/a95cd6208f6f304d3ecd6458151997d3/b/a/baba-universal-remote-for-non-inverter-window-ac-.jpg"],
    rating: 4.5,
    reviews: 128,
    badge: "Popular",
    description:
      "Universal remote control compatible with many air conditioner models. Check compatibility before ordering.",
    highlights: [
      "Easy-to-use controls",
      "Compatible with supported AC models",
      "Lightweight design",
    ],
    specifications: [
      { label: "Product type", value: "Universal AC remote" },
      { label: "Compatibility", value: "Selected AC models" },
    ],
    inStock: true,
    fastDelivery: true,
    installationAvailable: false,
  },
  {
    id: 2,
    name: "AC Dust Filter",
    category: "Home Appliances",
    categorySlug: "home-appliances",
    subcategorySlug: "air-conditioners",
    price: 299,
    oldPrice: 449,
    image: "🌬️",
    images: ["https://m.media-amazon.com/images/I/51gEQW5IZ+L._AC_UF894,1000_QL80_.jpg"],
    rating: 4.3,
    reviews: 86,
    badge: "Value Pick",
    description:
      "Replacement dust filter for compatible air conditioners. Confirm the size and model before purchasing.",
    highlights: [
      "Helps capture airborne dust",
      "Replacement filter",
      "Check dimensions before ordering",
    ],
    specifications: [
      { label: "Product type", value: "AC dust filter" },
      { label: "Compatibility", value: "Selected AC models" },
    ],
    inStock: true,
    fastDelivery: true,
    installationAvailable: false,
  },
  {
    id: 3,
    name: "Washing Machine Cover",
    category: "Home Appliances",
    categorySlug: "home-appliances",
    subcategorySlug: "washing-machines",
    price: 399,
    oldPrice: 599,
    image: "🧺",
    images: ["https://images.meesho.com/images/products/958520704/acv3n_512.jpg"],
    rating: 4.4,
    reviews: 94,
    badge: "Best Seller",
    description:
      "Protective cover for washing machines. Check the dimensions and loading style to ensure a suitable fit.",
    highlights: [
      "Helps protect against dust",
      "Designed for household use",
      "Check machine dimensions before ordering",
    ],
    specifications: [
      { label: "Product type", value: "Washing machine cover" },
      { label: "Fit", value: "Depends on machine dimensions" },
    ],
    inStock: true,
    fastDelivery: true,
    installationAvailable: false,
  },
  {
    id: 4,
    name: "Universal TV Remote",
    category: "Electronics, Mobile & Computer Accessories",
    categorySlug: "electronics-mobile-computer-accessories",
    subcategorySlug: "audio-entertainment",
    price: 349,
    oldPrice: 499,
    image: "📺",
    images: ["📺"],
    rating: 4.2,
    reviews: 73,
    badge: "Popular",
    description:
      "Universal television remote for supported TV models. Confirm compatibility before purchase.",
    highlights: [
      "Convenient replacement remote",
      "Simple button layout",
      "Check TV compatibility before ordering",
    ],
    specifications: [
      { label: "Product type", value: "Universal TV remote" },
      { label: "Compatibility", value: "Selected TV models" },
    ],
    inStock: true,
    fastDelivery: true,
    installationAvailable: false,
  },
  {
    id: 5,
    name: "Refrigerator Mat",
    category: "Home Appliances",
    categorySlug: "home-appliances",
    subcategorySlug: "refrigerators",
    price: 199,
    oldPrice: 299,
    image: "🧊",
    images: ["🧊"],
    rating: 4.1,
    reviews: 52,
    badge: "Budget Pick",
    description:
      "Protective refrigerator mat for compatible shelves or storage areas. Check the dimensions before use.",
    highlights: [
      "Easy to place",
      "Helps keep surfaces tidy",
      "Check dimensions before ordering",
    ],
    specifications: [
      { label: "Product type", value: "Refrigerator mat" },
      { label: "Fit", value: "Depends on dimensions" },
    ],
    inStock: true,
    fastDelivery: false,
    installationAvailable: false,
  },
  {
    id: 6,
    name: "HDMI Cable",
    category: "Electronics, Mobile & Computer Accessories",
    categorySlug: "electronics-mobile-computer-accessories",
    subcategorySlug: "audio-entertainment",
    price: 249,
    oldPrice: 399,
    image: "🔌",
    images: ["🔌"],
    rating: 4.6,
    reviews: 146,
    badge: "Top Rated",
    description:
      "HDMI cable for connecting compatible televisions, monitors and other supported devices.",
    highlights: [
      "Connects compatible HDMI devices",
      "Suitable for supported displays",
      "Check required cable length before ordering",
    ],
    specifications: [
      { label: "Product type", value: "HDMI cable" },
      { label: "Compatibility", value: "Devices with compatible HDMI ports" },
    ],
    inStock: true,
    fastDelivery: true,
    installationAvailable: false,
  },
  {
    id: 7,
    name: "AC Installation Stand",
    category: "Home Appliances",
    categorySlug: "home-appliances",
    subcategorySlug: "air-conditioners",
    price: 899,
    oldPrice: 1199,
    image: "🛠️",
    images: ["🛠️"],
    rating: 4.4,
    reviews: 61,
    badge: "Recommended",
    description:
      "Support stand for compatible outdoor AC units. Have a qualified professional verify the load rating and installation requirements.",
    highlights: [
      "Support accessory for compatible units",
      "Confirm dimensions and load rating",
      "Professional installation recommended",
    ],
    specifications: [
      { label: "Product type", value: "AC support stand" },
      { label: "Installation", value: "Professional installation recommended" },
    ],
    inStock: true,
    fastDelivery: false,
    installationAvailable: true,
  },
  {
    id: 8,
    name: "Washing Machine Inlet Hose",
    category: "Home Appliances",
    categorySlug: "home-appliances",
    subcategorySlug: "washing-machines",
    price: 299,
    oldPrice: 449,
    image: "🚿",
    images: ["🚿"],
    rating: 4.3,
    reviews: 48,
    badge: "Useful Accessory",
    description:
      "Replacement inlet hose for compatible washing machines. Verify connector size and required hose length.",
    highlights: [
      "Replacement water inlet hose",
      "Check connector compatibility",
      "Verify hose length before ordering",
    ],
    specifications: [
      { label: "Product type", value: "Washing machine inlet hose" },
      { label: "Compatibility", value: "Depends on connectors and length" },
    ],
    inStock: true,
    fastDelivery: true,
    installationAvailable: false,
  },
];

