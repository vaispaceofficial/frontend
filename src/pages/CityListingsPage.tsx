import { useMemo, useState } from "react";
import {
  Activity,
  GraduationCap,
  Armchair,
  CarFront,
  Wrench,
  Car,
  Search,
  MapPin,
  Phone,
  Star,
  ArrowUpRight,
  Building2,
} from "lucide-react";

import "./CityListingsPage.css";
import CityListingsShowcase from "../components/CityListingsShowcase";

type ListingCategory = {
  id: string;
  name: string;
  icon: typeof Activity;
  description: string;
  tags: string[];
};

type CityListing = {
  id: number;
  name: string;
  category: string;
  label: string;
  description: string;
  rating: number;
  location: string;
  phone: string;
  image: string;
};

const categories: ListingCategory[] = [
  {
    id: "health",
    name: "Health & Medical",
    icon: Activity,
    description: "Doctors, clinics, diagnostic centres and hospitals.",
    tags: [
      "Orthopaedic Doctors",
      "Neuro Specialists",
      "Gynaecology",
      "Multi-Speciality",
      "Hospitals",
    ],
  },
  {
    id: "education",
    name: "Education & Colleges",
    icon: GraduationCap,
    description:
      "Schools, colleges, coaching centres and educational institutions.",
    tags: [
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
      "Interior designers, architects, builders and civil contractors.",
    tags: ["Interior Designers", "Architects", "Civil Contractors", "Builders"],
  },
  {
    id: "showrooms",
    name: "Car Showrooms",
    icon: CarFront,
    description: "Explore automobile dealerships and vehicle showrooms.",
    tags: ["Car Dealers", "New Cars", "Used Cars", "Electric Vehicles"],
  },
  {
    id: "car-services",
    name: "Car Services",
    icon: Wrench,
    description:
      "Find automobile repair, maintenance and servicing businesses.",
    tags: ["Car Repair", "Car Wash", "Servicing", "Roadside Assistance"],
  },
  {
    id: "car-interiors",
    name: "Car Interiors",
    icon: Car,
    description:
      "Discover car accessories, seat covers and interior specialists.",
    tags: [
      "Seat Covers",
      "Car Accessories",
      "Car Audio",
      "Interior Customisation",
    ],
  },
];

const listings: CityListing[] = [
  {
    id: 1,
    name: "City Orthopaedic Care",
    category: "health",
    label: "Orthopaedic Specialist",
    description: "Consultations for bone, joint and orthopaedic care.",
    rating: 4.8,
    location: "Add business location",
    phone: "",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    name: "Women's Wellness Clinic",
    category: "health",
    label: "Gynaecology & Women's Health",
    description: "Women's health consultations and specialist care.",
    rating: 4.7,
    location: "Add business location",
    phone: "",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    name: "City Multi-Speciality Centre",
    category: "health",
    label: "Multi-Speciality Clinic",
    description: "Outpatient consultations and diagnostic services.",
    rating: 4.6,
    location: "Add business location",
    phone: "",
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    name: "Bright Future Academy",
    category: "education",
    label: "Education & Coaching",
    description: "Academic learning and examination preparation.",
    rating: 4.7,
    location: "Add business location",
    phone: "",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 5,
    name: "Modern Space Interiors",
    category: "interior",
    label: "Interior Design",
    description: "Residential interiors, planning and renovation.",
    rating: 4.6,
    location: "Add business location",
    phone: "",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    name: "City Auto Showroom",
    category: "showrooms",
    label: "Automobile Dealership",
    description: "Explore available vehicles and dealership services.",
    rating: 4.5,
    location: "Add business location",
    phone: "",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 7,
    name: "Reliable Auto Care",
    category: "car-services",
    label: "Car Repair & Service",
    description: "Vehicle maintenance, inspections and repairs.",
    rating: 4.6,
    location: "Add business location",
    phone: "",
    image:
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 8,
    name: "Auto Style Studio",
    category: "car-interiors",
    label: "Car Interior Specialist",
    description: "Interior accessories and vehicle customisation.",
    rating: 4.5,
    location: "Add business location",
    phone: "",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85",
  },
];

function CityListingsPage() {
  const [activeCategory, setActiveCategory] = useState("health");
  const [search, setSearch] = useState("");

  const selectedCategory = categories.find(
    (category) => category.id === activeCategory,
  )!;

  const filteredListings = useMemo(() => {
    const term = search.trim().toLowerCase();

    return listings.filter((listing) => {
      const matchesCategory = listing.category === activeCategory;

      const matchesSearch =
        !term ||
        listing.name.toLowerCase().includes(term) ||
        listing.label.toLowerCase().includes(term) ||
        listing.description.toLowerCase().includes(term) ||
        listing.location.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <main className="city-listings-page">
      <div className="city-listings-container">
        
    
{/* CITY LISTINGS HERO */}
<section className="city-listings-hero">
  <div className="city-listings-hero-inner">
    {/* Left-side content */}
    <div className="city-listings-hero-content">
      <span className="city-listings-hero-eyebrow">
        <Building2 size={15} />
        YOUR CITY. YOUR DIRECTORY.
      </span>

      <h1>
        Discover Your City,
        <span> All in One Place.</span>
      </h1>

      <p>
        Explore local businesses, trusted professionals, educational
        institutions, healthcare facilities, and more — all in one
        convenient directory.
      </p>

      <div className="city-listings-hero-search">
        <Search size={20} aria-hidden="true" />

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search businesses, services..."
          aria-label="Search city listings"
        />

        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            aria-label="Clear search"
          >
            Clear
          </button>
        )}
      </div>

      <div className="city-listings-hero-note">
        <MapPin size={15} />
        <span>Find businesses and services around you</span>
      </div>
    </div>

    {/* Right-side animated showcase */}
    <div className="city-listings-hero-visual">
      <CityListingsShowcase />
    </div>
  </div>
</section>


        <nav
          className="city-listings-categories"
          aria-label="Business categories"
        >
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;

            return (
              <button
                type="button"
                key={category.id}
                className={
                  isActive
                    ? "city-category-button active"
                    : "city-category-button"
                }
                onClick={() => {
                  setActiveCategory(category.id);
                  setSearch("");
                }}
                aria-pressed={isActive}
              >
                <Icon size={23} strokeWidth={2.3} />
                <span>{category.name}</span>
              </button>
            );
          })}
        </nav>
        <section className="city-category-overview">
          <div className="city-category-overview-text">
            <h2>{selectedCategory.name} Directory</h2>
            <p>{selectedCategory.description}</p>
          </div>

          <div className="city-category-tags">
            {selectedCategory.tags.map((tag) => (
              <button type="button" key={tag} onClick={() => setSearch(tag)}>
                {tag}
              </button>
            ))}
          </div>
        </section>
        <div className="city-listings-results-heading">
          <div>
            <h2>Explore Listings</h2>
            <p>
              {filteredListings.length}{" "}
              {filteredListings.length === 1 ? "listing" : "listings"} in{" "}
              {selectedCategory.name}
            </p>
          </div>
        </div>
        {filteredListings.length > 0 ? (
          <section
            className="city-listings-grid"
            aria-label="Business listings"
          >
            {filteredListings.map((listing) => (
              <article className="city-listing-card" key={listing.id}>
                <div className="city-listing-image">
                  <img src={listing.image} alt={listing.label} loading="lazy" />

                  <span className="city-listing-label">{listing.label}</span>
                </div>

                <div className="city-listing-content">
                  <span className="city-listing-category">
                    {selectedCategory.name}
                  </span>

                  <h3>{listing.name}</h3>

                  <p className="city-listing-description">
                    {listing.description}
                  </p>

                  <div className="city-listing-rating">
                    <Star size={15} fill="currentColor" />
                    <span>{listing.rating.toFixed(1)}</span>
                    <span className="rating-note">Sample rating</span>
                  </div>

                  <div className="city-listing-location">
                    <MapPin size={15} />
                    <span>{listing.location}</span>
                  </div>

                  <div className="city-listing-actions">
                    {listing.phone ? (
                      <a href={`tel:${listing.phone}`}>
                        <Phone size={15} />
                        Call business
                      </a>
                    ) : (
                      <button
                        type="button"
                        disabled
                        title="Add the business phone number to enable calling"
                      >
                        <Phone size={15} />
                        Contact details pending
                      </button>
                    )}

                    <button
                      type="button"
                      className="city-listing-details"
                      onClick={() =>
                        window.alert(
                          "Business detail pages will be connected in the next step.",
                        )
                      }
                      aria-label={`View details for ${listing.name}`}
                    >
                      <ArrowUpRight size={18} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <div className="city-listings-empty">
            <Search size={30} />
            <h3>No matching listings found</h3>
            <p>Try another search or choose a different business category.</p>
            <button type="button" onClick={() => setSearch("")}>
              Clear search
            </button>
          </div>
        )}
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
                "Business registration will be connected in a future step.",
              )
            }
          >
            List Your Business
            <ArrowUpRight size={17} />
          </button>
        </section>
      </div>
    </main>
  );
}

export default CityListingsPage;
