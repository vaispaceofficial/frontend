
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Activity,
  GraduationCap,
  Armchair,
  CarFront,
  Wrench,
  Car,
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
} from "lucide-react";

import "./CityListingsPage.css";
import CityListingsShowcase from "../components/CityListingsShowcase";
import CityBusinessProfileModal from "../components/CityBusinessProfileModal";
import type { BusinessProfile } from "../components/CityBusinessProfileModal";

export type ListingCategory = {
  id: string;
  name: string;
  icon: typeof Activity;
  description: string;
  tags: string[];
};

type ListingFilter = "all" | "top-rated" | "verified" | "open";

export type CityListing = {
  id: number;
  name: string;
  category: string;
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

export const categories: ListingCategory[] = [
  {
    id: "health",
    name: "Health & Medical",
    icon: Activity,
    description:
      "Discover doctors, clinics, diagnostic centres and hospitals.",
    tags: [
      "All Specialities",
      "Orthopaedic Doctors",
      "Gynaecology",
      "Hospitals",
      "Multi-Speciality",
    ],
  },
  {
    id: "education",
    name: "Education & Colleges",
    icon: GraduationCap,
    description:
      "Explore schools, colleges, coaching centres and universities.",
    tags: [
      "All Specialities",
      "Schools",
      "Engineering Colleges",
      "Coaching Centres",
      "Universities",
    ],
  },
  {
    id: "interior",
    name: "Interior & Civil",
    icon: Armchair,
    description:
      "Find interior designers, architects, builders and civil contractors.",
    tags: [
      "All Specialities",
      "Interior Designers",
      "Architects",
      "Civil Contractors",
      "Builders",
    ],
  },
  {
    id: "showrooms",
    name: "Car Showrooms",
    icon: CarFront,
    description:
      "Explore automobile dealerships and vehicle showrooms.",
    tags: [
      "All Specialities",
      "Car Dealers",
      "New Cars",
      "Used Cars",
      "Electric Vehicles",
    ],
  },
  {
    id: "car-services",
    name: "Car Services",
    icon: Wrench,
    description:
      "Find automobile repair, maintenance and servicing businesses.",
    tags: [
      "All Specialities",
      "Car Repair",
      "Car Wash",
      "Servicing",
      "Roadside Assistance",
    ],
  },
  {
    id: "car-interiors",
    name: "Car Interiors",
    icon: Car,
    description:
      "Discover car accessories, seat covers and interior specialists.",
    tags: [
      "All Specialities",
      "Seat Covers",
      "Car Accessories",
      "Car Audio",
      "Interior Customisation",
    ],
  },
];

export const listings: CityListing[] = [
  {
    id: 1,
    name: "City Orthopaedic Care",
    category: "health",
    label: "Orthopaedic Doctors",
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
    products: [
      "Women's Wellness Products",
      "Healthcare Essentials",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=85",
    ],
  },
  {
    id: 3,
    name: "City Multi-Speciality Centre",
    category: "health",
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
    label: "Education & Coaching",
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
    label: "Interior Design",
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
    category: "showrooms",
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
    category: "car-services",
    label: "Car Services",
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
    category: "car-interiors",
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

function CityListingsPage() {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFilter, setActiveFilter] = useState<ListingFilter>("all");
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All Specialities");
  const [selectedListing, setSelectedListing] =
    useState<CityListing | null>(null);

  const selectedCategory = categories.find(
    (category) => category.id === activeCategory,
  );

  const availableTags = selectedCategory?.tags ?? [
    "All Specialities",
    "Top Rated",
    "Verified Only",
    "Open Now",
  ];

  const filteredListings = useMemo(() => {
    const term = search.trim().toLowerCase();

    return listings.filter((listing) => {
      const category = categories.find(
        (item) => item.id === listing.category,
      );

      const matchesCategory =
        activeCategory === "all" ||
        listing.category === activeCategory;

      const matchesSearch =
        !term ||
        [
          listing.name,
          listing.label,
          listing.description,
          listing.location,
          category?.name ?? "",
        ].some((value) => value.toLowerCase().includes(term));

      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "top-rated" && listing.rating >= 4.7) ||
        (activeFilter === "verified" && listing.verified === true) ||
        (activeFilter === "open" && listing.openNow === true);

      const matchesTag =
        activeTag === "All Specialities" ||
        (activeTag === "Top Rated" && listing.rating >= 4.7) ||
        (activeTag === "Verified Only" && listing.verified === true) ||
        (activeTag === "Open Now" && listing.openNow === true) ||
        listing.label.toLowerCase().includes(activeTag.toLowerCase());

      return (
        matchesCategory &&
        matchesSearch &&
        matchesFilter &&
        matchesTag
      );
    });
  }, [activeCategory, activeFilter, activeTag, search]);

  const chooseCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    setActiveFilter("all");
    setActiveTag("All Specialities");
  };

  const chooseFilter = (filter: ListingFilter, tag: string) => {
    setActiveFilter(filter);
    setActiveTag(tag);
  };

  const resetFilters = () => {
    setActiveCategory("all");
    setActiveFilter("all");
    setActiveTag("All Specialities");
    setSearch("");
  };

  const closeProfile = useCallback(() => {
    setSelectedListing(null);
  }, []);

  const modalListing: BusinessProfile | null = selectedListing
    ? {
        id: selectedListing.id,
        name: selectedListing.name,
        category:
          categories.find(
            (category) => category.id === selectedListing.category,
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
              Explore verified local businesses, healthcare specialists,
              auto showrooms, educational institutions, and interior
              services — right at your fingertips.
            </p>

            <form
              className="city-listings-search"
              onSubmit={(event) => {
                event.preventDefault();
                document
                  .getElementById("city-listing-results")
                  ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
              }}
            >
              <Search size={20} aria-hidden="true" />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search doctors, cars, interiors, services..."
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
          </div>

          <CityListingsShowcase />
        </section>

        {/* CATEGORIES */}
        <section className="city-listings-section">
          <div className="city-listings-section-header">
            <div>
              <h2>Explore Categories</h2>
              <p>
                Browse businesses and services by category to find what
                you need in your city.
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
                aria-label="View all city listings"
              >
                View All
                <ArrowRight size={17} />
              </button>
            </div>
          </div>

          <div
            className="city-listings-filters"
            role="group"
            aria-label="Business categories"
          >
            <button
              type="button"
              className={activeCategory === "all" ? "active" : ""}
              onClick={() => chooseCategory("all")}
              aria-pressed={activeCategory === "all"}
            >
              <LayoutGrid size={15} />
              All Listings
            </button>

            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <button
                  type="button"
                  key={category.id}
                  className={
                    activeCategory === category.id ? "active" : ""
                  }
                  onClick={() => chooseCategory(category.id)}
                  aria-pressed={activeCategory === category.id}
                >
                  <Icon size={15} />
                  {category.name}
                </button>
              );
            })}
          </div>

          <div className="city-listings-subcategory">
            <span className="city-listings-subcategory-label">
              SUB-CATEGORIES
            </span>

            <div
              className="city-listings-filters city-listings-subfilters"
              role="group"
              aria-label="Listing filters"
            >
              {availableTags.map((tag) => {
                let filter: ListingFilter = "all";

                if (tag === "Top Rated") filter = "top-rated";
                if (tag === "Verified Only") filter = "verified";
                if (tag === "Open Now") filter = "open";

                const isActive =
                  activeTag === tag && activeFilter === filter;

                return (
                  <button
                    type="button"
                    key={tag}
                    className={isActive ? "active" : ""}
                    onClick={() => chooseFilter(filter, tag)}
                    aria-pressed={isActive}
                  >
                    {tag === "Top Rated" && <Star size={13} />}
                    {tag === "Verified Only" && (
                      <BadgeCheck size={14} />
                    )}
                    {tag === "Open Now" && <Clock3 size={13} />}
                    {tag}
                  </button>
                );
              })}

              {activeCategory !== "all" && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveFilter("all");
                    setActiveTag("All Specialities");
                  }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </section>

        {/* LISTING RESULTS */}
        <section
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
              <button type="button" onClick={resetFilters}>
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
            onClick={() =>
              window.alert(
                "Business registration can be connected when the registration page is ready.",
              )
            }
          >
            List Your Business
            <ArrowRight size={17} />
          </button>
        </section>
      </div>

      {/* SEPARATE BUSINESS PROFILE MODAL */}
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
