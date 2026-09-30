export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  shortName: string;
  image: string;
  description: string;
  rating: string;
  reviews: string;
  price: number;
  commonIssues: string[];
  serviceTypes: string[];
  process: string[];
  benefits: string[];
  locations: string[];
}

export interface ServiceCategory {
  name: string;
  services: ServiceItem[];
}


/* =========================================================
   ALL SERVICES
========================================================= */

export const services: ServiceItem[] = [

  /* =======================================================
     HOME APPLIANCES
  ======================================================= */

  {
    id: "ac-repair",
    name: "AC Repair & Service",
    category: "Home Appliances",
    shortName: "AC",
    image: "/images/hero/acrepair.png",
    description:
      "Professional AC repair and service for all major brands. Our certified technicians provide reliable diagnosis, maintenance and repair at your doorstep.",
    rating: "4.8",
    reviews: "127",
    price: 499,

    commonIssues: [
      "Not cooling",
      "Water leakage",
      "Unusual noise",
      "Gas issue",
      "Power issue",
    ],

    serviceTypes: [
      "AC Inspection",
      "AC Repair",
      "AC Service",
      "Gas Charging",
      "AC Installation",
      "AC Maintenance",
    ],

    process: [
      "Book",
      "Visit",
      "Diagnose",
      "Quote",
      "Repair",
      "Warranty",
    ],

    benefits: [
      "Verified professionals",
      "Transparent pricing",
      "Genuine parts",
      "Convenient doorstep service",
      "Service warranty",
    ],

    locations: [
      "MVP Colony",
      "MVP Colony",
      "Gajuwaka",
      "Seethammadhara",
      "Akkayyapalem",
    ],
  },


  {
    id: "tv-repair",
    name: "TV Repair & Service",
    category: "Home Appliances",
    shortName: "TV",
    image: "/images/services/homeappliances.png",
    description:
      "Professional television repair and service for LED, LCD and smart TVs from major brands.",
    rating: "4.7",
    reviews: "94",
    price: 399,

    commonIssues: [
      "No display",
      "No sound",
      "Power issue",
      "Screen issue",
      "Remote issue",
    ],

    serviceTypes: [
      "TV Inspection",
      "Screen Diagnosis",
      "Power Repair",
      "Sound Repair",
      "Smart TV Service",
    ],

    process: [
      "Book",
      "Visit",
      "Diagnose",
      "Quote",
      "Repair",
      "Warranty",
    ],

    benefits: [
      "Verified technicians",
      "Transparent pricing",
      "Major brand support",
      "Doorstep service",
      "Service warranty",
    ],

    locations: [
      "MVP Colony",
      "Gajuwaka",
      "Seethammadhara",
      "Akkayyapalem",
    ],
  },


  {
    id: "refrigerator-repair",
    name: "Refrigerator Repair & Service",
    category: "Home Appliances",
    shortName: "Refrigerator",
    image: "/images/services/homeappliances.png",
    description:
      "Reliable refrigerator repair and maintenance for single door, double door and modern frost-free refrigerators.",
    rating: "4.8",
    reviews: "86",
    price: 449,

    commonIssues: [
      "Not cooling",
      "Water leakage",
      "Ice formation",
      "Compressor issue",
      "Unusual noise",
    ],

    serviceTypes: [
      "Refrigerator Inspection",
      "Cooling Repair",
      "Gas Charging",
      "Compressor Service",
      "Maintenance",
    ],

    process: [
      "Book",
      "Visit",
      "Diagnose",
      "Quote",
      "Repair",
      "Warranty",
    ],

    benefits: [
      "Experienced professionals",
      "Transparent pricing",
      "Quality parts",
      "Doorstep service",
      "Service warranty",
    ],

    locations: [
      "MVP Colony",
      "Gajuwaka",
      "Maddilapalem",
      "Seethammadhara",
    ],
  },


  {
    id: "washing-machine-repair",
    name: "Washing Machine Repair & Service",
    category: "Home Appliances",
    shortName: "Washing Machine",
    image: "/images/hero/washingmachine.png",
    description:
      "Expert washing machine repair and maintenance for front-load, top-load and semi-automatic machines.",
    rating: "4.7",
    reviews: "78",
    price: 399,

    commonIssues: [
      "Machine not starting",
      "Water drainage issue",
      "Spin problem",
      "Excessive vibration",
      "Water leakage",
    ],

    serviceTypes: [
      "Inspection",
      "Washing Machine Repair",
      "Drainage Repair",
      "Motor Service",
      "Maintenance",
    ],

    process: [
      "Book",
      "Visit",
      "Diagnose",
      "Quote",
      "Repair",
      "Warranty",
    ],

    benefits: [
      "Verified technicians",
      "Transparent pricing",
      "Quality parts",
      "Doorstep service",
      "Service warranty",
    ],

    locations: [
      "MVP Colony",
      "Gajuwaka",
      "Seethammadhara",
      "Akkayyapalem",
    ],
  },


  {
    id: "microwave-repair",
    name: "Microwave Repair & Service",
    category: "Home Appliances",
    shortName: "Microwave",
    image: "/images/services/homeappliances.png",
    description:
      "Professional microwave inspection, repair and maintenance for major brands.",
    rating: "4.6",
    reviews: "51",
    price: 349,

    commonIssues: [
      "Not heating",
      "Power issue",
      "Door issue",
      "Sparking",
      "Unusual noise",
    ],

    serviceTypes: [
      "Inspection",
      "Heating Repair",
      "Power Repair",
      "Door Repair",
      "Maintenance",
    ],

    process: [
      "Book",
      "Visit",
      "Diagnose",
      "Quote",
      "Repair",
      "Warranty",
    ],

    benefits: [
      "Verified professionals",
      "Clear pricing",
      "Quality parts",
      "Doorstep service",
      "Service support",
    ],

    locations: [
      "MVP Colony",
      "Gajuwaka",
      "Seethammadhara",
      "Akkayyapalem",
    ],
  },


  {
    id: "water-purifier-service",
    name: "Water Purifier Service",
    category: "Home Appliances",
    shortName: "Water Purifier",
    image: "/images/services/homeappliances.png",
    description:
      "Complete water purifier servicing, filter replacement and repair from trusted professionals.",
    rating: "4.8",
    reviews: "63",
    price: 299,

    commonIssues: [
      "Slow water flow",
      "Water leakage",
      "Bad taste",
      "Filter issue",
      "Purifier not working",
    ],

    serviceTypes: [
      "RO Service",
      "Filter Replacement",
      "Purifier Repair",
      "Installation",
      "Maintenance",
    ],

    process: [
      "Book",
      "Visit",
      "Diagnose",
      "Quote",
      "Service",
      "Warranty",
    ],

    benefits: [
      "Verified professionals",
      "Genuine filters",
      "Transparent pricing",
      "Doorstep service",
      "Service support",
    ],

    locations: [
      "MVP Colony",
      "Gajuwaka",
      "Seethammadhara",
      "Akkayyapalem",
    ],
  },


  /* =======================================================
     HOME SERVICES
  ======================================================= */

  {
    id: "electrician",
    name: "Electrician Service",
    category: "Home Services",
    shortName: "Electrician",
    image: "/images/hero/electrician.png",
    description:
      "Professional electrical repair and installation services for homes, apartments and offices.",
    rating: "4.8",
    reviews: "143",
    price: 299,

    commonIssues: [
      "Power failure",
      "Switch problem",
      "Socket issue",
      "Fan problem",
      "Lighting issue",
    ],

    serviceTypes: [
      "Electrical Inspection",
      "Switch & Socket Repair",
      "Fan Installation",
      "Lighting Installation",
      "Wiring Repair",
    ],

    process: [
      "Book",
      "Visit",
      "Inspect",
      "Quote",
      "Repair",
      "Completion",
    ],

    benefits: [
      "Verified electricians",
      "Transparent pricing",
      "Safe service",
      "Doorstep support",
      "Quality materials",
    ],

    locations: [
      "MVP Colony",
      "Gajuwaka",
      "Seethammadhara",
      "Akkayyapalem",
    ],
  },


  {
    id: "plumber",
    name: "Plumbing Service",
    category: "Home Services",
    shortName: "Plumber",
    image: "/images/hero/plumber.png",
    description:
      "Reliable plumbing services for leakage, installation, drainage and other household plumbing requirements.",
    rating: "4.8",
    reviews: "119",
    price: 299,

    commonIssues: [
      "Water leakage",
      "Blocked drain",
      "Tap issue",
      "Pipe leakage",
      "Low water pressure",
    ],

    serviceTypes: [
      "Leakage Repair",
      "Tap Repair",
      "Pipe Repair",
      "Drain Cleaning",
      "Bathroom Plumbing",
    ],

    process: [
      "Book",
      "Visit",
      "Inspect",
      "Quote",
      "Repair",
      "Completion",
    ],

    benefits: [
      "Experienced plumbers",
      "Transparent pricing",
      "Quality materials",
      "Doorstep service",
      "Quick response",
    ],

    locations: [
      "MVP Colony",
      "Gajuwaka",
      "Seethammadhara",
      "Akkayyapalem",
    ],
  },


  {
    id: "carpenter",
    name: "Carpenter Service",
    category: "Home Services",
    shortName: "Carpenter",
    image: "/images/services/repairs.png",
    description:
      "Professional carpentry services for furniture repair, installation, modifications and household woodwork.",
    rating: "4.7",
    reviews: "73",
    price: 349,

    commonIssues: [
      "Furniture repair",
      "Door problem",
      "Cabinet issue",
      "Hinge replacement",
      "Furniture installation",
    ],

    serviceTypes: [
      "Furniture Repair",
      "Door Repair",
      "Cabinet Repair",
      "Furniture Installation",
      "Custom Woodwork",
    ],

    process: [
      "Book",
      "Visit",
      "Inspect",
      "Quote",
      "Work",
      "Completion",
    ],

    benefits: [
      "Skilled carpenters",
      "Transparent pricing",
      "Quality materials",
      "Doorstep service",
      "Reliable workmanship",
    ],

    locations: [
      "MVP Colony",
      "Gajuwaka",
      "Seethammadhara",
      "Akkayyapalem",
    ],
  },


  {
    id: "cleaning",
    name: "Home Cleaning Service",
    category: "Home Services",
    shortName: "Cleaning",
    image: "/images/services/repairs.png",
    description:
      "Professional home cleaning services designed to keep your living spaces clean, fresh and comfortable.",
    rating: "4.8",
    reviews: "101",
    price: 499,

    commonIssues: [
      "Deep cleaning",
      "Kitchen cleaning",
      "Bathroom cleaning",
      "Dust accumulation",
      "Move-in cleaning",
    ],

    serviceTypes: [
      "Full Home Cleaning",
      "Kitchen Cleaning",
      "Bathroom Cleaning",
      "Deep Cleaning",
      "Move-in Cleaning",
    ],

    process: [
      "Book",
      "Visit",
      "Inspect",
      "Confirm",
      "Clean",
      "Completion",
    ],

    benefits: [
      "Trained professionals",
      "Quality cleaning products",
      "Transparent pricing",
      "Convenient scheduling",
      "Managed service",
    ],

    locations: [
      "MVP Colony",
      "Gajuwaka",
      "Seethammadhara",
      "Akkayyapalem",
    ],
  },


  /* =======================================================
     PERSONAL SERVICES
  ======================================================= */

  {
    id: "makeup",
    name: "Makeup Service",
    category: "Personal Services",
    shortName: "Makeup",
    image: "/images/services/beauty.png",
    description:
      "Professional makeup services delivered by experienced beauty professionals at your preferred location.",
    rating: "4.8",
    reviews: "68",
    price: 799,

    commonIssues: [
      "Party makeup",
      "Event makeup",
      "Bridal makeup",
      "Basic makeup",
      "Makeup consultation",
    ],

    serviceTypes: [
      "Party Makeup",
      "Bridal Makeup",
      "Event Makeup",
      "Basic Makeup",
      "Makeup Consultation",
    ],

    process: [
      "Book",
      "Confirm",
      "Professional Visit",
      "Consult",
      "Service",
      "Completion",
    ],

    benefits: [
      "Experienced professionals",
      "Hygienic products",
      "Flexible scheduling",
      "At-home service",
      "Personalized service",
    ],

    locations: [
      "MVP Colony",
      "Gajuwaka",
      "Seethammadhara",
      "Akkayyapalem",
    ],
  },


  {
    id: "hair-styling",
    name: "Hair Styling Service",
    category: "Personal Services",
    shortName: "Hair Styling",
    image: "/images/services/beauty.png",
    description:
      "Professional hair styling and grooming services delivered by experienced professionals.",
    rating: "4.7",
    reviews: "59",
    price: 499,

    commonIssues: [
      "Hair styling",
      "Haircut",
      "Event styling",
      "Hair grooming",
    ],

    serviceTypes: [
      "Haircut",
      "Hair Styling",
      "Event Styling",
      "Hair Grooming",
    ],

    process: [
      "Book",
      "Confirm",
      "Professional Visit",
      "Consult",
      "Service",
      "Completion",
    ],

    benefits: [
      "Experienced professionals",
      "At-home convenience",
      "Hygienic tools",
      "Flexible scheduling",
      "Personalized service",
    ],

    locations: [
      "MVP Colony",
      "Gajuwaka",
      "Seethammadhara",
      "Akkayyapalem",
    ],
  },


  {
    id: "beautician",
    name: "Beautician Service",
    category: "Personal Services",
    shortName: "Beautician",
    image: "/images/services/beauty.png",
    description:
      "Convenient at-home beauty and personal care services from trusted professionals.",
    rating: "4.8",
    reviews: "72",
    price: 599,

    commonIssues: [
      "Facial",
      "Threading",
      "Waxing",
      "Beauty care",
    ],

    serviceTypes: [
      "Facial",
      "Threading",
      "Waxing",
      "Beauty Care",
      "Personal Grooming",
    ],

    process: [
      "Book",
      "Confirm",
      "Professional Visit",
      "Consult",
      "Service",
      "Completion",
    ],

    benefits: [
      "Verified professionals",
      "Hygienic service",
      "At-home convenience",
      "Flexible scheduling",
      "Personalized care",
    ],

    locations: [
      "MVP Colony",
      "Gajuwaka",
      "Seethammadhara",
      "Akkayyapalem",
    ],
  },


  /* =======================================================
     HOME STAFF
  ======================================================= */

  {
    id: "maid",
    name: "Maid Service",
    category: "Home Staff",
    shortName: "Maid",
    image: "/images/services/personal.png",
    description:
      "Reliable home assistance and maid services to support everyday household requirements.",
    rating: "4.7",
    reviews: "88",
    price: 499,

    commonIssues: [
      "Daily household help",
      "Cleaning assistance",
      "Kitchen assistance",
      "Routine home support",
    ],

    serviceTypes: [
      "Daily Maid",
      "Part-time Maid",
      "Household Assistance",
      "Cleaning Assistance",
    ],

    process: [
      "Book",
      "Requirement Check",
      "Professional Match",
      "Confirm",
      "Service",
      "Follow-up",
    ],

    benefits: [
      "Verified professionals",
      "Flexible schedules",
      "Managed service",
      "Reliable support",
      "Easy booking",
    ],

    locations: [
      "MVP Colony",
      "Gajuwaka",
      "Seethammadhara",
      "Akkayyapalem",
    ],
  },


  {
    id: "cooking",
    name: "Cooking Service",
    category: "Home Staff",
    shortName: "Cooking",
    image: "/images/services/personal.png",
    description:
      "Convenient home cooking assistance for everyday meals and household requirements.",
    rating: "4.7",
    reviews: "61",
    price: 499,

    commonIssues: [
      "Daily cooking",
      "Meal preparation",
      "Kitchen assistance",
      "Special meal preparation",
    ],

    serviceTypes: [
      "Daily Cooking",
      "Part-time Cook",
      "Meal Preparation",
      "Kitchen Assistance",
    ],

    process: [
      "Book",
      "Requirement Check",
      "Professional Match",
      "Confirm",
      "Service",
      "Follow-up",
    ],

    benefits: [
      "Verified professionals",
      "Flexible schedules",
      "Convenient service",
      "Managed support",
      "Easy booking",
    ],

    locations: [
      "MVP Colony",
      "Gajuwaka",
      "Seethammadhara",
      "Akkayyapalem",
    ],
  },


  {
    id: "home-cleaning",
    name: "Home Staff Cleaning",
    category: "Home Staff",
    shortName: "Cleaning",
    image: "/images/services/personal.png",
    description:
      "Regular household cleaning assistance for maintaining a clean and comfortable home.",
    rating: "4.8",
    reviews: "74",
    price: 399,

    commonIssues: [
      "Daily cleaning",
      "Dusting",
      "Mopping",
      "Kitchen cleaning",
      "Routine household work",
    ],

    serviceTypes: [
      "Daily Cleaning",
      "Part-time Cleaning",
      "Kitchen Assistance",
      "Household Cleaning",
    ],

    process: [
      "Book",
      "Requirement Check",
      "Professional Match",
      "Confirm",
      "Service",
      "Follow-up",
    ],

    benefits: [
      "Verified professionals",
      "Flexible schedules",
      "Reliable support",
      "Managed service",
      "Easy booking",
    ],

    locations: [
      "MVP Colony",
      "Gajuwaka",
      "Seethammadhara",
      "Akkayyapalem",
    ],
  },


  {
    id: "babysitting",
    name: "Babysitting Service",
    category: "Home Staff",
    shortName: "Babysitting",
    image: "/images/services/personal.png",
    description:
      "Trusted childcare assistance designed to support families with everyday childcare needs.",
    rating: "4.8",
    reviews: "47",
    price: 599,

    commonIssues: [
      "Childcare assistance",
      "Supervision",
      "Meal assistance",
      "Routine childcare",
    ],

    serviceTypes: [
      "Daytime Babysitting",
      "Part-time Childcare",
      "Child Supervision",
      "Routine Assistance",
    ],

    process: [
      "Book",
      "Requirement Check",
      "Professional Match",
      "Confirm",
      "Service",
      "Follow-up",
    ],

    benefits: [
      "Verified professionals",
      "Flexible scheduling",
      "Reliable assistance",
      "Managed service",
      "Easy booking",
    ],

    locations: [
      "MVP Colony",
      "Gajuwaka",
      "Seethammadhara",
      "Akkayyapalem",
    ],
  },


  {
    id: "elder-assistance",
    name: "Elder Assistance Service",
    category: "Home Staff",
    shortName: "Elder Assistance",
    image: "/images/services/personal.png",
    description:
      "Dependable household assistance and everyday support for elderly family members.",
    rating: "4.8",
    reviews: "42",
    price: 599,

    commonIssues: [
      "Daily assistance",
      "Household support",
      "Companionship",
      "Routine assistance",
    ],

    serviceTypes: [
      "Daily Assistance",
      "Companionship",
      "Household Support",
      "Routine Help",
    ],

    process: [
      "Book",
      "Requirement Check",
      "Professional Match",
      "Confirm",
      "Service",
      "Follow-up",
    ],

    benefits: [
      "Verified professionals",
      "Reliable assistance",
      "Flexible scheduling",
      "Managed service",
      "Easy booking",
    ],

    locations: [
      "MVP Colony",
      "Gajuwaka",
      "Seethammadhara",
      "Akkayyapalem",
    ],
  },
];


/* =========================================================
   CATEGORY MENU
========================================================= */

export const serviceCategories: ServiceCategory[] = [
  {
    name: "Home Appliances",
    services: services.filter(
      (service) =>
        service.category === "Home Appliances"
    ),
  },

  {
    name: "Home Services",
    services: services.filter(
      (service) =>
        service.category === "Home Services"
    ),
  },

  {
    name: "Personal Services",
    services: services.filter(
      (service) =>
        service.category === "Personal Services"
    ),
  },

  {
    name: "Home Staff",
    services: services.filter(
      (service) =>
        service.category === "Home Staff"
    ),
  },
];