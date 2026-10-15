
import { useMemo, useState } from "react";
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
  X,
  House,
  KeyRound,
  ShieldCheck,
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
  },
];

const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function FindMyPropertyPage({
  embedded = false,
}: FindMyPropertyPageProps) {
  const navigate = useNavigate();

  const [deal, setDeal] = useState<DealType>("Rent");
  const [kind, setKind] = useState<PropertyKind>("All");
  const [city, setCity] = useState("Visakhapatnam");
  const [keywords, setKeywords] = useState("");
  const [budget, setBudget] = useState("any");
  const [bedrooms, setBedrooms] = useState("any");

  const [submitted, setSubmitted] = useState({
    deal: "Rent" as DealType,
    kind: "All" as PropertyKind,
    city: "Visakhapatnam",
    keywords: "",
    budget: "any",
    bedrooms: "any",
  });

  const [saved, setSaved] = useState<number[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState("recommended");
  const [selected, setSelected] = useState<Property | null>(null);

  const results = useMemo(() => {
    const term = submitted.keywords.trim().toLowerCase();

    let items = properties.filter((property) => {
      const dealMatch = property.deal === submitted.deal;

      const kindMatch =
        submitted.kind === "All" || property.kind === submitted.kind;

      const cityMatch =
        !submitted.city.trim() ||
        `${property.city} ${property.location}`
          .toLowerCase()
          .includes(submitted.city.trim().toLowerCase());

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
    }

    if (sort === "price-high") {
      items = [...items].sort((a, b) => b.price - a.price);
    }

    return items;
  }, [submitted, sort]);

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
    const initialFilters = {
      deal: "Rent" as DealType,
      kind: "All" as PropertyKind,
      city: "Visakhapatnam",
      keywords: "",
      budget: "any",
      bedrooms: "any",
    };

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

  const openPropertyEnquiry = (property: Property) => {
    navigate(
      `/contact?subject=${encodeURIComponent(
        `Property Enquiry - ${property.title}`,
      )}`,
    );
  };

  return (
    <main
      className={`fmp-page${embedded ? " fmp-embedded" : ""}`}
    >
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

          <nav className="fmp-mini-nav">
            <a href="#buy" onClick={() => setDeal("Sale")}>
              Buy
            </a>
            <a href="#buy" onClick={() => setDeal("Rent")}>
              Rent
            </a>
            <a href="#buy" onClick={() => setDeal("Lease")}>
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

        <form
          className="fmp-search-form"
          onSubmit={searchProperties}
        >
          <label className="fmp-field-title">
            I'm looking for
          </label>

          <div className="fmp-deal-tabs">
            {(["Rent", "Lease", "Sale"] as DealType[]).map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  className={deal === item ? "active" : ""}
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
              ),
            )}
          </div>

          <label className="fmp-field-title">
            Property category
          </label>

          <div className="fmp-radio-row">
            {(
              ["All", "Residential", "Commercial", "Co-Workspace"] as PropertyKind[]
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
            <span>Listings may only be posted by property owners and authorized builders.</span>
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
            />
          </div>

          <label
            className="fmp-field-title"
            htmlFor="fmp-keywords"
          >
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
              <option value="25to50">
                ₹25,001 – ₹50,000
              </option>
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
          <div className="fmp-filter-panel">
            <label>
              Sort by
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">
                  Price: low to high
                </option>
                <option value="price-high">
                  Price: high to low
                </option>
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
            {results.map((property) => (
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
                    {property.deal === "Sale"
                      ? "Buy"
                      : property.deal}
                  </span>

                  <button
                    type="button"
                    aria-label={
                      saved.includes(property.id)
                        ? "Remove from favourites"
                        : "Save property"
                    }
                    aria-pressed={saved.includes(property.id)}
                    className={`fmp-save ${saved.includes(property.id) ? "saved" : ""
                      }`}
                    onClick={() => toggleSaved(property.id)}
                  >
                    <Heart
                      size={15}
                      fill={
                        saved.includes(property.id)
                          ? "currentColor"
                          : "none"
                      }
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
                    {property.beds && (
                      <span>
                        <BedDouble size={13} />
                        {property.beds} BHK
                      </span>
                    )}

                    {property.baths && (
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
                    onClick={() => setSelected(property)}
                  >
                    View Details
                  </button>
                </div>
              </article>
            ))}
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
          onClick={() => setSelected(null)}
        >
          <section
            className="fmp-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="fmp-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="fmp-modal-close"
              aria-label="Close details"
              onClick={() => setSelected(null)}
            >
              <X size={18} />
            </button>

            <img src={selected.image} alt={selected.title} />

            <div className="fmp-modal-content">
              <span className="fmp-eyebrow">
                {selected.label}
              </span>

              <h2 id="fmp-modal-title">{selected.title}</h2>

              <p className="fmp-property-location">
                <MapPin size={14} />
                {selected.location}
              </p>

              <strong className="fmp-property-price">
                {money(selected.price)}{" "}
                <span>{selected.period ?? ""}</span>
              </strong>

              <p>{selected.description}</p>

              <div className="fmp-property-specs">
                {selected.beds && (
                  <span>
                    <BedDouble size={14} />
                    {selected.beds} BHK
                  </span>
                )}

                {selected.baths && (
                  <span>
                    <Bath size={14} />
                    {selected.baths} Bath
                  </span>
                )}

                <span>
                  <Maximize2 size={13} />
                  {selected.area.toLocaleString("en-IN")} sq.ft.
                </span>
              </div>

              <button
                type="button"
                className="fmp-search-submit"
                onClick={() => openPropertyEnquiry(selected)}
              >
                Enquire about property
                <ArrowRight size={15} />
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
