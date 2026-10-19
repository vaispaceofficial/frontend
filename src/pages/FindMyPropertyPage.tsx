
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Building2,
  ChevronDown,
  Heart,
  MapPin,
  Search,
  SlidersHorizontal,
  BedDouble,
  Bath,
  Maximize2,
  Plus,
  Images,
  Navigation,
  X,
  House,
  KeyRound,
  ShieldCheck,
  Landmark,
  Check,
  MessageCircle,
  Phone,
  Share2,
} from "lucide-react";

import "./FindMyPropertyPage.css";

type DealType = "Rent" | "Lease" | "Sale";
type PropertyKind =
  | "All"
  | "Residential"
  | "Commercial"
  | "Co-Workspace";

type Property = {
  id: number;
  title: string;
  deal: DealType;
  kind: Exclude<PropertyKind, "All">;
  location: string;
  city: string;
  price: number;
  period?: string;
  beds?: number;
  baths?: number;
  area: number;
  label: string;
  image: string;
  description: string;
  gallery?: string[];
  highlights?: string[];
};

type FindMyPropertyPageProps = {
  embedded?: boolean;
};

const properties: Property[] = [
  {
    id: 1,
    title: "Premium 3 BHK Apartment",
    deal: "Rent",
    kind: "Residential",
    location: "Madhurawada, Visakhapatnam",
    city: "Visakhapatnam",
    price: 25000,
    period: "/ month",
    beds: 3,
    baths: 3,
    area: 1650,
    label: "Residential · Apartment",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
    description:
      "A bright, spacious apartment with modern finishes and convenient access to everyday amenities.",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=900&q=80",
    ],
    highlights: [
      "Madhurawada main road connectivity",
      "Public transport and bus access",
      "Schools and colleges in the area",
      "Shopping and daily essentials nearby",
    ],
  },
  {
    id: 2,
    title: "Premium Office Workspace",
    deal: "Rent",
    kind: "Commercial",
    location: "MVP Colony, Visakhapatnam",
    city: "Visakhapatnam",
    price: 65000,
    period: "/ month",
    area: 2400,
    label: "Commercial · Office Space",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
    description:
      "Contemporary office space with an open-plan layout suitable for growing teams and businesses.",
    gallery: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?auto=format&fit=crop&w=900&q=80",
    ],
    highlights: [
      "MVP Colony main-road access",
      "Public transport connections",
      "Nearby shops and food options",
      "Business services in the area",
    ],
  },
  {
    id: 3,
    title: "Independent Family Home",
    deal: "Sale",
    kind: "Residential",
    location: "Yendada, Visakhapatnam",
    city: "Visakhapatnam",
    price: 8750000,
    area: 2100,
    beds: 3,
    baths: 3,
    label: "Residential · Independent House",
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=85",
    description:
      "A welcoming family home with generous living spaces and a practical layout.",
    gallery: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
    ],
    highlights: [
      "Yendada road connectivity",
      "Local schools and colleges",
      "Daily shopping options nearby",
      "Public transport access",
    ],
  },
  {
    id: 4,
    title: "Retail Commercial Unit",
    deal: "Lease",
    kind: "Commercial",
    location: "Dwaraka Nagar, Visakhapatnam",
    city: "Visakhapatnam",
    price: 45000,
    period: "/ month",
    area: 1100,
    label: "Commercial · Retail Space",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85",
    description:
      "Street-facing commercial space in a convenient business location.",
    gallery: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80",
    ],
    highlights: [
      "Dwaraka Nagar commercial area",
      "Main-road visibility and access",
      "Public transport connections",
      "Nearby shops and business services",
    ],
  },
];

const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const initialFilters = {
  deal: "Rent" as DealType,
  kind: "All" as PropertyKind,
  city: "Visakhapatnam",
  keywords: "",
  budget: "any",
  bedrooms: "any",
};

export default function FindMyPropertyPage({
  embedded = false,
}: FindMyPropertyPageProps) {
  const navigate = useNavigate();

  const [deal, setDeal] = useState<DealType>(initialFilters.deal);
  const [kind, setKind] = useState<PropertyKind>(initialFilters.kind);
  const [city, setCity] = useState(initialFilters.city);
  const [keywords, setKeywords] = useState(initialFilters.keywords);
  const [budget, setBudget] = useState(initialFilters.budget);
  const [bedrooms, setBedrooms] = useState(initialFilters.bedrooms);

  const [submitted, setSubmitted] = useState(initialFilters);
  const [saved, setSaved] = useState<number[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState("recommended");

  const [selected, setSelected] = useState<Property | null>(null);
  const [selectedPropertyTab, setSelectedPropertyTab] = useState<
    "overview" | "gallery" | "location"
  >("overview");
  const [activeGalleryImage, setActiveGalleryImage] = useState(0);

  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [enquiryName, setEnquiryName] = useState("");
  const [enquiryMobile, setEnquiryMobile] = useState("");
  const [enquiryDetails, setEnquiryDetails] = useState("");

  const getPropertyGallery = (property: Property) =>
    property.gallery?.length ? property.gallery : [property.image];

  const selectedGallery = selected ? getPropertyGallery(selected) : [];

  const getMapSearch = (property: Property) =>
    encodeURIComponent(`${property.title}, ${property.location}`);

  const results = useMemo(() => {
    const term = submitted.keywords.trim().toLowerCase();

    let items = properties.filter((property) => {
      const dealMatch = property.deal === submitted.deal;

      const kindMatch =
        submitted.kind === "All" || property.kind === submitted.kind;

      const cityTerm = submitted.city.trim().toLowerCase();

      const cityMatch =
        !cityTerm ||
        `${property.city} ${property.location}`
          .toLowerCase()
          .includes(cityTerm);

      const termMatch =
        !term ||
        `${property.title} ${property.label} ${property.location} ${property.description}`
          .toLowerCase()
          .includes(term);

      const budgetMatch =
        submitted.budget === "any" ||
        (submitted.budget === "under25" && property.price <= 25000) ||
        (submitted.budget === "25to50" &&
          property.price > 25000 &&
          property.price <= 50000) ||
        (submitted.budget === "over50" && property.price > 50000);

      const bedroomMatch =
        submitted.bedrooms === "any" ||
        (property.beds ?? 0) >= Number(submitted.bedrooms);

      return (
        dealMatch &&
        kindMatch &&
        cityMatch &&
        termMatch &&
        budgetMatch &&
        bedroomMatch
      );
    });

    if (sort === "price-low") {
      items = [...items].sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      items = [...items].sort((a, b) => b.price - a.price);
    }

    return items;
  }, [submitted, sort]);

  // Keep the page behind the popup from scrolling and support Escape.
  useEffect(() => {
    if (!selected) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (showEnquiryForm) {
          setShowEnquiryForm(false);
        } else {
          setSelected(null);
        }
      }

      if (event.key === "ArrowRight" && !showEnquiryForm) {
        setActiveGalleryImage((index) =>
          (index + 1) % getPropertyGallery(selected).length,
        );
      }

      if (event.key === "ArrowLeft" && !showEnquiryForm) {
        setActiveGalleryImage((index) => {
          const length = getPropertyGallery(selected).length;
          return (index - 1 + length) % length;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selected, showEnquiryForm]);

  const searchProperties = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitted({
      deal,
      kind,
      city,
      keywords,
      budget,
      bedrooms,
    });
  };

  const resetFilters = () => {
    setDeal(initialFilters.deal);
    setKind(initialFilters.kind);
    setCity(initialFilters.city);
    setKeywords(initialFilters.keywords);
    setBudget(initialFilters.budget);
    setBedrooms(initialFilters.bedrooms);
    setSubmitted(initialFilters);
    setSort("recommended");
    setFiltersOpen(false);
  };

  const toggleSaved = (propertyId: number) => {
    setSaved((current) =>
      current.includes(propertyId)
        ? current.filter((id) => id !== propertyId)
        : [...current, propertyId],
    );
  };

  const openPropertyDetails = (property: Property) => {
    setSelected(property);
    setSelectedPropertyTab("overview");
    setActiveGalleryImage(0);
    setShowEnquiryForm(false);
  };

  const closePropertyDetails = () => {
    setShowEnquiryForm(false);
    setSelected(null);
  };

  const openPropertyEnquiry = () => {
    setEnquiryName("");
    setEnquiryMobile("");
    setEnquiryDetails("");
    setShowEnquiryForm(true);
  };

  const submitPropertyEnquiry = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (!selected) return;

    const params = new URLSearchParams({
      subject: `Property Callback Request - ${selected.title}`,
      name: enquiryName.trim(),
      mobile: enquiryMobile.trim(),
      details: enquiryDetails.trim(),
      property: selected.title,
      location: selected.location,
    });

    setShowEnquiryForm(false);
    setSelected(null);
    navigate(`/contact?${params.toString()}`);
  };

  return (
    <main className={`fmp-page${embedded ? " fmp-embedded" : ""}`}>
      {!embedded && (
        <header className="fmp-header">
          <Link to="/city-listings" className="fmp-brand">
            <span className="fmp-brand-icon">
              <Building2 size={19} />
            </span>

            <span>
              <strong>Find My Property</strong>
              <small>YOUR SPACE. YOUR NEXT CHAPTER.</small>
            </span>
          </Link>

          <button
            type="button"
            className="fmp-post-top"
            onClick={() =>
              navigate("/contact?subject=List%20My%20Property")
            }
          >
            <Plus size={14} />
            List Property
          </button>

          <nav className="fmp-mini-nav" aria-label="Property types">
            <a
              href="#buy"
              onClick={() => setDeal("Sale")}
              aria-label="Search properties to buy"
            >
              Buy
            </a>
            <a
              href="#buy"
              onClick={() => setDeal("Rent")}
              aria-label="Search properties to rent"
            >
              Rent
            </a>
            <a
              href="#buy"
              onClick={() => setDeal("Lease")}
              aria-label="Search properties to lease"
            >
              Lease
            </a>
            <span>
              <ShieldCheck size={12} />
              Trust starts here
            </span>
          </nav>
        </header>
      )}

      <section className="fmp-search-panel" id="buy">
        <span className="fmp-eyebrow">
          PROPERTY DISCOVERY, SIMPLIFIED
        </span>

        <h1>Find a place to call yours.</h1>

        <p className="fmp-intro">
          Discover homes, offices and investment properties. Rent,
          lease or buy — start with the right space.
        </p>

        <form className="fmp-search-form" onSubmit={searchProperties}>
          <label className="fmp-field-title">I'm looking for</label>

          <div className="fmp-deal-tabs">
            {(["Rent", "Lease", "Sale"] as DealType[]).map((item) => (
              <button
                key={item}
                type="button"
                className={deal === item ? "active" : ""}
                aria-pressed={deal === item}
                onClick={() => setDeal(item)}
              >
                {item === "Rent" ? (
                  <KeyRound size={14} />
                ) : item === "Lease" ? (
                  <Building2 size={14} />
                ) : (
                  <House size={14} />
                )}
                <span>{item === "Sale" ? "Buy" : item}</span>
              </button>
            ))}
          </div>

          <label className="fmp-field-title">Property category</label>

          <div className="fmp-radio-row">
            {(
              [
                "All",
                "Residential",
                "Commercial",
                "Co-Workspace",
              ] as PropertyKind[]
            ).map((item) => (
              <label key={item}>
                <input
                  type="radio"
                  name="property-kind"
                  checked={kind === item}
                  onChange={() => setKind(item)}
                />
                {item}
              </label>
            ))}
          </div>

          <div className="fmp-listing-note">
            <ShieldCheck size={14} />
            <span>
              Listings may only be posted by property owners and
              authorized builders.
            </span>
          </div>

          <label className="fmp-field-title" htmlFor="fmp-city">
            Preferred city or locality
          </label>

          <div className="fmp-input-wrap">
            <MapPin size={15} />
            <input
              id="fmp-city"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Enter city or locality"
              autoComplete="address-level2"
            />
          </div>

          <label className="fmp-field-title" htmlFor="fmp-keywords">
            Keywords
          </label>

          <input
            className="fmp-input"
            id="fmp-keywords"
            value={keywords}
            onChange={(event) => setKeywords(event.target.value)}
            placeholder="Apartment, villa, office, shop..."
          />

          <label className="fmp-field-title" htmlFor="fmp-budget">
            Budget
          </label>

          <div className="fmp-select-wrap">
            <select
              id="fmp-budget"
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
            >
              <option value="any">Any budget</option>
              <option value="under25">Up to ₹25,000</option>
              <option value="25to50">₹25,001 – ₹50,000</option>
              <option value="over50">Above ₹50,000</option>
            </select>
            <ChevronDown size={14} />
          </div>

          <label className="fmp-field-title" htmlFor="fmp-beds-any">
            Bedrooms (residential)
          </label>

          <div className="fmp-radio-row fmp-bedrooms">
            <label>
              <input
                id="fmp-beds-any"
                type="radio"
                name="bedrooms"
                checked={bedrooms === "any"}
                onChange={() => setBedrooms("any")}
              />
              Any
            </label>

            {[1, 2, 3, 4].map((number) => (
              <label key={number}>
                <input
                  type="radio"
                  name="bedrooms"
                  checked={bedrooms === String(number)}
                  onChange={() => setBedrooms(String(number))}
                />
                {number}+ BHK
              </label>
            ))}
          </div>

          <button type="submit" className="fmp-search-submit">
            <Search size={15} />
            Search Properties
          </button>
        </form>

        <div className="fmp-trust-note">
          <ShieldCheck size={12} />
          Search by locality · Explore listings · Save favourites
        </div>
      </section>

      <section className="fmp-results-section">
        <div className="fmp-results-heading">
          <div>
            <h2>Explore properties</h2>
            <p>
              {results.length} matching{" "}
              {results.length === 1 ? "property" : "properties"}
            </p>
          </div>

          <div className="fmp-results-tools">
            <button
              type="button"
              className="fmp-filter-button"
              onClick={() => setFiltersOpen((open) => !open)}
              aria-expanded={filtersOpen}
              aria-controls="fmp-filter-panel"
            >
              <SlidersHorizontal size={14} />
              Filters
            </button>

            <button
              type="button"
              className="fmp-reset-button"
              onClick={resetFilters}
            >
              Reset filters
            </button>
          </div>
        </div>

        {filtersOpen && (
          <div className="fmp-filter-panel" id="fmp-filter-panel">
            <label>
              Sort by
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </label>

            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
            >
              Done
            </button>
          </div>
        )}

        {results.length > 0 ? (
          <div className="fmp-property-grid">
            {results.map((property) => {
              const isSaved = saved.includes(property.id);

              return (
                <article
                  className="fmp-property-card"
                  key={property.id}
                >
                  <div className="fmp-property-image">
                    <img
                      src={property.image}
                      alt={property.title}
                      loading="lazy"
                    />

                    <span className="fmp-property-tag">
                      {property.deal === "Sale" ? "Buy" : property.deal}
                    </span>

                    <button
                      type="button"
                      aria-label={
                        isSaved
                          ? "Remove from favourites"
                          : "Save property"
                      }
                      aria-pressed={isSaved}
                      className={`fmp-save${isSaved ? " saved" : ""}`}
                      onClick={() => toggleSaved(property.id)}
                    >
                      <Heart
                        size={15}
                        fill={isSaved ? "currentColor" : "none"}
                      />
                    </button>
                  </div>

                  <div className="fmp-property-content">
                    <small>{property.label}</small>
                    <h3>{property.title}</h3>

                    <p className="fmp-property-location">
                      <MapPin size={12} />
                      {property.location}
                    </p>

                    <strong className="fmp-property-price">
                      {money(property.price)}{" "}
                      <span>{property.period ?? ""}</span>
                    </strong>

                    <div className="fmp-property-specs">
                      {property.beds != null && (
                        <span>
                          <BedDouble size={13} />
                          {property.beds} BHK
                        </span>
                      )}

                      {property.baths != null && (
                        <span>
                          <Bath size={13} />
                          {property.baths} Bath
                        </span>
                      )}

                      <span>
                        <Maximize2 size={12} />
                        {property.area.toLocaleString("en-IN")} sq.ft.
                      </span>
                    </div>

                    <button
                      type="button"
                      className="fmp-view-details"
                      onClick={() => openPropertyDetails(property)}
                    >
                      View Details
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="fmp-empty">
            <Search size={25} />
            <h3>No matching properties</h3>
            <p>
              Try changing your location, budget or property type.
            </p>
            <button type="button" onClick={resetFilters}>
              Reset search
            </button>
          </div>
        )}
      </section>

      <section className="fmp-owner-cta">
        <div className="fmp-owner-icon">
          <House size={18} />
        </div>

        <h2>Have a property to list?</h2>

        <p>
          Reach potential tenants, buyers and businesses with a clear,
          structured listing.
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/contact?subject=List%20My%20Property")
          }
        >
          Post Your Property
          <ArrowRight size={14} />
        </button>
      </section>

      {!embedded && (
        <footer className="fmp-footer">
          <strong>Find My Property</strong>
          <span>A dedicated real estate discovery platform</span>
          <small>
            Demo listing data only · No live inventory or transaction
          </small>
          <Link to="/city-listings">Back to City Listings</Link>
        </footer>
      )}

      {selected && (
        <div
          className="fmp-modal-backdrop"
          role="presentation"
          onClick={closePropertyDetails}
        >
          <section
            className="fmp-modal fmp-property-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="fmp-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Premium property hero with key contact actions */}
            <div className="fmp-property-modal-hero">
              <img
                src={selectedGallery[0] ?? selected.image}
                alt={`${selected.title}`}
              />
              <div className="fmp-property-hero-shade" />

              <button
                type="button"
                className="fmp-modal-close"
                aria-label="Close details"
                onClick={closePropertyDetails}
              >
                <X size={18} />
              </button>

              <div className="fmp-property-hero-content">
                <div className="fmp-property-hero-copy">
                  <span className="fmp-property-hero-label">{selected.label}</span>
                  <h2 id="fmp-modal-title">{selected.title}</h2>
                  <p className="fmp-property-hero-location"><MapPin size={15} />{selected.location}</p>
                  <strong className="fmp-property-hero-price">
                    {money(selected.price)} <span>{selected.period ?? (selected.deal === "Sale" ? "asking price" : "")}</span>
                  </strong>
                </div>
                <div className="fmp-property-hero-actions" aria-label="Property contact actions">
                  <a
                    className="fmp-hero-action fmp-action-whatsapp"
                    href={`https://wa.me/?text=${encodeURIComponent(`I'm interested in ${selected.title} at ${selected.location} (${money(selected.price)} ${selected.period ?? ""}).`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  ><MessageCircle size={18} /><span>WhatsApp</span></a>
                  <button
                    type="button"
                    className="fmp-hero-action fmp-action-call"
                    onClick={openPropertyEnquiry}
                    title="Request a call back because a listing phone number is not available"
                  ><Phone size={17} /><span>Call Now</span></button>
                  <a
                    className="fmp-hero-action fmp-action-directions"
                    href={`https://www.google.com/maps/search/?api=1&query=${getMapSearch(selected)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  ><Navigation size={17} /><span>Directions</span></a>
                  <button
                    type="button"
                    className="fmp-hero-action fmp-action-share"
                    onClick={async () => {
                      const shareUrl = window.location.href;
                      const shareData = { title: selected.title, text: `${selected.title} · ${selected.location} · ${money(selected.price)} ${selected.period ?? ""}`, url: shareUrl };
                      try {
                        if (navigator.share) await navigator.share(shareData);
                        else if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(`${shareData.text}\n${shareUrl}`);
                        else window.prompt("Copy this property link", shareUrl);
                      } catch (error) {
                        if (error instanceof Error && error.name !== "AbortError") window.prompt("Copy this property link", shareUrl);
                      }
                    }}
                    aria-label="Share property"
                    title="Share property"
                  ><Share2 size={18} /><span>Share</span></button>
                </div>
              </div>
            </div>

            <div className="fmp-property-modal-body">

              {/* Keep these three tabs aligned with the existing CSS */}
              <div
                className="fmp-property-modal-tabs"
                role="tablist"
                aria-label="Property details"
              >
                <button
                  type="button"
                  role="tab"
                  id="fmp-tab-overview"
                  aria-controls="fmp-panel-overview"
                  aria-selected={selectedPropertyTab === "overview"}
                  className={
                    selectedPropertyTab === "overview" ? "active" : ""
                  }
                  onClick={() => setSelectedPropertyTab("overview")}
                >
                  <House size={16} />
                  Overview
                </button>

                <button
                  type="button"
                  role="tab"
                  id="fmp-tab-gallery"
                  aria-controls="fmp-panel-gallery"
                  aria-selected={selectedPropertyTab === "gallery"}
                  className={
                    selectedPropertyTab === "gallery" ? "active" : ""
                  }
                  onClick={() => setSelectedPropertyTab("gallery")}
                >
                  <Images size={16} />
                  Property Gallery
                </button>

                <button
                  type="button"
                  role="tab"
                  id="fmp-tab-location"
                  aria-controls="fmp-panel-location"
                  aria-selected={selectedPropertyTab === "location"}
                  className={
                    selectedPropertyTab === "location" ? "active" : ""
                  }
                  onClick={() => setSelectedPropertyTab("location")}
                >
                  <MapPin size={16} />
                  Location &amp; Map
                </button>
              </div>

              <div className="fmp-property-tab-content">
                {selectedPropertyTab === "overview" && (
                  <div
                    className="fmp-property-overview-panel"
                    id="fmp-panel-overview"
                    role="tabpanel"
                    aria-labelledby="fmp-tab-overview"
                  >
                    <div className="fmp-property-overview-card">
                      <h3>About this property</h3>
                      <p>{selected.description}</p>

                      <div className="fmp-property-highlights">
                        <h4>
                          <Landmark size={15} />
                          Nearby highlights &amp; landmarks
                        </h4>

                        <ul className="fmp-property-highlights-list">
                          {(
                            selected.highlights ?? [
                              "Main-road connectivity",
                              "Public transport access",
                              "Schools and everyday essentials nearby",
                              "Local shops and services",
                            ]
                          ).map((highlight) => (
                            <li key={highlight}>
                              <Check size={14} />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="fmp-property-overview-card">
                      <h3>Property details</h3>

                      <div className="fmp-property-detail-grid">
                        <div>
                          <span>Listing type</span>
                          <strong>
                            {selected.deal === "Sale"
                              ? "For Sale"
                              : `For ${selected.deal}`}
                          </strong>
                        </div>

                        <div>
                          <span>Category</span>
                          <strong>{selected.kind}</strong>
                        </div>

                        {selected.beds != null && (
                          <div>
                            <span>Bedrooms</span>
                            <strong>{selected.beds} BHK</strong>
                          </div>
                        )}

                        {selected.baths != null && (
                          <div>
                            <span>Bathrooms</span>
                            <strong>{selected.baths}</strong>
                          </div>
                        )}

                        <div>
                          <span>Area</span>
                          <strong>
                            {selected.area.toLocaleString("en-IN")} sq.ft.
                          </strong>
                        </div>

                        <div>
                          <span>Location</span>
                          <strong>{selected.location}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedPropertyTab === "gallery" && (
                  <div
                    className="fmp-property-gallery-panel"
                    id="fmp-panel-gallery"
                    role="tabpanel"
                    aria-labelledby="fmp-tab-gallery"
                  >
                    <div className="fmp-property-gallery-heading">
                      <div><h3>Property Gallery</h3><p>Explore photos of this property.</p></div>
                      <span>{selectedGallery.length} {selectedGallery.length === 1 ? "photo" : "photos"}</span>
                    </div>
                    <div className="fmp-property-gallery-grid">
                      {selectedGallery.map((image, index) => (
                        <button
                          type="button"
                          key={`${image}-${index}`}
                          className={`fmp-property-gallery-card${activeGalleryImage === index ? " active" : ""}`}
                          onClick={() => setActiveGalleryImage(index)}
                          aria-label={`View property image ${index + 1}`}
                          aria-pressed={activeGalleryImage === index}
                        >
                          <img src={image} alt={`${selected.title} gallery view ${index + 1}`} loading="lazy" />
                          <span><Images size={13} /> View photo {index + 1}</span>
                        </button>
                      ))}
                    </div>

                    {selectedGallery.length === 1 && (
                      <p className="fmp-gallery-note">
                        More property images can be added to this
                        listing's gallery.
                      </p>
                    )}
                  </div>
                )}

                {selectedPropertyTab === "location" && (
                  <div
                    className="fmp-property-location-panel"
                    id="fmp-panel-location"
                    role="tabpanel"
                    aria-labelledby="fmp-tab-location"
                  >
                    <div className="fmp-property-location-summary">
                      <MapPin size={20} />

                      <div>
                        <h3>Property location</h3>
                        <p>{selected.location}</p>
                      </div>

                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${getMapSearch(
                          selected,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fmp-map-directions"
                      >
                        <Navigation size={15} />
                        Directions
                      </a>
                    </div>

                    <iframe
                      title={`Map showing ${selected.title}`}
                      src={`https://www.google.com/maps?q=${getMapSearch(
                        selected,
                      )}&output=embed`}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                )}
              </div>

              {/* Keep the primary action at the bottom of the details popup */}
              <div className="fmp-property-modal-footer">
                <button
                  type="button"
                  className="fmp-search-submit fmp-property-enquiry-button"
                  onClick={openPropertyEnquiry}
                >
                  Enquire about property
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Enquiry form appears over the property popup */}
            {showEnquiryForm && (
              <div
                className="fmp-enquiry-backdrop"
                role="presentation"
                onClick={(event) => {
                  if (event.target === event.currentTarget) {
                    setShowEnquiryForm(false);
                  }
                }}
              >
                <section
                  className="fmp-enquiry-modal"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="fmp-enquiry-title"
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    className="fmp-enquiry-close"
                    aria-label="Close enquiry form"
                    onClick={() => setShowEnquiryForm(false)}
                  >
                    <X size={18} />
                  </button>

                  <span className="fmp-property-modal-label">
                    PROPERTY ENQUIRY
                  </span>

                  <h2 id="fmp-enquiry-title">Request a Call Back</h2>

                  <p className="fmp-enquiry-intro">
                    Share your contact details about{" "}
                    <strong>{selected.title}</strong> to continue your
                    request.
                  </p>

                  <form
                    onSubmit={submitPropertyEnquiry}
                    className="fmp-enquiry-form"
                  >
                    <label htmlFor="fmp-enquiry-name">Full name</label>
                    <input
                      id="fmp-enquiry-name"
                      name="name"
                      value={enquiryName}
                      onChange={(event) =>
                        setEnquiryName(event.target.value)
                      }
                      placeholder="Enter your name"
                      autoComplete="name"
                      maxLength={100}
                      required
                    />

                    <label htmlFor="fmp-enquiry-mobile">
                      Mobile number
                    </label>
                    <input
                      id="fmp-enquiry-mobile"
                      name="mobile"
                      type="tel"
                      value={enquiryMobile}
                      onChange={(event) =>
                        setEnquiryMobile(event.target.value)
                      }
                      placeholder="Enter your mobile number"
                      autoComplete="tel"
                      inputMode="tel"
                      pattern="[+]?[0-9 ()-]{10,20}"
                      title="Enter a valid mobile number."
                      maxLength={20}
                      required
                    />

                    <label htmlFor="fmp-enquiry-details">
                      Additional details
                    </label>
                    <textarea
                      id="fmp-enquiry-details"
                      name="details"
                      value={enquiryDetails}
                      onChange={(event) =>
                        setEnquiryDetails(event.target.value)
                      }
                      placeholder="Preferred time to call or any questions (optional)"
                      rows={3}
                      maxLength={600}
                    />

                    <button
                      type="submit"
                      className="fmp-enquiry-submit"
                    >
                      Request a Callback
                      <ArrowRight size={16} />
                    </button>
                  </form>
                </section>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
