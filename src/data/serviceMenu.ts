export interface ServiceItem {
  id: string;
  /** Old URL slugs retained for compatibility. */
  legacyIds?: string[];
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

const defaultProcess = [
  "Select your service",
  "Choose your issue and service type",
  "Book now or request a callback",
  "Confirm your contact details",
  "OneService coordinates your request",
  "Professional visits and completes the service",
];

const defaultBenefits = [
  "Convenient doorstep service",
  "Clear starting prices",
  "Flexible scheduling",
  "Support from OneService",
];

const defaultLocations = [
  "MVP Colony, Vizag",
  "Madhurawada, Vizag",
  "Gajuwaka, Vizag",
  "Seethammadhara, Vizag",
  "Akkayyapalem, Vizag",
];

function createService(
  id: string,
  name: string,
  category: string,
  shortName: string,
  image: string,
  description: string,
  price: number,
  commonIssues: string[],
  serviceTypes: string[],
  legacyIds: string[] = [],
): ServiceItem {
  return {
    id,
    ...(legacyIds.length > 0 ? { legacyIds } : {}),
    name,
    category,
    shortName,
    image,
    description,
    rating: "4.8",
    reviews: "100+",
    price,
    commonIssues,
    serviceTypes,
    process: [...defaultProcess],
    benefits: [...defaultBenefits],
    locations: [...defaultLocations],
  };
}

const appliances = "Home Appliances";
const homeServices = "Home Services";
const personalServices = "Personal Services";
const homeStaff = "Home Staff";
const edutech = "EduTech & Home Tutors";
const professionalServices = "Professional Services";

export const services: ServiceItem[] = [
  // =====================================================
  // HOME APPLIANCES
  // =====================================================

  createService(
    "ac-repair",
    "Air Conditioner (AC)",
    appliances,
    "AC Repair",
    "/images/servicedetails/AC Repairs.webp",
    "Professional AC installation, uninstallation, gas charging, jet servicing and repair for residential air conditioners.",
    499,
    ["AC not cooling", "Water leakage", "Gas leakage", "Unusual noise", "AC not starting"],
    ["AC Installation", "AC Uninstallation", "Gas Charging", "Jet Servicing", "AC Repair"],
  ),

  createService(
    "tv-repair",
    "Television",
    appliances,
    "TV Repair",
    "/images/servicedetails/tvrepair.webp",
    "Get help with LED, QLED and OLED television repairs, wall mounting and soundbar or home theatre setup.",
    399,
    ["TV not turning on", "No picture", "Sound problems", "Display issues", "Wall mounting"],
    ["LED TV Repair", "QLED/OLED Repair", "TV Wall Mounting", "Soundbar Setup", "Home Theatre Setup"],
  ),

  createService(
    "refrigerator-repair",
    "Refrigerator",
    appliances,
    "Refrigerator Repair",
    "/images/servicedetails/Refrigerator.webp",
    "Doorstep refrigerator repair for single-door, double-door and side-by-side models, including compressor diagnosis and gas filling.",
    399,
    ["Refrigerator not cooling", "Excessive ice formation", "Water leakage", "Compressor problems", "Unusual noise"],
    ["Single-Door Repair", "Double-Door Repair", "Side-by-Side Repair", "Compressor Repair", "Gas Filling"],
  ),

  createService(
    "washing-machine-repair",
    "Washing Machine",
    appliances,
    "Washing Machine Repair",
    "/images/servicedetails/WashingMachine.webp",
    "Repair and maintenance for top-load, front-load and semi-automatic washing machines.",
    349,
    ["Machine not spinning", "Water not draining", "Excessive vibration", "Water leakage", "Machine not starting"],
    ["Top-Load Repair", "Front-Load Repair", "Semi-Automatic Repair", "Installation", "General Servicing"],
  ),

  createService(
    "microwave-repair",
    "Microwave Oven",
    appliances,
    "Microwave Repair",
    "/images/servicedetails/Microwave repair.webp",
    "Microwave servicing and repair for solo, grill and convection ovens, including diagnosis of heating problems and magnetron replacement.",
    299,
    ["Not heating", "Turntable not rotating", "Sparking inside", "Door not closing", "Display problems"],
    ["Solo Microwave Repair", "Grill Microwave Repair", "Convection Repair", "Magnetron Replacement", "General Servicing"],
  ),

  createService(
    "water-purifier-service",
    "Water Purifier",
    appliances,
    "Water Purifier Service",
    "/images/servicedetails/Water Purifier Service.webp",
    "RO and UV water purifier maintenance, filter replacement, membrane changes and routine servicing.",
    299,
    ["Slow water flow", "Bad water taste", "Water leakage", "Filter replacement", "Purifier not starting"],
    ["RO Servicing", "UV Purifier Service", "Filter Replacement", "Membrane Change", "Installation"],
  ),

  createService(
    "chimney-hob",
    "Chimney & Hob",
    appliances,
    "Chimney and Hob Service",
    "/images/servicedetails/Chimney n Hob service.webp",
    "Kitchen chimney and hob maintenance, including deep cleaning, baffle filter replacement and repair.",
    399,
    ["Grease buildup", "Weak suction", "Excessive noise", "Ignition problems", "Filter damage"],
    ["Chimney Deep Cleaning", "Baffle Filter Replacement", "Chimney Repair", "Hob Repair", "Installation"],
  ),

  createService(
    "geyser-repair",
    "Geyser",
    appliances,
    "Geyser Repair",
    "/images/servicedetails/geyser.webp",
    "Geyser installation, heating element replacement and repair for common heating, electrical and leakage problems.",
    299,
    ["Water not heating", "Water leakage", "Electrical issues", "Low hot-water flow", "Unusual noise"],
    ["Geyser Installation", "Heating Element Replacement", "Coil Replacement", "Leakage Repair", "General Servicing"],
  ),

  // =====================================================
  // HOME SERVICES
  // =====================================================

  createService(
    "electrician",
    "Electrician",
    homeServices,
    "Electrical Service",
    "/images/servicedetails/Electrician.webp",
    "Professional electrical assistance for wiring, switches, MCBs, light fittings and fan installation.",
    199,
    ["Power issues", "Faulty switches", "MCB tripping", "Light installation", "Fan installation"],
    ["Wiring Repair", "Switch and Socket Repair", "MCB Repair", "Light Fitting", "Fan Installation"],
  ),

  createService(
    "plumber",
    "Plumber",
    homeServices,
    "Plumbing Service",
    "/images/servicedetails/Plumber.webp",
    "Home plumbing support for pipe leaks, tap fittings, bathroom sanitary work and water tank cleaning.",
    199,
    ["Leaking pipes", "Tap leakage", "Blocked drains", "Bathroom fittings", "Water tank cleaning"],
    ["Pipe Leak Repair", "Tap Fitting", "Drainage Repair", "Sanitary Work", "Water Tank Cleaning"],
  ),

  createService(
    "carpenter",
    "Carpenter",
    homeServices,
    "Carpentry Service",
    "/images/servicedetails/Carpenter.webp",
    "Carpentry assistance for furniture repair, door locks, cabinet work and furniture assembly.",
    249,
    ["Damaged furniture", "Door alignment", "Lock fitting", "Cabinet repair", "Furniture assembly"],
    ["Furniture Repair", "Door and Lock Fitting", "Custom Cabinetry", "Furniture Assembly", "General Carpentry"],
  ),

  createService(
    "cleaning",
    "Home Deep Cleaning",
    homeServices,
    "Home Deep Cleaning",
    "/images/servicedetails/deepcleaning.webp",
    "Detailed home cleaning for floors, kitchens, bathrooms and hard-to-reach areas.",
    999,
    ["Full-house cleaning", "Sofa Cleaning", "Bathroom cleaning", "Kitchen grease", "Dust buildup", "Move-in cleaning"],
    ["Full House Deep Cleaning", "Bathroom Deep Cleaning", "Kitchen Deep Cleaning", "Move-In Cleaning", "Move-Out Cleaning"],
    ["home-cleaning"],
  ),

  createService(
    "painter-waterproofing",
    "Painter & Waterproofing",
    homeServices,
    "Painting and Waterproofing",
    "/images/servicedetails/painters.webp",
    "Interior and exterior painting, wall putty work and roof or terrace waterproofing.",
    499,
    ["Peeling paint", "Wall cracks", "Damp patches", "Roof leakage", "Fresh painting"],
    ["Interior Painting", "Exterior Painting", "Wall Putty", "Roof Waterproofing", "Leakage Treatment"],
  ),

  createService(
    "pest-control",
    "Pest Control",
    homeServices,
    "Pest Control",
    "/images/servicedetails/Pest Control.webp",
    "Home pest-control assistance for termites, cockroaches, bed bugs and mosquitoes.",
    499,
    ["Cockroaches", "Termites", "Bed bugs", "Mosquitoes", "Ant infestation"],
    ["Termite Control", "Cockroach Control", "Bed Bug Treatment", "Mosquito Control", "General Pest Treatment"],
  ),

  createService(
    "sofa-carpet-cleaning",
    "Sofa & Carpet Cleaning",
    homeServices,
    "Sofa and Carpet Cleaning",
    "/images/servicedetails/Sofa Cleaning.webp",
    "Deep cleaning for sofas, carpets and upholstery, including vacuuming, shampooing and stain treatment.",
    499,
    ["Fabric stains", "Dust buildup", "Pet hair", "Odours", "Carpet discolouration"],
    ["Sofa Shampooing", "Carpet Cleaning", "Vacuum Cleaning", "Stain Removal", "Upholstery Cleaning"],
  ),

  // createService(
  //   "locksmith",
  //   "Locksmith",
  //   homeServices,
  //   "Locksmith Service",
  //   "/images/services/repairs.png",
  //   "Lock installation, key duplication and assistance with common residential lock problems.",
  //   199,
  //   ["Broken lock", "Key stuck in lock", "New lock installation", "Lost keys", "Door lock problems"],
  //   ["Lock Installation", "Key Duplication", "Lock Repair", "Door Lock Replacement", "Emergency Lock Assistance"],
  // ),

  // =====================================================
  // PERSONAL SERVICES
  // =====================================================

  createService(
    "beautician",
    "Men's Grooming",
    personalServices,
    "Men's Grooming",
    "/images/servicedetails/grooming.webp",
    "At-home men's grooming, including haircuts, beard styling, shaving and charcoal or tan-removal facials.",
    299,
    ["Haircut", "Beard styling", "Shaving", "Tan removal", "Facial care"],
    ["Haircut", "Beard Styling", "Shave", "Charcoal Facial", "Tan Removal Facial"],
  ),

  createService(
    "hair-styling",
    "Salon at Home for Women",
    personalServices,
    "Women's Salon Service",
    "/images/servicedetails/saloon.webp",
    "Convenient at-home beauty services for women, including waxing, facials, pedicures, manicures and hair spa treatments.",
    399,
    ["Hair care", "Skin care", "Unwanted hair removal", "Nail care", "Hair nourishment"],
    ["Waxing", "Facial", "Pedicure", "Manicure", "Hair Spa"],
  ),

  createService(
    "makeup",
    "Bridal & Event Makeup",
    personalServices,
    "Bridal and Event Makeup",
    "/images/servicedetails/makeup and hairstylist.webp",
    "Makeup and styling for weddings, parties and special occasions, with optional saree draping and hairstyling.",
    1499,
    ["Bridal makeup", "Party makeup", "Event styling", "Saree draping", "Occasion hairstyling"],
    ["Bridal Makeup", "Party Makeup", "Saree Draping", "Hair Styling", "Event Makeup"],
  ),

  createService(
    "mehendi",
    "Mehendi Artist",
    personalServices,
    "Mehendi Service",
    "/images/servicedetails/mehandi.webp",
    "Mehendi designs for bridal occasions, festivals and celebrations.",
    499,
    ["Bridal designs", "Festival designs", "Traditional patterns", "Contemporary patterns", "Guest mehendi"],
    ["Bridal Mehendi", "Festival Mehendi", "Traditional Designs", "Contemporary Designs"],
  ),

  createService(
    "spa-massage",
    "Spa & Massage",
    personalServices,
    "Spa and Massage",
    "/images/servicedetails/Spa n Massage Therapist.webp",
    "At-home relaxation and massage services intended to support comfort and relaxation.",
    799,
    ["Muscle tension", "Relaxation", "Body fatigue", "Stress relief", "Post-workout soreness"],
    ["Relaxation Massage", "Full Body Massage", "Pain Relief Massage", "Wellness Session"],
  ),

  createService(
    "fitness-wellness",
    "Fitness & Wellness",
    personalServices,
    "Fitness and Wellness",
    "/images/servicedetails/yoga.webp",
    "At-home fitness and wellness sessions with personal trainers, yoga instructors and physiotherapy professionals.",
    499,
    ["Fitness goals", "Yoga guidance", "Mobility training", "Exercise guidance", "Wellness routine"],
    ["Personal Gym Trainer", "Yoga Instructor", "Physiotherapy at Home", "Personal Fitness Session"],
  ),

  // =====================================================
  // HOME STAFF
  // =====================================================

  createService(
    "maid",
    "House Maid",
    homeStaff,
    "House Maid Service",
    "/images/servicedetails/Maid.webp",
    "Find home cleaning assistance for part-time or live-in household support, based on your requirements.",
    499,
    ["Daily cleaning", "Part-time help", "Regular housekeeping", "Dishwashing", "Household upkeep"],
    ["Part-Time Maid", "Full-Time Maid", "Live-In Cleaning Staff", "Regular Housekeeping"],
  ),

  createService(
    "cooking",
    "Cook / Chef",
    homeStaff,
    "Cook and Chef Service",
    "/images/servicedetails/cook.webp",
    "Arrange daily meal preparation or cooking support for family gatherings and special events.",
    499,
    ["Daily meal preparation", "Breakfast preparation", "Lunch preparation", "Dinner preparation", "Event cooking"],
    ["Daily Cook", "Part-Time Cook", "Full-Time Cook", "Event Chef"],
  ),

  createService(
    "babysitting",
    "Babysitting & Childcare",
    homeStaff,
    "Babysitting Service",
    "/images/servicedetails/baby sitting.webp",
    "At-home childcare support for families seeking help with infant and child supervision.",
    599,
    ["Infant care", "Child supervision", "Playtime assistance", "Routine support", "Part-time childcare"],
    ["Infant Care", "Part-Time Babysitting", "Full-Time Childcare", "Regular Childcare"],
  ),

  createService(
    "elder-assistance",
    "Elder & Patient Care",
    homeStaff,
    "Elder and Patient Care",
    "/images/servicedetails/ElderAssistance.webp",
    "Home assistance for senior citizens and patients, including daily support and non-emergency caregiving.",
    699,
    ["Senior citizen assistance", "Mobility support", "Daily activity support", "Post-operative assistance", "Caregiver support"],
    ["Senior Citizen Care", "Nursing Assistant", "Post-Operative Care", "Daily Care Assistance"],
  ),

  createService(
    "drivers",
    "Drivers",
    homeStaff,
    "Driver Service",
    "/images/servicedetails/drivers.webp",
    "Arrange driving assistance for daily travel, part-time requirements, outstation trips and on-demand journeys.",
    499,
    ["Daily commute", "Part-time driving", "Outstation travel", "On-demand driver", "Family travel"],
    ["Daily Driver", "Part-Time Driver", "Outstation Driver", "On-Demand Driver"],
  ),

  // createService(
  //   "gardener",
  //   "Gardener & Lawn Care",
  //   homeStaff,
  //   "Gardening Service",
  //   "/images/services/personal.png",
  //   "Home garden maintenance, plant care, pruning and basic landscaping assistance.",
  //   399,
  //   ["Plant maintenance", "Overgrown plants", "Lawn care", "Pruning", "Garden cleanup"],
  //   ["Plant Maintenance", "Pruning", "Lawn Care", "Garden Cleanup", "Basic Landscaping"],
  // ),

  // createService(
  //   "pet-care",
  //   "Pet Care",
  //   homeStaff,
  //   "Pet Care Service",
  //   "/images/services/personal.png",
  //   "Pet-care assistance including dog walking, pet sitting and basic grooming arrangements.",
  //   299,
  //   ["Dog walking", "Pet sitting", "Basic grooming", "Daily pet assistance", "Travel-time pet care"],
  //   ["Dog Walker", "Pet Grooming", "Pet Sitting", "Daily Pet Care"],
  // ),

  createService(
    "security-guard",
    "Security Guard",
    homeStaff,
    "Security Guard Service",
    "/images/servicedetails/security.png",
    "Residential security personnel and watchman support based on household and property requirements.",
    799,
    ["Residential security", "Watchman requirements", "Gate monitoring", "Visitor monitoring", "Shift coverage"],
    ["Residential Watchman", "Security Guard", "Day Shift Security", "Night Shift Security"],
  ),

  // =====================================================
  // EDUTECH & HOME TUTORS
  // =====================================================

  createService(
    "school-tuition",
    "Home Tution",
    edutech,
    "School Tuition",
    "/images/servicedetails/Tutors.webp",
    "Home tuition for primary and high-school students, with subject support tailored to their class level.",
    299,
    ["Class 1–5 subjects", "Class 6–10 subjects", "Homework assistance", "Exam preparation", "Concept clarification"],
    ["Primary Tuition (Classes 1–5)", "High School Tuition (Classes 6–10)", "All-Subject Tuition", "Exam Preparation"],
  ),

  createService(
    "competitive-exam-coaching",
    "Competitive Exam Coaching",
    edutech,
    "Competitive Exam Coaching",
    "/images/servicedetails/competitive.webp",
    "Find tutors for IIT-JEE, NEET and EAPCET/EAMCET preparation, with focused subject practice.",
    499,
    ["IIT-JEE preparation", "NEET preparation", "EAPCET/EAMCET preparation", "Practice tests", "Subject revision"],
    ["IIT-JEE Coaching", "NEET Coaching", "EAPCET/EAMCET Coaching", "One-to-One Coaching"],
  ),

  createService(
    "higher-education-tutors",
    "Higher Education",
    edutech,
    "Higher Education Tutoring",
    "/images/servicedetails/highereducation.webp",
    "Tutoring support for B.Tech and degree students in mathematics, physics, computer science and related subjects.",
    399,
    ["Engineering mathematics", "Physics", "Computer science", "Degree subjects", "Exam revision"],
    ["B.Tech Tutoring", "Degree Tutoring", "Mathematics", "Physics", "Computer Science"],
  ),

  createService(
    "language-skill-classes",
    "Language & Skill Classes",
    edutech,
    "Language and Skill Classes",
    "/images/servicedetails/language.png",
    "Home or one-to-one learning options for spoken English, music, dance and coding for children.",
    299,
    ["Spoken English", "Music learning", "Dance lessons", "Coding for kids", "Beginner skill development"],
    ["Spoken English", "Music Classes", "Dance Classes", "Coding for Kids", "One-to-One Classes"],
  ),

  // =====================================================
  // PROFESSIONAL SERVICES — 8 SERVICE GROUPS
  // =====================================================

  createService(
    "legal-tax-financial",
    "Lawyers and Accountants",
    professionalServices,
    "Legal & Financial Services",
    "/images/servicedetails/Advocates.webp",
    "Connect with legal consultants, tax professionals, chartered accountants and financial advisors for personal and business requirements.",
    499,
    [
      "Legal consultation",
      "Income tax filing",
      "GST registration and filing",
      "Accounting and bookkeeping",
      "Financial planning",
    ],
    [
      "Legal Consultation",
      "Lawyer and Advocate",
      "Income Tax Filing",
      "GST Services",
      "Chartered Accountant",
      "Accounting and Bookkeeping",
      "Financial Planning",
      "Business Registration",
      "Documentation Assistance",
    ],
  ),


  createService(
    "banking-services",
    "Banking Services",
    professionalServices,
    "Banking & Loan Services",
    "/images/servicedetails/Banking.webp",
    "Get assistance with banking services, account applications, loans, credit facilities and banking documentation.",
    299,
    [
      "Bank account opening assistance",
      "Loan application guidance",
      "Banking documentation",
      "Credit and CIBIL guidance",
      "Digital banking assistance",
    ],
    [
      "Savings Account Assistance",
      "Current Account Assistance",
      "Bank Account Opening Guidance",
      "Fixed Deposits and Recurring Deposits",
      "Home Loan Assistance",
      "Personal Loan Assistance",
      "Business Loan Assistance",
      "Education Loan Assistance",
      "Vehicle Loan Assistance",
      "Loan Eligibility Guidance",
      "Loan Documentation Assistance",
      "Credit Card Application Assistance",
      "Credit Score and CIBIL Guidance",
      "Net Banking Setup Assistance",
      "Mobile Banking Assistance",
      "UPI Setup Assistance",
      "Bank Statement Assistance",
      "Cheque and Passbook Assistance",
      "NRI Banking Guidance",
      "Banking Grievance Assistance",
    ],
  ),


  createService(
    "healthcare-medical",
    "Healthcare & Medical",
    professionalServices,
    "Healthcare Services",
    "/images/servicedetails/healthcare.webp",
    "Find healthcare professionals for consultations, nursing assistance, physiotherapy, diagnostics and other appropriate medical support.",
    499,
    [
      "Doctor consultation",
      "Physiotherapy requirements",
      "Nursing assistance",
      "Diagnostic testing",
      "Diet and nutrition guidance",
    ],
    [
      "General Physician Consultation",
      "Specialist Consultation",
      "Nursing Assistance",
      "Physiotherapy",
      "Dietitian and Nutritionist",
      "Lab Tests and Diagnostics",
      "Psychology Consultation",
      "Medical Equipment Assistance",
    ],
  ),

  createService(
    "religious-vedic-astrology",
    "Religious, Vedic & Astrology",
    professionalServices,
    "Religious & Vedic Services",
    "/images/servicedetails/Pandiths and astrolgers.webp",
    "Arrange religious ceremonies, puja services, Vedic consultations, astrology sessions and related traditional services.",
    499,
    [
      "Puja arrangements",
      "Priest booking",
      "Horoscope consultation",
      "Vastu consultation",
      "Ceremony planning",
    ],
    [
      "Purohit and Priest Services",
      "Puja and Havan",
      "Griha Pravesh Puja",
      "Wedding Rituals",
      "Astrology Consultation",
      "Kundali and Horoscope",
      "Vastu Consultation",
      "Numerology",
      "Festival and Religious Ceremonies",
    ],
  ),

  createService(
    "arts-hobbies-trainers",
    "Arts, Hobbies & Trainers",
    professionalServices,
    "Arts & Training",
    "/images/servicedetails/artsandhobbies.png",
    "Find instructors and trainers for creative hobbies, performing arts, music, dance, painting, yoga and personal development.",
    299,
    [
      "Music lessons",
      "Dance training",
      "Painting classes",
      "Yoga instruction",
      "Hobby and skill development",
    ],
    [
      "Music Teacher",
      "Dance Instructor",
      "Drawing and Painting Classes",
      "Yoga Instructor",
      "Photography Training",
      "Art and Craft Classes",
      "Public Speaking Training",
      "Hobby Classes",
      "Personal Development Training",
    ],
  ),

  createService(
    "freelancers-tech-academic",
    "Freelancers, Tech & Academic",
    professionalServices,
    "Freelance & Tech Services",
    "/images/servicedetails/freelancework.webp",
    "Connect with freelancers, technology specialists, academic tutors and consultants for projects, technical support and learning needs.",
    399,
    [
      "Website development",
      "Graphic design",
      "Computer assistance",
      "Academic tutoring",
      "Research and project support",
    ],
    [
      "Website Development",
      "Software Development",
      "IT Support",
      "Graphic Design",
      "UI/UX Design",
      "Digital Marketing",
      "Content Writing",
      "Academic Tutoring",
      "Coding and Programming Classes",
      "Research and Project Guidance",
    ],
  ),

  createService(
    "event-artists-performers",
    "Event Artists & Performers",
    professionalServices,
    "Event Artists & Performers",
    "/images/servicedetails/events.webp",
    "Book artists, entertainers and event specialists for weddings, celebrations, private functions and corporate events.",
    999,
    [
      "Wedding entertainment",
      "Live music",
      "Event photography",
      "Anchoring and hosting",
      "Stage performances",
    ],
    [
      "Photographer",
      "Videographer",
      "DJ Services",
      "Live Singers and Musicians",
      "Anchor and Emcee",
      "Dance Performers",
      "Magicians and Entertainers",
      "Wedding Artists",
      "Event Makeup Artists",
      "Event Coordination",
    ],
  ),

  createService(
    "personal-helpers-support",
    "Personal Helpers & Support",
    professionalServices,
    "Personal Assistance",
    "/images/servicedetails/ElderAssistance.webp",
    "Find personal assistants and support professionals for everyday errands, organization, companionship and non-medical personal assistance.",
    399,
    [
      "Personal errands",
      "Appointment assistance",
      "Personal organization",
      "Companionship",
      "Everyday assistance",
    ],
    [
      "Personal Assistant",
      "Errand Assistance",
      "Shopping Assistance",
      "Appointment Assistance",
      "Companionship Services",
      "Relocation Assistance",
      "Home Organization",
      "Administrative Assistance",
    ],
  ),

  createService(
    "artisans-local-craftsmen",
    "Tailors and Alteration experts",
    professionalServices,
    "Artisan & Craft Services",
    "/images/servicedetails/artisans.webp",
    "Connect with skilled artisans and local craftsmen for custom-made products, traditional crafts, tailoring, repairs and specialist handiwork.",
    299,
    [
      "Tailoring and alterations",
      "Custom craft work",
      "Traditional handicrafts",
      "Custom furniture and decor",
      "Specialist repair work",
    ],
    [
      "Tailor and Alterations",
      "Embroidery Services",
      "Handicrafts and Handmade Products",
      "Pottery and Clay Art",
      "Wood Carving",
      "Custom Furniture Craftsmanship",
      "Jewellery Making and Repair",
      "Leather Craft",
      "Traditional Artisan Services",
    ],
  ),
];

// =====================================================
// SERVICE CATEGORIES
// =====================================================

export const serviceCategories: ServiceCategory[] = [
  {
    name: appliances,
    services: services.filter((service) => service.category === appliances),
  },
  {
    name: homeServices,
    services: services.filter((service) => service.category === homeServices),
  },
  {
    name: personalServices,
    services: services.filter((service) => service.category === personalServices),
  },
  {
    name: homeStaff,
    services: services.filter((service) => service.category === homeStaff),
  },
  {
    name: edutech,
    services: services.filter((service) => service.category === edutech),
  },
  {
    name: professionalServices,
    services: services.filter(
      (service) => service.category === professionalServices,
    ),
  },
];