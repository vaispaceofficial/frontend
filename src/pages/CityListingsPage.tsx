
import { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Activity,
  GraduationCap,
  Armchair,
  CarFront,
  Search,
  MapPin,
  Star,
  ArrowRight,
  Building2,
  LayoutGrid,
  BadgeCheck,
  Clock3,
  X,
  CheckCircle2,
  HardHat,
  BriefcaseBusiness,
  ShieldCheck,
  Hotel,
  Plane,
  Monitor,
  Factory,
  Sparkles,
  Store,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import "./CityListingsPage.css";
import CityListingsShowcase from "../components/CityListingsShowcase";
import CityBusinessProfileModal from "../components/CityBusinessProfileModal";
import type { BusinessProfile } from "../components/CityBusinessProfileModal";

type ListingFilter = "all" | "top-rated" | "verified" | "open";

export type ListingCategory = {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  tags: string[];
  subcategories: string[];
};

export type CityListing = {
  id: number;
  name: string;
  category: string;
  subcategory?: string;
  label: string;
  description: string;
  rating: number;
  reviews: number;
  location: string;
  phone: string;
  email: string;
  image: string;
  verified?: boolean;
  openNow?: boolean;
  about: string;
  hours: { days: string; time: string }[];
  amenities: string[];
  services: string[];
  products: string[];
  gallery: string[];
};

/* =========================================================
   CATEGORIES
========================================================= */

export const categories: ListingCategory[] = [
  {
    id: "health",
    name: "Health & Medical Care",
    icon: Activity,
    description:
      "Discover doctors, clinics, diagnostic centres and hospitals.",
    tags: ["All Specialities", "Top Rated", "Verified Only", "Open Now"],
    subcategories: [
      "Hospitals & Clinics",
      "Specialized Clinics",
      "Ayurveda & Homeopathy",
      "Medical Supplies & Services",
      "Diagnostic Centres",
    ],
  },
  {
    id: "education",
    name: "Education, Coaching & Institutes",
    icon: GraduationCap,
    description:
      "Explore schools, colleges, coaching centres and educational institutes.",
    tags: ["All Specialities", "Top Rated", "Verified Only", "Open Now"],
    subcategories: [
      "Schools & Play Preschools",
      "Colleges & Universities",
      "Competitive Coaching",
      "Coaching Centres",
      "IT & Tech Training Institutes",
      "Non-IT & Skill Institutes",
      "Tutions & Academics",
    ],
  },
  {
    id: "real-estate",
    name: "Real Estate & Property",
    icon: Building2,
    description:
      "Find property dealers, real estate consultants and property services.",
    tags: ["All Specialities", "Top Rated", "Verified Only", "Open Now"],
    subcategories: [
      "Property Sales",
      "Rentals & Leasing",
      "Property Services",
    ],
  },
  {
    id: "civil-construction",
    name: "Civil Works, Construction & Heavy Equipment",
    icon: HardHat,
    description:
      "Connect with builders, civil contractors and construction specialists.",
    tags: ["All Specialities", "Top Rated", "Verified Only", "Open Now"],
    subcategories: [
      "Construction & Building",
      "Architects & Engineers",
      "Construction Companies",
      "Elevators & Lifts",
      "Building Material Suppliers",
      "Heavy Equipment Services",
    ],
  },
  {
    id: "interior",
    name: "Home Interiors & Architecture",
    icon: Armchair,
    description:
      "Discover interior designers, architects and home improvement specialists.",
    tags: ["All Specialities", "Top Rated", "Verified Only", "Open Now"],
    subcategories: [
      "Interior Designers",
      "Modular & Furniture",
      "Glass, Aluminium & Steel Works",
      "Decor & Furnishings",
    ],
  },
  {
    id: "professional-business",
    name: "Professional & Business Services",
    icon: BriefcaseBusiness,
    description:
      "Find professional consultants and business support services.",
    tags: ["All Specialities", "Top Rated", "Verified Only", "Open Now"],
    subcategories: [
      "FInancial & Legal",
      "Business Registration & ISO",
      "Financial Services",
    ],
  },
  {
    id: "it-security",
    name: "IT, Hardware & Security Solutions",
    icon: Monitor,
    description:
      "Explore IT companies, computer services and security solutions.",
    tags: ["All Specialities", "Top Rated", "Verified Only", "Open Now"],
    subcategories: [
      "Computer & Laptop Repair",
      "Networking & IT Infrastructure",
      "Security & Automation",
    ],
  },
  {
    id: "events-media",
    name: "Events, Entertainment & Media",
    icon: Sparkles,
    description:
      "Discover event planners, photographers and entertainment services.",
    tags: ["All Specialities", "Top Rated", "Verified Only", "Open Now"],
    subcategories: [
      "Event Planners",
      "Photography & Video",
      "Event Vendors",
    ],
  },
  {
    id: "travel-logistics",
    name: "Travel, Transport & Logistics",
    icon: Plane,
    description:
      "Find travel agencies, transport providers and logistics services.",
    tags: ["All Specialities", "Top Rated", "Verified Only", "Open Now"],
    subcategories: [
      "Travel Agencies",
      "Tansport & Vehicle Rental",
      "Logistics & Moving",
    ],
  },
  {
    id: "automotive",
    name: "Automotive (Vehicle) Services",
    icon: CarFront,
    description:
      "Explore vehicle showrooms, repair shops and automotive specialists.",
    tags: ["All Specialities", "Top Rated", "Verified Only", "Open Now"],
    subcategories: [
      "Car Care",
      "BIke Care ",
      "Dealerships",
    ],
  },
  {
    id: "industrial",
    name: "Industrial & Manufacturing",
    icon: Factory,
    description:
      "Connect with manufacturers, industrial suppliers and engineering firms.",
    tags: ["All Specialities", "Top Rated", "Verified Only", "Open Now"],
    subcategories: [
      "Machinery & Tools",
      "Printing & Packaging",
    ],
  },
  {
    id: "hotel-bookings",
    name: "Hotel Industry Bookings",
    icon: Hotel,
    description:
      "Discover hotels, resorts and accommodation booking services.",
    tags: ["All Specialities", "Top Rated", "Verified Only", "Open Now"],
    subcategories: [
      "Hotels",
      "Resorts",
      "Budget Stays",
      "Luxury Stays",
      "Service Apartments",
      "Guest Houses",
      "Banquet Halls",
      "Online Booking Services",
    ],
  },
  {
    id: "find-my-property",
    name: "Find My Property",
    icon: Building2,
    description: "Discover homes, offices and investment properties to buy, rent or lease.",
    tags: ["Buy", "Rent", "Lease"],
    subcategories: ["Residential", "Commercial", "Apartments", "Independent Houses", "Office Spaces"],
  },
];

/* =========================================================
   LISTINGS
========================================================= */

export const listings: CityListing[] = [
  {
    id: 1,
    name: "City Orthopaedic Care",
    category: "health",
    subcategory: "Orthopaedic Clinics",
    label: "Orthopaedic Clinics",
    description: "Consultations for bone, joint and orthopaedic care.",
    rating: 4.8,
    reviews: 142,
    location: "MVP Colony, Visakhapatnam",
    phone: "",
    email: "care@cityortho.example",
    verified: true,
    openNow: true,
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=85",
    about:
      "City Orthopaedic Care provides specialised consultations for bone, joint and musculoskeletal conditions. The clinic focuses on patient care, treatment planning and rehabilitation support.",
    hours: [
      { days: "Mon – Sat", time: "09:00 AM – 08:30 PM" },
      { days: "Sunday", time: "10:00 AM – 01:30 PM" },
    ],
    amenities: [
      "Joint Replacement",
      "Sports Injury Care",
      "X-Ray On-site",
      "Wheelchair Accessible",
      "Digital Prescriptions",
    ],
    services: [
      "Orthopaedic Consultation",
      "Joint Pain Assessment",
      "Sports Injury Consultation",
      "Fracture Care",
      "Rehabilitation Guidance",
    ],
    products: [
      "Orthopaedic Supports",
      "Knee Braces",
      "Rehabilitation Aids",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=85",
    ],
  },
  {
    id: 2,
    name: "Women's Wellness Clinic",
    category: "health",
    subcategory: "Gynaecology",
    label: "Gynaecology",
    description: "Women's health consultations and specialist care.",
    rating: 4.7,
    reviews: 98,
    location: "Madhurawada, Visakhapatnam",
    phone: "",
    email: "",
    verified: true,
    openNow: false,
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=85",
    about:
      "Women's Wellness Clinic offers women's health consultations, preventive care and general gynaecology services in a welcoming clinical environment.",
    hours: [
      { days: "Mon – Sat", time: "09:00 AM – 07:00 PM" },
      { days: "Sunday", time: "Closed" },
    ],
    amenities: [
      "Private Consultation",
      "Preventive Care",
      "Patient Counselling",
      "Appointment Support",
    ],
    services: [
      "Gynaecology Consultation",
      "Women's Wellness Check",
      "Preventive Health Guidance",
      "General Health Consultation",
    ],
    products: ["Women's Wellness Products", "Healthcare Essentials"],
    gallery: [
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=85",
    ],
  },
  {
    id: 3,
    name: "City Multi-Speciality Centre",
    category: "health",
    subcategory: "Hospitals",
    label: "Hospitals",
    description: "Outpatient consultations and diagnostic services.",
    rating: 4.6,
    reviews: 210,
    location: "Gajuwaka, Visakhapatnam",
    phone: "",
    email: "",
    verified: true,
    openNow: true,
    image:
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=85",
    about:
      "City Multi-Speciality Centre offers outpatient consultations and general diagnostic services for patients and families.",
    hours: [
      { days: "Mon – Sat", time: "08:00 AM – 09:00 PM" },
      { days: "Sunday", time: "09:00 AM – 02:00 PM" },
    ],
    amenities: [
      "Outpatient Services",
      "Diagnostic Support",
      "Patient Assistance",
      "Accessible Facilities",
    ],
    services: [
      "General Consultation",
      "Specialist Consultation",
      "Health Check-ups",
      "Diagnostic Services",
    ],
    products: ["Medical Supplies", "Healthcare Essentials"],
    gallery: [
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=85",
    ],
  },
  {
    id: 4,
    name: "Bright Future Academy",
    category: "education",
    subcategory: "Coaching Centres",
    label: "Coaching Centres",
    description: "Academic learning and examination preparation.",
    rating: 4.7,
    reviews: 86,
    location: "Dwaraka Nagar, Visakhapatnam",
    phone: "",
    email: "",
    verified: true,
    openNow: true,
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=85",
    about:
      "Bright Future Academy provides academic learning support and structured preparation for students pursuing educational and competitive goals.",
    hours: [
      { days: "Mon – Sat", time: "08:00 AM – 07:00 PM" },
      { days: "Sunday", time: "By appointment" },
    ],
    amenities: [
      "Classroom Learning",
      "Study Resources",
      "Student Counselling",
      "Exam Preparation",
    ],
    services: [
      "Academic Coaching",
      "Exam Preparation",
      "Student Guidance",
      "Foundation Courses",
    ],
    products: ["Study Materials", "Learning Resources"],
    gallery: [
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=85",
    ],
  },
  {
    id: 5,
    name: "Modern Space Interiors",
    category: "interior",
    subcategory: "Interior Designers",
    label: "Interior Designers",
    description: "Residential interiors, planning and renovation.",
    rating: 4.6,
    reviews: 64,
    location: "Siripuram, Visakhapatnam",
    phone: "",
    email: "",
    verified: true,
    openNow: true,
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
    about:
      "Modern Space Interiors helps homeowners plan stylish and functional living spaces, from interior concepts to renovation and finishing.",
    hours: [
      { days: "Mon – Sat", time: "10:00 AM – 07:00 PM" },
      { days: "Sunday", time: "By appointment" },
    ],
    amenities: [
      "3D Design Concepts",
      "Space Planning",
      "Material Guidance",
      "Renovation Planning",
    ],
    services: [
      "Home Interior Design",
      "Kitchen Design",
      "Living Room Design",
      "Renovation Consultation",
    ],
    products: ["Furniture", "Lighting", "Interior Finishes"],
    gallery: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
    ],
  },
  {
    id: 6,
    name: "City Auto Showroom",
    category: "automotive",
    subcategory: "Car Showrooms",
    label: "Car Showrooms",
    description: "Explore vehicles and automobile dealership services.",
    rating: 4.5,
    reviews: 72,
    location: "Madhurawada, Visakhapatnam",
    phone: "",
    email: "",
    verified: false,
    openNow: true,
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=85",
    about:
      "City Auto Showroom helps customers explore vehicle options and learn about available dealership services.",
    hours: [
      { days: "Mon – Sat", time: "09:30 AM – 08:00 PM" },
      { days: "Sunday", time: "10:00 AM – 06:00 PM" },
    ],
    amenities: [
      "Vehicle Display",
      "Test Drive Enquiries",
      "Sales Consultation",
      "Customer Assistance",
    ],
    services: [
      "New Vehicle Enquiries",
      "Vehicle Comparison",
      "Test Drive Enquiries",
      "Sales Consultation",
    ],
    products: ["Passenger Cars", "SUVs", "Electric Vehicles"],
    gallery: [
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85",
    ],
  },
  {
    id: 7,
    name: "Reliable Auto Care",
    category: "automotive",
    subcategory: "Vehicle Servicing",
    label: "Vehicle Servicing",
    description: "Vehicle maintenance, inspections and repairs.",
    rating: 4.6,
    reviews: 91,
    location: "Gajuwaka, Visakhapatnam",
    phone: "",
    email: "",
    verified: true,
    openNow: true,
    image:
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1200&q=85",
    about:
      "Reliable Auto Care offers vehicle maintenance, inspections and general repair services to help keep cars in good working condition.",
    hours: [
      { days: "Mon – Sat", time: "09:00 AM – 07:00 PM" },
      { days: "Sunday", time: "09:00 AM – 01:00 PM" },
    ],
    amenities: [
      "Vehicle Inspection",
      "Maintenance Support",
      "Repair Consultation",
      "Customer Waiting Area",
    ],
    services: [
      "Periodic Car Service",
      "Vehicle Inspection",
      "Brake Check",
      "General Repairs",
    ],
    products: ["Car Care Products", "Vehicle Accessories"],
    gallery: [
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1486006920555-c77dcf18193b?auto=format&fit=crop&w=1200&q=85",
    ],
  },
  {
    id: 8,
    name: "Auto Style Studio",
    category: "automotive",
    subcategory: "Car Interiors",
    label: "Car Interiors",
    description: "Interior accessories and vehicle customisation.",
    rating: 4.5,
    reviews: 48,
    location: "MVP Colony, Visakhapatnam",
    phone: "",
    email: "",
    verified: false,
    openNow: false,
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85",
    about:
      "Auto Style Studio specialises in vehicle interior upgrades, accessories and personalisation options for car owners.",
    hours: [
      { days: "Mon – Sat", time: "10:00 AM – 07:00 PM" },
      { days: "Sunday", time: "Closed" },
    ],
    amenities: [
      "Interior Consultation",
      "Accessory Selection",
      "Customisation Options",
      "Installation Support",
    ],
    services: [
      "Seat Cover Installation",
      "Interior Customisation",
      "Car Audio Upgrades",
      "Accessory Installation",
    ],
    products: ["Seat Covers", "Car Audio", "Floor Mats", "Accessories"],
    gallery: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=85",
    ],
  },
];

/* =========================================================
   CATEGORY CAROUSEL ITEM
   Decorative duplicate used for seamless marquee looping.
========================================================= */

type CategoryCarouselItemProps = {
  category: ListingCategory;
};

function CategoryCarouselItem({
  category,
}: CategoryCarouselItemProps) {
  const Icon = category.icon;

  return (
    <span className="city-listings-category-item">
      <Icon size={16} aria-hidden="true" />
      {category.name}
    </span>
  );
}

/* =========================================================
   PAGE COMPONENT
========================================================= */

function CityListingsPage() {
  const navigate = useNavigate();
  const listingsRef = useRef<HTMLElement | null>(null);

  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFilter, setActiveFilter] = useState<ListingFilter>("all");
  const [activeSubcategory, setActiveSubcategory] =
    useState("All Specialities");
  const [search, setSearch] = useState("");
  const [selectedListing, setSelectedListing] =
    useState<CityListing | null>(null);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === activeCategory),
    [activeCategory],
  );

  const scrollToListings = useCallback(() => {
    window.requestAnimationFrame(() => {
      listingsRef.current?.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    });
  }, []);

  /* ---------------------------------------------------------
     FILTER LISTINGS
  --------------------------------------------------------- */

  const filteredListings = useMemo(() => {
    const term = search.trim().toLowerCase();

    return listings.filter((listing) => {
      const category = categories.find(
        (item) => item.id === listing.category,
      );

      const searchableValues = [
        listing.name,
        listing.label,
        listing.description,
        listing.location,
        listing.category,
        listing.subcategory ?? "",
        category?.name ?? "",
        ...listing.services,
        ...listing.products,
      ];

      const matchesSearch =
        !term ||
        searchableValues.some((value) =>
          value.toLowerCase().includes(term),
        );

      const matchesCategory =
        activeCategory === "all" ||
        listing.category === activeCategory;

      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "top-rated" && listing.rating >= 4.7) ||
        (activeFilter === "verified" && listing.verified === true) ||
        (activeFilter === "open" && listing.openNow === true);

      const matchesSubcategory =
        activeSubcategory === "All Specialities" ||
        listing.subcategory?.toLowerCase() ===
        activeSubcategory.toLowerCase() ||
        (!listing.subcategory &&
          listing.label.toLowerCase() ===
          activeSubcategory.toLowerCase());

      return (
        matchesSearch &&
        matchesCategory &&
        matchesFilter &&
        matchesSubcategory
      );
    });
  }, [
    activeCategory,
    activeFilter,
    activeSubcategory,
    search,
  ]);

  /* ---------------------------------------------------------
     FILTER ACTIONS
  --------------------------------------------------------- */


  const chooseCategory = useCallback(
    (categoryId: string) => {
      setActiveCategory(categoryId);
      setActiveFilter("all");
      setActiveSubcategory("All Specialities");
      scrollToListings();
    },
    [scrollToListings],
  );


  const chooseFilter = useCallback(
    (filter: ListingFilter) => {
      setActiveFilter(filter);
      scrollToListings();
    },
    [scrollToListings],
  );

  const resetFilters = useCallback(() => {
    setActiveCategory("all");
    setActiveFilter("all");
    setActiveSubcategory("All Specialities");
    setSearch("");
    scrollToListings();
  }, [scrollToListings]);

  const closeProfile = useCallback(() => {
    setSelectedListing(null);
  }, []);

  /* ---------------------------------------------------------
     MODAL DATA
  --------------------------------------------------------- */

  const modalListing: BusinessProfile | null = selectedListing
    ? {
      id: selectedListing.id,
      name: selectedListing.name,
      category:
        categories.find(
          (category) =>
            category.id === selectedListing.category,
        )?.name ?? "Business",
      label: selectedListing.label,
      description: selectedListing.description,
      rating: selectedListing.rating,
      location: selectedListing.location,
      phone: selectedListing.phone,
      image: selectedListing.image,
      verified: selectedListing.verified,
      openNow: selectedListing.openNow,
      reviewCount: selectedListing.reviews,
      email: selectedListing.email,
      about: selectedListing.about,
      hours: selectedListing.hours.map((item) => ({
        day: item.days,
        time: item.time,
      })),
      amenities: selectedListing.amenities,
      services: selectedListing.services,
      gallery: selectedListing.gallery,
    }
    : null;

  /* ---------------------------------------------------------
     RENDER
  --------------------------------------------------------- */

  return (
    <main className="city-listings-page">
      <div className="city-listings-container">
        {/* HERO */}

        <section className="city-listings-hero">
          <div className="city-listings-hero-copy">
            <span className="city-listings-eyebrow">
              <Building2 size={15} />
              YOUR CITY. YOUR DIRECTORY.
            </span>

            <h1>
              Discover Your City,
              <span>All in One Place.</span>
            </h1>

            <p>
              Explore local businesses, healthcare specialists, auto
              showrooms, educational institutions and professional services
              — right at your fingertips.
            </p>

            <form
              className="city-listings-search"
              onSubmit={(event) => {
                event.preventDefault();
                scrollToListings();
              }}
            >
              <Search size={20} aria-hidden="true" />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search businesses, services, locations..."
                aria-label="Search city listings"
              />

              {search && (
                <button
                  type="button"
                  className="city-search-clear"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}

              <span className="city-listings-location">
                <MapPin size={16} />
                All Locations
              </span>

              <button type="submit">
                Explore
                <ArrowRight size={15} />
              </button>
            </form>


            <div className="city-listings-trust">
              <span className="city-listings-trust-item">
                <BadgeCheck size={15} />
                Verified Local Profiles
              </span>

              <span className="city-listings-trust-divider">•</span>

              <span className="city-listings-trust-item reviews">
                <Star size={15} fill="currentColor" />
                Customer Reviews
              </span>
            </div>



            {/* BUSINESS REGISTRATION BUTTON */}
            <div className="city-listings-hero-register">
              <button
                type="button"
                className="city-listings-register-button"
                aria-label="Register as a Business Listing"
                onClick={() => navigate("/register-vendor")}
              >
                <Store size={20} strokeWidth={1.9} />

                <span>Register as a Business Listing</span>

                <ArrowRight size={16} />
              </button>

              <p className="city-listings-register-caption">
                Grow your business. Reach more customers.
              </p>
            </div>



          </div>

          <CityListingsShowcase />
        </section>

        {/* CATEGORIES AND FILTERS */}

        <section className="city-listings-section">
          <div className="city-listings-section-header">
            <div>
              <h2>Explore Categories</h2>
              <p>
                Browse businesses and services by category to find what you
                need in your city.
              </p>
            </div>

            <div className="city-listings-header-actions">
              <span className="city-listings-count">
                Showing {filteredListings.length}{" "}
                {filteredListings.length === 1 ? "listing" : "listings"}
              </span>

              <button
                type="button"
                className="city-listings-view-all"
                onClick={() =>
                  navigate("/city-listings-explore/browse")
                }
              >
                View All
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* CATEGORY MARQUEE */}

          <div
            className="city-listings-category-marquee"
            role="group"
            aria-label="Business categories"
          >
            {/* FIXED LEFT: ALL LISTINGS */}

            <div className="city-listings-fixed-category">
              <button
                type="button"
                className={`city-listings-category-item ${activeCategory === "all" ? "active" : ""
                  }`}
                onClick={() => chooseCategory("all")}
                aria-pressed={activeCategory === "all"}
              >
                <LayoutGrid size={16} aria-hidden="true" />
                All Listings
              </button>
            </div>

            {/* MOVING RIGHT: OTHER CATEGORIES */}

            <div className="city-listings-category-scroll">
              <div className="city-listings-category-track">
                {/* Interactive group */}

                <div className="city-listings-category-group">
                  {categories.map((category) => {
                    const Icon = category.icon;

                    return (
                      <button
                        type="button"
                        key={category.id}
                        className={`city-listings-category-item ${activeCategory === category.id
                          ? "active"
                          : ""
                          }`}
                        onClick={() =>
                          chooseCategory(category.id)
                        }
                        aria-pressed={
                          activeCategory === category.id
                        }
                      >
                        <Icon size={16} aria-hidden="true" />
                        {category.name}
                      </button>
                    );
                  })}
                </div>

                {/* Decorative group for seamless looping */}

                <div
                  className="city-listings-category-group"
                  aria-hidden="true"
                >
                  {categories.map((category) => (
                    <CategoryCarouselItem
                      key={`duplicate-${category.id}`}
                      category={category}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* GENERAL FILTERS */}

          <div className="city-listings-subcategory">
            <span className="city-listings-subcategory-label">
              FILTER BY
            </span>

            <div
              className="city-listings-filters city-listings-subfilters"
              role="group"
              aria-label="Listing filters"
            >
              <button
                type="button"
                className={activeFilter === "all" ? "active" : ""}
                onClick={() => chooseFilter("all")}
                aria-pressed={activeFilter === "all"}
              >
                <LayoutGrid size={14} />
                All
              </button>

              <button
                type="button"
                className={
                  activeFilter === "top-rated" ? "active" : ""
                }
                onClick={() => chooseFilter("top-rated")}
                aria-pressed={activeFilter === "top-rated"}
              >
                <Star size={13} />
                Top Rated
              </button>

              <button
                type="button"
                className={
                  activeFilter === "verified" ? "active" : ""
                }
                onClick={() => chooseFilter("verified")}
                aria-pressed={activeFilter === "verified"}
              >
                <ShieldCheck size={14} />
                Verified Only
              </button>

              <button
                type="button"
                className={
                  activeFilter === "open" ? "active" : ""
                }
                onClick={() => chooseFilter("open")}
                aria-pressed={activeFilter === "open"}
              >
                <Clock3 size={13} />
                Open Now
              </button>

              {(activeCategory !== "all" ||
                activeFilter !== "all" ||
                activeSubcategory !== "All Specialities" ||
                search.trim() !== "") && (
                  <button
                    type="button"
                    onClick={resetFilters}
                  >
                    <X size={13} />
                    Reset Filters
                  </button>
                )}
            </div>
          </div>
        </section>

        {/* LISTING RESULTS */}

        <section
          ref={listingsRef}
          className="city-listings-results city-listings-section"
          id="city-listing-results"
          aria-label="Business listings"
        >
          <div className="city-listings-section-header">
            <div>
              <h2>
                {selectedCategory?.name ?? "Explore Listings"}
              </h2>

              <p>
                {selectedCategory?.description ??
                  "Discover businesses and services around your city."}
              </p>
            </div>
          </div>

          {filteredListings.length > 0 ? (
            <div className="city-listings-results-grid">
              {filteredListings.map((listing) => {
                const category = categories.find(
                  (item) => item.id === listing.category,
                );

                const Icon = category?.icon ?? Building2;

                return (
                  <article
                    className="city-listings-result-card"
                    key={listing.id}
                  >
                    <button
                      type="button"
                      className="city-listings-result-image"
                      onClick={() => setSelectedListing(listing)}
                      aria-label={`View ${listing.name} profile`}
                    >
                      <img
                        src={listing.image}
                        alt={listing.label}
                        loading="lazy"
                      />

                      <span className="city-listing-label">
                        {listing.label}
                      </span>

                      {listing.verified && (
                        <span className="city-listing-verified">
                          <CheckCircle2 size={13} />
                          Verified
                        </span>
                      )}

                      <span className="city-listing-rating">
                        <Star size={13} fill="currentColor" />
                        {listing.rating.toFixed(1)}
                        <small>({listing.reviews})</small>
                      </span>
                    </button>

                    <div className="city-listings-result-content">
                      <div className="city-listings-result-title-row">
                        <div>
                          <h3>{listing.name}</h3>

                          <span className="city-listing-category">
                            {category?.name ?? "Business"}
                          </span>
                        </div>

                        <span
                          className="city-listing-avatar"
                          aria-hidden="true"
                        >
                          <Icon size={19} />
                        </span>
                      </div>

                      <p>{listing.description}</p>

                      <div className="city-listing-location">
                        <MapPin size={14} />
                        <span>{listing.location}</span>
                      </div>

                      <button
                        type="button"
                        className="city-listings-profile-link"
                        onClick={() => setSelectedListing(listing)}
                      >
                        View Business Profile
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="city-listings-empty">
              <Search size={32} />

              <h3>No matching listings found</h3>

              <p>
                Try a different search, category or filter to find more
                local businesses.
              </p>

              <button
                type="button"
                onClick={resetFilters}
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {/* BUSINESS REGISTRATION CTA */}

        <section className="city-listings-cta">
          <div>
            <span>FOR LOCAL BUSINESSES</span>
            <h2>Want to list your business?</h2>
            <p>
              Help people discover your business through OneService City
              Listings.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/join-our-network")}
          >
            List Your Business
            <ArrowRight size={17} />
          </button>
        </section>
      </div>

      {/* BUSINESS PROFILE MODAL */}

      {modalListing && (
        <CityBusinessProfileModal
          listing={modalListing}
          onClose={closeProfile}
        />
      )}
    </main>
  );
}

export default CityListingsPage;
