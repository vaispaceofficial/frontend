
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    Search,
    MapPin,
    Star,
    ShieldCheck,
    Clock,
    Phone,
    SlidersHorizontal,
    ArrowRight,
    Building2,
    X,
    ChevronDown,
} from "lucide-react";

import {
    categories,
    listings,
} from "./CityListingsPage";
import type { CityListing } from "./CityListingsPage";

import CityBusinessProfileModal from "../components/CityBusinessProfileModal";
import type { BusinessProfile } from "../components/CityBusinessProfileModal";

import "./CityListingsBrowsePage.css";

export default function CityListingsBrowsePage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [search, setSearch] = useState(
        searchParams.get("search") ?? "",
    );
    const [sortBy, setSortBy] = useState("recommended");
    const [openNowOnly, setOpenNowOnly] = useState(false);
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [selectedListing, setSelectedListing] =
        useState<CityListing | null>(null);

    const activeCategory = searchParams.get("category") ?? "all";

    const activeFilterCount = [
        verifiedOnly,
        openNowOnly,
    ].filter(Boolean).length;

    const selectCategory = (categoryId: string) => {
        const next = new URLSearchParams(searchParams);

        if (categoryId === "all") {
            next.delete("category");
        } else {
            next.set("category", categoryId);
        }

        setSearchParams(next);
    };

    const clearFilters = () => {
        setVerifiedOnly(false);
        setOpenNowOnly(false);
    };

    const clearAll = () => {
        setSearch("");
        setVerifiedOnly(false);
        setOpenNowOnly(false);
        setSortBy("recommended");

        setSearchParams(
            activeCategory === "all"
                ? {}
                : { category: activeCategory },
        );
    };

    const filteredListings = useMemo(() => {
        const query = search.trim().toLowerCase();

        const filtered = listings.filter((listing) => {
            const matchesCategory =
                activeCategory === "all" ||
                listing.category === activeCategory;

            const matchesSearch =
                !query ||
                [
                    listing.name,
                    listing.category,
                    listing.label,
                    listing.description,
                    listing.location,
                    ...listing.services,
                    ...listing.products,
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(query);

            const matchesOpen =
                !openNowOnly || listing.openNow;

            const matchesVerified =
                !verifiedOnly || listing.verified;

            return (
                matchesCategory &&
                matchesSearch &&
                matchesOpen &&
                matchesVerified
            );
        });

        if (sortBy === "rating") {
            filtered.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === "reviews") {
            filtered.sort((a, b) => b.reviews - a.reviews);
        }

        return filtered;
    }, [
        activeCategory,
        search,
        sortBy,
        openNowOnly,
        verifiedOnly,
    ]);

    const activeCategoryName =
        categories.find(
            (category) => category.id === activeCategory,
        )?.name ?? "All Listings";

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

    return (
        <main className="city-browse-page">
            {/* HEADER */}
            <section className="city-browse-header">
                <div className="city-browse-header-inner">
                    <div className="city-browse-breadcrumb">
                        <a href="/city-listings">
                            City Listings
                        </a>
                        <span>/</span>
                        <span>{activeCategoryName}</span>
                    </div>

                    <div className="city-browse-heading">
                        <div>
                            <span className="city-browse-eyebrow">
                                DISCOVER LOCAL BUSINESSES
                            </span>

                            <h1>{activeCategoryName}</h1>

                            <p>
                                Find trusted businesses and services
                                for your everyday needs.
                            </p>
                        </div>

                        <div className="city-browse-heading-icon">
                            <Building2 size={33} />
                        </div>
                    </div>

                    {/* SEARCH */}
                    <form
                        className="city-browse-search"
                        onSubmit={(event) => event.preventDefault()}
                    >
                        <Search size={21} />

                        <input
                            value={search}
                            onChange={(event) => {
                                const value = event.target.value;

                                setSearch(value);

                                const next = new URLSearchParams(
                                    searchParams,
                                );

                                if (value.trim()) {
                                    next.set("search", value);
                                } else {
                                    next.delete("search");
                                }

                                setSearchParams(next, {
                                    replace: true,
                                });
                            }}
                            placeholder="Search businesses, services, locations..."
                            aria-label="Search listings"
                        />

                        {search && (
                            <button
                                type="button"
                                className="city-browse-clear"
                                aria-label="Clear search"
                                onClick={() => {
                                    setSearch("");

                                    const next = new URLSearchParams(
                                        searchParams,
                                    );

                                    next.delete("search");

                                    setSearchParams(next, {
                                        replace: true,
                                    });
                                }}
                            >
                                <X size={17} />
                            </button>
                        )}

                        <button
                            type="submit"
                            className="city-browse-search-button"
                        >
                            Search
                        </button>
                    </form>
                </div>
            </section>

            {/* MAIN LAYOUT */}
            <section className="city-browse-layout">
                {/* CATEGORY SIDEBAR */}
                <aside className="city-browse-sidebar">
                    <div className="city-browse-sidebar-heading">
                        <h2>Categories</h2>
                        <SlidersHorizontal size={18} />
                    </div>

                    <button
                        type="button"
                        className={`city-browse-category ${
                            activeCategory === "all" ? "active" : ""
                        }`}
                        onClick={() => selectCategory("all")}
                    >
                        <span className="city-browse-category-name">
                            <Building2 size={18} />
                            All Listings
                        </span>

                        <span className="city-browse-category-count">
                            {listings.length}
                        </span>
                    </button>

                    {categories.map((category) => {
                        const count = listings.filter(
                            (listing) =>
                                listing.category === category.id,
                        ).length;

                        return (
                            <button
                                type="button"
                                key={category.id}
                                className={`city-browse-category ${
                                    activeCategory === category.id
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    selectCategory(category.id)
                                }
                            >
                                <span className="city-browse-category-name">
                                    <span className="city-browse-category-dot" />
                                    {category.name}
                                </span>

                                <span className="city-browse-category-count">
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </aside>

                {/* BUSINESS RESULTS */}
                <div className="city-browse-results">
                    <div className="city-browse-results-toolbar">
                        <div className="city-browse-results-title">
                            <h2>{activeCategoryName}</h2>

                            <p>
                                Showing{" "}
                                <strong>
                                    {filteredListings.length}
                                </strong>{" "}
                                {filteredListings.length === 1
                                    ? "business"
                                    : "businesses"}
                            </p>
                        </div>

                        <div className="city-browse-toolbar-actions">
                            {/* FILTER DROPDOWN */}
                            <div className="city-browse-filter-dropdown">
                                <button
                                    type="button"
                                    className={`city-browse-filter-trigger ${
                                        filtersOpen || activeFilterCount > 0
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setFiltersOpen((current) => !current)
                                    }
                                    aria-expanded={filtersOpen}
                                    aria-haspopup="true"
                                >
                                    <SlidersHorizontal size={15} />
                                    <span>Filters</span>

                                    {activeFilterCount > 0 && (
                                        <span className="city-browse-filter-count">
                                            {activeFilterCount}
                                        </span>
                                    )}

                                    <ChevronDown
                                        size={14}
                                        className={`city-browse-filter-chevron ${
                                            filtersOpen ? "open" : ""
                                        }`}
                                    />
                                </button>

                                {filtersOpen && (
                                    <>
                                        <button
                                            type="button"
                                            className="city-browse-filter-backdrop"
                                            aria-label="Close filters"
                                            onClick={() =>
                                                setFiltersOpen(false)
                                            }
                                        />

                                        <div className="city-browse-filter-menu">
                                            <div className="city-browse-filter-menu-header">
                                                <div>
                                                    <h3>Filters</h3>
                                                    <p>
                                                        Refine your results
                                                    </p>
                                                </div>

                                                <button
                                                    type="button"
                                                    aria-label="Close filters"
                                                    onClick={() =>
                                                        setFiltersOpen(false)
                                                    }
                                                >
                                                    <X size={17} />
                                                </button>
                                            </div>

                                            <label className="city-browse-filter-option">
                                                <span className="city-browse-filter-option-icon">
                                                    <ShieldCheck size={17} />
                                                </span>

                                                <span className="city-browse-filter-option-text">
                                                    <strong>
                                                        Verified businesses
                                                    </strong>
                                                    <small>
                                                        Show verified listings only
                                                    </small>
                                                </span>

                                                <input
                                                    type="checkbox"
                                                    checked={verifiedOnly}
                                                    onChange={(event) =>
                                                        setVerifiedOnly(
                                                            event.target.checked,
                                                        )
                                                    }
                                                />
                                            </label>

                                            <label className="city-browse-filter-option">
                                                <span className="city-browse-filter-option-icon">
                                                    <Clock size={17} />
                                                </span>

                                                <span className="city-browse-filter-option-text">
                                                    <strong>Open now</strong>
                                                    <small>
                                                        Show currently open listings
                                                    </small>
                                                </span>

                                                <input
                                                    type="checkbox"
                                                    checked={openNowOnly}
                                                    onChange={(event) =>
                                                        setOpenNowOnly(
                                                            event.target.checked,
                                                        )
                                                    }
                                                />
                                            </label>

                                            <div className="city-browse-filter-menu-footer">
                                                <button
                                                    type="button"
                                                    className="city-browse-filter-reset"
                                                    onClick={clearFilters}
                                                >
                                                    Reset
                                                </button>

                                                <button
                                                    type="button"
                                                    className="city-browse-filter-apply"
                                                    onClick={() =>
                                                        setFiltersOpen(false)
                                                    }
                                                >
                                                    Done
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* SORT */}
                            <label className="city-browse-sort">
                                <span>Sort by</span>

                                <select
                                    value={sortBy}
                                    onChange={(event) =>
                                        setSortBy(event.target.value)
                                    }
                                >
                                    <option value="recommended">
                                        Recommended
                                    </option>
                                    <option value="rating">
                                        Highest rated
                                    </option>
                                    <option value="reviews">
                                        Most reviewed
                                    </option>
                                </select>
                            </label>
                        </div>
                    </div>

                    {/* LISTINGS */}
                    {filteredListings.length > 0 ? (
                        <div className="city-browse-list">
                            {filteredListings.map((listing) => (
                                <article
                                    className="city-browse-business-card"
                                    key={listing.id}
                                    onClick={() =>
                                        setSelectedListing(listing)
                                    }
                                    onKeyDown={(event) => {
                                        if (
                                            event.key === "Enter" ||
                                            event.key === " "
                                        ) {
                                            event.preventDefault();
                                            setSelectedListing(listing);
                                        }
                                    }}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <div className="city-browse-business-image">
                                        <img
                                            src={listing.image}
                                            alt={listing.name}
                                            loading="lazy"
                                        />

                                        {listing.verified && (
                                            <span className="city-browse-verified-badge">
                                                <ShieldCheck size={13} />
                                                Verified
                                            </span>
                                        )}
                                    </div>

                                    <div className="city-browse-business-info">
                                        <div className="city-browse-business-topline">
                                            <span className="city-browse-business-category">
                                                {categories.find(
                                                    (category) =>
                                                        category.id ===
                                                        listing.category,
                                                )?.name ?? listing.category}
                                            </span>

                                            {listing.openNow && (
                                                <span className="city-browse-open-badge">
                                                    <span />
                                                    Open now
                                                </span>
                                            )}
                                        </div>

                                        <h3>{listing.name}</h3>

                                        <p className="city-browse-business-label">
                                            {listing.label}
                                        </p>

                                        <p className="city-browse-business-description">
                                            {listing.description}
                                        </p>

                                        <div className="city-browse-business-meta">
                                            <span className="city-browse-rating">
                                                <Star
                                                    size={15}
                                                    fill="currentColor"
                                                />

                                                <strong>
                                                    {listing.rating.toFixed(1)}
                                                </strong>

                                                <span>
                                                    ({listing.reviews})
                                                </span>
                                            </span>

                                            <span className="city-browse-location">
                                                <MapPin size={15} />
                                                {listing.location}
                                            </span>
                                        </div>

                                        <div className="city-browse-business-actions">
                                            <button
                                                type="button"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setSelectedListing(listing);
                                                }}
                                            >
                                                View details
                                                <ArrowRight size={15} />
                                            </button>

                                            <a
                                                href={`tel:${listing.phone.replace(
                                                    /[^\d+]/g,
                                                    "",
                                                )}`}
                                                onClick={(event) =>
                                                    event.stopPropagation()
                                                }
                                                aria-label={`Call ${listing.name}`}
                                            >
                                                <Phone size={15} />
                                                Call
                                            </a>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="city-browse-empty">
                            <span>
                                <Search size={28} />
                            </span>

                            <h3>No businesses found</h3>

                            <p>
                                Try another search term or clear your
                                filters to see more listings.
                            </p>

                            <button
                                type="button"
                                onClick={clearAll}
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* BUSINESS PROFILE MODAL */}
            {modalListing && (
                <CityBusinessProfileModal
                    listing={modalListing}
                    onClose={() => setSelectedListing(null)}
                />
            )}
        </main>
    );
}
