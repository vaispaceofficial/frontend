export type AccessoryProduct = {
  id: number;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviews: number;
  badge?: string;
  image: string;
  description: string;
  inStock: boolean;
  topPick?: boolean;
};

export const accessoryCategories = [
  {
    title: "AC Accessories",
    slug: "ac-accessories",
    description: "Filters, remotes, stands and more",
    icon: "❄️",
  },
  {
    title: "Washing Machine Accessories",
    slug: "washing-machine-accessories",
    description: "Hoses, covers and useful accessories",
    icon: "🫧",
  },
  {
    title: "Refrigerator Accessories",
    slug: "refrigerator-accessories",
    description: "Parts and useful refrigerator accessories",
    icon: "🧊",
  },
  {
    title: "TV Accessories",
    slug: "tv-accessories",
    description: "Remotes, mounts and cables",
    icon: "📺",
  },
  {
    title: "Kitchen Appliances",
    slug: "kitchen-appliances",
    description: "Useful appliances for your kitchen",
    icon: "🍳",
  },
  {
    title: "Electrical Accessories",
    slug: "electrical-accessories",
    description: "Cables, switches and essentials",
    icon: "⚡",
  },
  {
    title: "Other Accessories",
    slug: "other-accessories",
    description: "Useful products for everyday needs",
    icon: "✨",
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
    rating: 4.5,
    reviews: 124,
    badge: "Popular",
    image: "/images/products/universal-ac-remote.jpg",
    description:
      "Universal remote compatible with a wide range of air conditioner models.",
    inStock: true,
    topPick: true,
  },

  {
    id: 2,
    name: "AC Dust Filter",
    category: "AC Accessories",
    categorySlug: "ac-accessories",
    price: 349,
    oldPrice: 499,
    rating: 4.4,
    reviews: 89,
    badge: "New",
    image: "/images/products/ac-dust-filter.jpg",
    description:
      "Replacement dust filter designed to help keep your AC airflow clean.",
    inStock: true,
    topPick: true,
  },

  {
    id: 3,
    name: "Universal AC Stand",
    category: "AC Accessories",
    categorySlug: "ac-accessories",
    price: 899,
    oldPrice: 1199,
    rating: 4.6,
    reviews: 76,
    badge: "Popular",
    image: "/images/products/ac-stand.jpg",
    description:
      "Strong and durable stand suitable for common split AC outdoor units.",
    inStock: true,
    topPick: true,
  },

  {
    id: 4,
    name: "AC Copper Pipe Insulation",
    category: "AC Accessories",
    categorySlug: "ac-accessories",
    price: 749,
    oldPrice: 999,
    rating: 4.3,
    reviews: 42,
    image: "/images/products/ac-pipe.jpg",
    description:
      "Insulated copper pipe accessory suitable for AC installation work.",
    inStock: true,
  },

  {
    id: 5,
    name: "Washing Machine Cover",
    category: "Washing Machine Accessories",
    categorySlug: "washing-machine-accessories",
    price: 599,
    oldPrice: 799,
    rating: 4.5,
    reviews: 156,
    badge: "Popular",
    image: "/images/products/washing-machine-cover.jpg",
    description:
      "Protective washing machine cover designed for everyday home use.",
    inStock: true,
    topPick: true,
  },

  {
    id: 6,
    name: "Washing Machine Inlet Hose",
    category: "Washing Machine Accessories",
    categorySlug: "washing-machine-accessories",
    price: 399,
    oldPrice: 549,
    rating: 4.4,
    reviews: 68,
    image: "/images/products/washing-machine-hose.jpg",
    description:
      "Durable inlet hose for compatible washing machine connections.",
    inStock: true,
  },

  {
    id: 7,
    name: "Washing Machine Drain Hose",
    category: "Washing Machine Accessories",
    categorySlug: "washing-machine-accessories",
    price: 449,
    oldPrice: 599,
    rating: 4.3,
    reviews: 51,
    image: "/images/products/washing-machine-drain-hose.jpg",
    description:
      "Flexible drain hose suitable for common washing machine models.",
    inStock: true,
  },

  {
    id: 8,
    name: "Refrigerator Storage Mat",
    category: "Refrigerator Accessories",
    categorySlug: "refrigerator-accessories",
    price: 399,
    oldPrice: 549,
    rating: 4.5,
    reviews: 91,
    badge: "New",
    image: "/images/products/refrigerator-mat.jpg",
    description:
      "Easy-clean refrigerator shelf mat designed for everyday protection.",
    inStock: true,
    topPick: true,
  },

  {
    id: 9,
    name: "Refrigerator Handle Cover",
    category: "Refrigerator Accessories",
    categorySlug: "refrigerator-accessories",
    price: 299,
    oldPrice: 449,
    rating: 4.2,
    reviews: 37,
    image: "/images/products/refrigerator-handle-cover.jpg",
    description:
      "Protective handle cover for added comfort and cleanliness.",
    inStock: true,
  },

  {
    id: 10,
    name: "Universal TV Remote",
    category: "TV Accessories",
    categorySlug: "tv-accessories",
    price: 299,
    oldPrice: 399,
    rating: 4.4,
    reviews: 203,
    badge: "Popular",
    image: "/images/products/universal-tv-remote.jpg",
    description:
      "Universal replacement remote compatible with many television models.",
    inStock: true,
    topPick: true,
  },

  {
    id: 11,
    name: "HDMI Cable 2 Metre",
    category: "TV Accessories",
    categorySlug: "tv-accessories",
    price: 449,
    oldPrice: 599,
    rating: 4.6,
    reviews: 187,
    image: "/images/products/hdmi-cable.jpg",
    description:
      "High-speed HDMI cable for TVs, streaming devices and compatible equipment.",
    inStock: true,
    topPick: true,
  },

  {
    id: 12,
    name: "Universal TV Wall Mount",
    category: "TV Accessories",
    categorySlug: "tv-accessories",
    price: 899,
    oldPrice: 1299,
    rating: 4.5,
    reviews: 94,
    image: "/images/products/tv-wall-mount.jpg",
    description:
      "Universal wall mount designed for compatible television sizes.",
    inStock: true,
  },

  {
    id: 13,
    name: "Electric Kettle",
    category: "Kitchen Appliances",
    categorySlug: "kitchen-appliances",
    price: 999,
    oldPrice: 1499,
    rating: 4.5,
    reviews: 118,
    badge: "Popular",
    image: "/images/products/electric-kettle.jpg",
    description:
      "Compact electric kettle suitable for everyday kitchen use.",
    inStock: true,
    topPick: true,
  },

  {
    id: 14,
    name: "Mixer Grinder",
    category: "Kitchen Appliances",
    categorySlug: "kitchen-appliances",
    price: 2499,
    oldPrice: 3299,
    rating: 4.4,
    reviews: 87,
    image: "/images/products/mixer-grinder.jpg",
    description:
      "Multi-purpose mixer grinder for everyday kitchen preparation.",
    inStock: true,
  },

  {
    id: 15,
    name: "Extension Board",
    category: "Electrical Accessories",
    categorySlug: "electrical-accessories",
    price: 699,
    oldPrice: 899,
    rating: 4.5,
    reviews: 142,
    badge: "Popular",
    image: "/images/products/extension-board.jpg",
    description:
      "Multi-socket extension board for everyday home electrical use.",
    inStock: true,
    topPick: true,
  },

  {
    id: 16,
    name: "USB Charging Cable",
    category: "Electrical Accessories",
    categorySlug: "electrical-accessories",
    price: 249,
    oldPrice: 399,
    rating: 4.3,
    reviews: 214,
    image: "/images/products/usb-cable.jpg",
    description:
      "Durable charging cable for compatible devices.",
    inStock: true,
  },

  {
    id: 17,
    name: "LED Night Lamp",
    category: "Other Accessories",
    categorySlug: "other-accessories",
    price: 349,
    oldPrice: 499,
    rating: 4.4,
    reviews: 73,
    badge: "New",
    image: "/images/products/led-night-lamp.jpg",
    description:
      "Compact LED night lamp for bedrooms, hallways and everyday use.",
    inStock: true,
    topPick: true,
  },

  {
    id: 18,
    name: "Universal Appliance Cleaning Kit",
    category: "Other Accessories",
    categorySlug: "other-accessories",
    price: 599,
    oldPrice: 799,
    rating: 4.2,
    reviews: 46,
    image: "/images/products/appliance-cleaning-kit.jpg",
    description:
      "Cleaning accessories for maintaining common household appliances.",
    inStock: true,
  },
];