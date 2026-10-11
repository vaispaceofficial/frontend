
import {
  ArrowRight,
  Search,
  Wrench,
  Zap,
  Sparkles,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { services } from "../data/serviceMenu";
import "./ServicesPage.css";

const categories = [
  "All",
  "Home Appliances",
  "Home Services",
  "Personal Services",
  "Home Staff",
  "Professional Services",
  "EduTech & Home Tutors",
];

function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read the category passed from the homepage.
  const categoryFromUrl = searchParams.get("category");

  const getValidCategory = (category: string | null) => {
    if (
      category &&
      categories.includes(category) &&
      category !== "All"
    ) {
      return category;
    }

    return "All";
  };

  const [activeCategory, setActiveCategory] = useState(() =>
    getValidCategory(categoryFromUrl)
  );

  const [search, setSearch] = useState("");

  // Keep the selected category synchronized with the URL.
  // This also handles browser Back/Forward navigation.
  useEffect(() => {
    setActiveCategory(getValidCategory(categoryFromUrl));
  }, [categoryFromUrl]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);

    // Update the URL when a category tab is selected.
    const nextParams = new URLSearchParams(searchParams);

    if (category === "All") {
      nextParams.delete("category");
    } else {
      nextParams.set("category", category);
    }

    setSearchParams(nextParams, { replace: false });
  };

  const filteredServices = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    // Search across all services, regardless of selected category.
    if (searchText.length > 0) {
      return services.filter((service) => {
        const name = service.name.toLowerCase();
        const category = service.category.toLowerCase();
        const description = service.description.toLowerCase();

        return (
          name.includes(searchText) ||
          category.includes(searchText) ||
          description.includes(searchText)
        );
      });
    }

    // Filter services by the selected category.
    return services.filter(
      (service) =>
        activeCategory === "All" ||
        service.category === activeCategory
    );
  }, [activeCategory, search]);

  return (
    <main className="services-page">
      {/* HERO SECTION */}
      <section className="services-page-hero">
        <div className="services-hero-inner">
          <div className="services-hero-copy">
            <span className="services-page-eyebrow">
              NEED ONE SERVICE
            </span>

            <h1>
              Services for every
              <br />
              <span>home need.</span>
            </h1>

            <p>
              From repairs and maintenance to personal care and
              home assistance, find the right professional for
              your needs.
            </p>
          </div>

          {/* ANIMATED SEMICIRCLE */}
          <div
            className="services-hero-animation"
            role="img"
            aria-label="Service cards revolving along a dotted semicircle"
          >
            <div className="service-orbit-glow" />

            <div className="service-orbit-stage">
              <svg
                className="service-orbit-path"
                viewBox="0 0 440 300"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id="service-orbit-gradient"
                    x1="35"
                    y1="250"
                    x2="405"
                    y2="250"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#bfdbfe" />
                    <stop offset="50%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#bfdbfe" />
                  </linearGradient>
                </defs>

                <path
                  d="M 35 250 C 65 20, 375 20, 405 250"
                  stroke="#dbeafe"
                  strokeWidth="2.5"
                  strokeDasharray="2 9"
                  strokeLinecap="round"
                />

                <path
                  className="service-orbit-flow-line"
                  d="M 35 250 C 65 20, 375 20, 405 250"
                  stroke="url(#service-orbit-gradient)"
                  strokeWidth="2.5"
                  strokeDasharray="3 10"
                  strokeLinecap="round"
                />

                <circle
                  cx="35"
                  cy="250"
                  r="12"
                  fill="#dbeafe"
                  opacity="0.7"
                />

                <circle cx="35" cy="250" r="5" fill="#2563eb" />

                <circle
                  cx="405"
                  cy="250"
                  r="12"
                  fill="#dbeafe"
                  opacity="0.7"
                />

                <circle
                  cx="405"
                  cy="250"
                  r="5"
                  fill="#2563eb"
                />
              </svg>

              <div className="service-orbit-card service-orbit-card-1">
                <span className="service-flow-icon">
                  <Wrench size={19} strokeWidth={1.9} />
                </span>

                <span className="service-flow-name">
                  Convenience
                </span>

                <ArrowRight
                  className="service-flow-arrow"
                  size={15}
                  strokeWidth={1.9}
                />
              </div>

              <div className="service-orbit-card service-orbit-card-2">
                <span className="service-flow-icon">
                  <Zap size={19} strokeWidth={1.9} />
                </span>

                <span className="service-flow-name">
                  Reliability
                </span>

                <ArrowRight
                  className="service-flow-arrow"
                  size={15}
                  strokeWidth={1.9}
                />
              </div>

              <div className="service-orbit-card service-orbit-card-3">
                <span className="service-flow-icon">
                  <Sparkles size={19} strokeWidth={1.9} />
                </span>

                <span className="service-flow-name">
                  Seamless
                </span>

                <ArrowRight
                  className="service-flow-arrow"
                  size={15}
                  strokeWidth={1.9}
                />
              </div>
            </div>

            <div className="service-orbit-caption">
              <span className="service-flow-caption-dot" />

              <span>
                All your home services, in one place
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES BROWSER */}
      <section className="services-browser">
        <div className="services-browser-top">
          <div>
            <span className="services-small-label">
              EXPLORE SERVICES
            </span>

            <h2>Find the service you need</h2>
          </div>

          {/* GLOBAL SERVICE SEARCH */}
          <label className="services-search">
            <Search size={19} aria-hidden="true" />

            <input
              type="search"
              placeholder="Search all services..."
              aria-label="Search all services"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        </div>

        {/* CATEGORY FILTERS */}
        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                activeCategory === category ? "active" : ""
              }
              aria-pressed={activeCategory === category}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* SELECTED CATEGORY LABEL */}
        {activeCategory !== "All" && search.trim() === "" && (
          <p className="services-results-info" aria-live="polite">
            Showing services in{" "}
            <strong>{activeCategory}</strong>
          </p>
        )}

        {/* SEARCH RESULTS LABEL */}
        {search.trim() !== "" && (
          <p className="services-results-info" aria-live="polite">
            <span className="services-results-count">
              {filteredServices.length}
            </span>

            {filteredServices.length === 1
              ? " service found"
              : " services found"}

            {" across all categories for "}

            <strong>"{search.trim()}"</strong>
          </p>
        )}

        {/* SERVICE CARDS */}
        <div className="services-grid">
          {filteredServices.map((service) => (
            <Link
              key={service.id}
              to={`/services/${service.id}`}
              className="service-list-card"
            >
              <div className="service-list-image">
                <img
                  src={service.image}
                  alt={service.name}
                  loading="lazy"
                />
              </div>

              <div className="service-list-content">
                <span>{service.category}</span>

                <h3>{service.name}</h3>

                <p>{service.description}</p>

                <div className="service-list-footer">
                  <strong>
                    Starting ₹{service.price}
                  </strong>

                  <span>
                    Explore
                    <ArrowRight size={15} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* EMPTY RESULTS STATE */}
        {filteredServices.length === 0 && (
          <div className="services-empty-state">
            <h3>No services found</h3>

            <p>
              {search.trim()
                ? `We couldn't find any services matching "${search.trim()}". Try another search term.`
                : "There are no services in this category yet. Please explore another category."}
            </p>

            {search.trim() !== "" && (
              <button
                type="button"
                onClick={() => setSearch("")}
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default ServicesPage;
