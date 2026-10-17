import { Fragment, useMemo, useState } from "react";
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
    Plus,
    House,
} from "lucide-react";

import { categories, listings } from "./CityListingsPage";
import type { CityListing } from "./CityListingsPage";

import CityBusinessProfileModal from "../components/CityBusinessProfileModal";
import type { BusinessProfile } from "../components/CityBusinessProfileModal";

import FindMyPropertyPage from "./FindMyPropertyPage";
import { getListingFilterGroups } from "./cityListingFilters";
import type { ListingFilterGroup } from "./cityListingFilters";

import "./CityListingsBrowsePage.css";

const PROPERTY_CATEGORY_ID = "find-my-property";

type PropertyCategory = "Residential" | "Commercial";
type ListingType = "Rent" | "Lease" | "Sale";

type PropertyFormData = {
    category: PropertyCategory;
    listingType: ListingType;
    title: string;
    price: string;
    locality: string;
};

type SelectedListingFilter = {
    groupId: string;
    option: string;
} | null;

const INITIAL_PROPERTY_FORM: PropertyFormData = {
    category: "Residential",
    listingType: "Rent",
    title: "",
    price: "",
    locality: "",
};

const normalize = (value: string | undefined | null) =>
    (value ?? "").trim().toLowerCase();

/* =========================================================
   SPONSORED ADVERTISEMENT CARD
   Ads are rendered only between business listing cards.
========================================================= */

function CityListingAd() {
    return (
        <article
            className="city-listing-ad"
            aria-label="Sponsored advertisement"
        >
            <div className="city-listing-ad-top">
                <span className="city-listing-ad-label">
                    Sponsored
                </span>

                <span className="city-listing-ad-mark">
                    ADVERTISEMENT
                </span>
            </div>

            <div className="city-listing-ad-content">
                <div className="city-listing-ad-icon">
                    <Building2 size={25} />
                </div>

                <div className="city-listing-ad-copy">
                    <h3>Promote your business on OneService</h3>

                    <p>
                        Reach more local customers and give your business
                        greater visibility with a featured advertisement.
                    </p>
                </div>

                <span className="city-listing-ad-cta">
                    Featured promotion
                    <ArrowRight size={16} />
                </span>
            </div>
        </article>
    );
}

export default function CityListingsBrowsePage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [search, setSearch] = useState(
        searchParams.get("search") ?? "",
    );

    const [sortBy, setSortBy] = useState("recommended");
    const [openNowOnly, setOpenNowOnly] = useState(false);
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);

    const [selectedListingFilter, setSelectedListingFilter] =
        useState<SelectedListingFilter>(null);

    const [selectedListing, setSelectedListing] =
        useState<CityListing | null>(null);

    const [expandedCategory, setExpandedCategory] = useState(
        searchParams.get("category") ?? "",
    );

    const [showListPropertyForm, setShowListPropertyForm] =
        useState(false);

    const [propertyForm, setPropertyForm] =
        useState<PropertyFormData>(INITIAL_PROPERTY_FORM);

    const [showPropertyPreview, setShowPropertyPreview] =
        useState(false);

    const activeCategory = searchParams.get("category") ?? "all";
    const activeSubcategory = searchParams.get("subcategory") ?? "all";

    const isPropertyCategory = activeCategory === PROPERTY_CATEGORY_ID;

    const selectedCategory = categories.find(
        (category) => category.id === activeCategory,
    );

    const activeCategoryName =
        activeSubcategory !== "all"
            ? activeSubcategory
            : selectedCategory?.name ?? "All Listings";

    const filterGroups: ListingFilterGroup[] = useMemo(
        () =>
            getListingFilterGroups(
                activeCategory,
                activeSubcategory,
            ),
        [activeCategory, activeSubcategory],
    );

    const activeFilterCount = [
        verifiedOnly,
        openNowOnly,
        Boolean(selectedListingFilter),
        activeSubcategory !== "all",
    ].filter(Boolean).length;

    const updateUrl = (
        updates: Record<string, string | null>,
        replace = false,
    ) => {
        const next = new URLSearchParams(searchParams);

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value.trim() === "") {
                next.delete(key);
            } else {
                next.set(key, value);
            }
        });

        setSearchParams(next, { replace });
    };

    const updatePropertyForm = (
        field: keyof PropertyFormData,
        value: string,
    ) => {
        setPropertyForm((current) => ({
            ...current,
            [field]: value,
        }));

        setShowPropertyPreview(false);
    };

    const togglePropertyForm = () => {
        setShowListPropertyForm((current) => !current);
        setShowPropertyPreview(false);
    };

    const closePropertyForm = () => {
        setShowListPropertyForm(false);
        setShowPropertyPreview(false);
    };

    const previewProperty = () => {
        const price = Number(propertyForm.price);

        if (
            !propertyForm.title.trim() ||
            !propertyForm.locality.trim() ||
            !propertyForm.price.trim() ||
            !Number.isFinite(price) ||
            price <= 0
        ) {
            return;
        }

        setShowPropertyPreview(true);
    };

    /* CATEGORY SELECTION */

    const selectCategory = (categoryId: string) => {
        setSelectedListingFilter(null);

        if (categoryId === "all") {
            updateUrl({
                category: null,
                subcategory: null,
            });

            setExpandedCategory("");
            return;
        }

        updateUrl({
            category: categoryId,
            subcategory: null,
        });

        setExpandedCategory(categoryId);
    };

    /* SIDEBAR SUBCATEGORY SELECTION */

    const selectSubcategory = (
        categoryId: string,
        subcategory: string,
    ) => {
        setSelectedListingFilter(null);
        setExpandedCategory(categoryId);

        updateUrl({
            category: categoryId,
            subcategory:
                normalize(subcategory) === "all" ||
                normalize(subcategory).startsWith("all ")
                    ? null
                    : subcategory,
        });
    };

    const selectFilterSubcategory = (subcategory: string) => {
        setSelectedListingFilter(null);

        if (normalize(subcategory) === "all") {
            updateUrl({ subcategory: null });
            return;
        }

        updateUrl({
            category: activeCategory === "all" ? null : activeCategory,
            subcategory,
        });
    };

    /* EXPAND/COLLAPSE SIDEBAR CATEGORIES */

    const toggleCategory = (categoryId: string) => {
        const nextExpanded =
            expandedCategory === categoryId ? "" : categoryId;

        setExpandedCategory(nextExpanded);

        if (activeCategory !== categoryId) {
            setSelectedListingFilter(null);

            updateUrl({
                category: categoryId,
                subcategory: null,
            });
        } else if (activeSubcategory !== "all") {
            setSelectedListingFilter(null);
            updateUrl({ subcategory: null });
        }
    };

    /* FILTER OPTION SELECTION */

    const chooseCategoryFilter = (
        groupId: string,
        option: string,
    ) => {
        setSelectedListingFilter((current) => {
            if (
                current?.groupId === groupId &&
                normalize(current.option) === normalize(option)
            ) {
                return null;
            }

            return { groupId, option };
        });
    };

    /* CLEAR FILTERS */

    const clearFilters = () => {
        setVerifiedOnly(false);
        setOpenNowOnly(false);
        setSelectedListingFilter(null);
        updateUrl({ subcategory: null });
    };

    const clearAll = () => {
        setSearch("");
        setVerifiedOnly(false);
        setOpenNowOnly(false);
        setSelectedListingFilter(null);
        setSortBy("recommended");

        const next = new URLSearchParams();

        if (activeCategory !== "all") {
            next.set("category", activeCategory);
            setExpandedCategory(activeCategory);
        } else {
            setExpandedCategory("");
        }

        setSearchParams(next);
    };

    /* MATCH A SELECTED OPTION AGAINST ITS CORRECT ATTRIBUTE */

    const matchesCategoryFilter = (
        listing: CityListing,
        selectedFilter: NonNullable<SelectedListingFilter>,
    ): boolean => {
        const { groupId, option } = selectedFilter;
        const normalizedOption = normalize(option);
        const attributes = listing.filterAttributes;

        if (attributes) {
            const attributeValues = Object.entries(attributes)
                .filter(
                    ([key]) => normalize(key) === normalize(groupId),
                )
                .flatMap(([, values]) => values);

            if (
                attributeValues.some(
                    (value) => normalize(value) === normalizedOption,
                )
            ) {
                return true;
            }

            const hasAttribute = Object.keys(attributes).some(
                (key) => normalize(key) === normalize(groupId),
            );

            if (hasAttribute) {
                return false;
            }
        }

        if (
            groupId === "services" ||
            groupId === "accommodation" ||
            groupId === "educationServices"
        ) {
            return (
                normalize(listing.subcategory) === normalizedOption ||
                normalize(listing.label) === normalizedOption ||
                listing.services.some(
                    (service) => normalize(service) === normalizedOption,
                ) ||
                listing.products.some(
                    (product) => normalize(product) === normalizedOption,
                )
            );
        }

        return false;
    };

    /* FILTER BUSINESS LISTINGS */

    const filteredListings = useMemo(() => {
        const query = normalize(search);

        const filtered = listings.filter((listing) => {
            const matchesCategory =
                activeCategory === "all" ||
                listing.category === activeCategory;

            const listingSubcategory = normalize(listing.subcategory);
            const listingLabel = normalize(listing.label);
            const selectedSubcategory = normalize(activeSubcategory);

            const matchesSubcategory =
                selectedSubcategory === "all" ||
                listingSubcategory === selectedSubcategory ||
                (
                    !listingSubcategory &&
                    listingLabel === selectedSubcategory
                );

            const matchesSearch =
                !query ||
                [
                    listing.name,
                    listing.category,
                    listing.subcategory ?? "",
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
                !openNowOnly || listing.openNow === true;

            const matchesVerified =
                !verifiedOnly || listing.verified === true;

            const matchesDropdownFilter =
                !selectedListingFilter ||
                matchesCategoryFilter(listing, selectedListingFilter);

            return (
                matchesCategory &&
                matchesSubcategory &&
                matchesSearch &&
                matchesOpen &&
                matchesVerified &&
                matchesDropdownFilter
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
        activeSubcategory,
        search,
        sortBy,
        openNowOnly,
        verifiedOnly,
        selectedListingFilter,
    ]);

    /* =========================================================
       RANDOM AD POSITIONS

       - Ads appear only between business cards.
       - Ads are not rendered for property browsing.
       - Show at most two ads per result list.
       - Keep ads separated by at least one business card.
       - Recalculate when the filtered results change.
    ========================================================= */

    const adPositions = useMemo(() => {
        if (isPropertyCategory || filteredListings.length < 5) {
            return [];
        }

        const totalCards = filteredListings.length;

        // Positions represent the number of cards shown before an ad.
        // This avoids inserting an ad before the first card or after
        // the final card.
        const possiblePositions = Array.from(
            { length: totalCards - 2 },
            (_, index) => index + 2,
        );

        // Shuffle candidate positions.
        for (let i = possiblePositions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [
                possiblePositions[i],
                possiblePositions[j],
            ] = [
                possiblePositions[j],
                possiblePositions[i],
            ];
        }

        const selectedPositions: number[] = [];

        for (const position of possiblePositions) {
            if (selectedPositions.length >= 2) {
                break;
            }

            const sufficientlySpaced = selectedPositions.every(
                (existingPosition) =>
                    Math.abs(existingPosition - position) >= 2,
            );

            if (sufficientlySpaced) {
                selectedPositions.push(position);
            }
        }

        return selectedPositions.sort((a, b) => a - b);
    }, [filteredListings, isPropertyCategory]);

    /* BUSINESS PROFILE MODAL DATA */

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
            {/* PAGE HEADER */}

            <section className="city-browse-header">
                <div className="city-browse-header-inner">
                    <div className="city-browse-breadcrumb">
                        <a href="/city-listings">City Listings</a>
                        <span>/</span>

                        {activeSubcategory !== "all" && (
                            <>
                                <span>
                                    {selectedCategory?.name ?? "Categories"}
                                </span>
                                <span>/</span>
                            </>
                        )}

                        <span>{activeCategoryName}</span>
                    </div>

                    <div className="city-browse-heading">
                        <div>
                            <span className="city-browse-eyebrow">
                                {isPropertyCategory
                                    ? "YOUR NEXT SPACE STARTS HERE"
                                    : "DISCOVER LOCAL BUSINESSES"}
                            </span>

                            <h1>
                                {isPropertyCategory
                                    ? selectedCategory?.name ?? "Find My Property"
                                    : activeCategoryName}
                            </h1>

                            <p>
                                {isPropertyCategory
                                    ? "Discover properties to buy, rent or lease in your preferred location."
                                    : "Find trusted businesses and services for your everyday needs."}
                            </p>
                        </div>

                        <div className="city-browse-heading-icon">
                            <Building2 size={33} />
                        </div>
                    </div>

                    {!isPropertyCategory && (
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

                                    updateUrl(
                                        {
                                            search: value.trim() ? value : null,
                                        },
                                        true,
                                    );
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
                                        updateUrl({ search: null }, true);
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
                    )}
                </div>
            </section>

            {/* MAIN LAYOUT */}

            <section className="city-browse-layout">
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
                            (listing) => listing.category === category.id,
                        ).length;

                        const isExpanded = expandedCategory === category.id;
                        const isActiveCategory = activeCategory === category.id;

                        return (
                            <div
                                className="city-browse-category-group"
                                key={category.id}
                            >
                                <button
                                    type="button"
                                    className={`city-browse-category ${
                                        isActiveCategory ? "active" : ""
                                    }`}
                                    onClick={() => toggleCategory(category.id)}
                                    aria-expanded={isExpanded}
                                >
                                    <span className="city-browse-category-name">
                                        <span className="city-browse-category-dot" />
                                        <span>{category.name}</span>
                                    </span>

                                    <span className="city-browse-category-trailing">
                                        <span className="city-browse-category-count">
                                            {count}
                                        </span>

                                        <ChevronDown
                                            size={15}
                                            className={`city-browse-category-chevron ${
                                                isExpanded ? "open" : ""
                                            }`}
                                        />
                                    </span>
                                </button>

                                {isExpanded && (
                                    <div className="city-browse-subcategories">
                                        <button
                                            type="button"
                                            className={`city-browse-subcategory ${
                                                isActiveCategory &&
                                                activeSubcategory === "all"
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                selectCategory(category.id)
                                            }
                                        >
                                            <span>All {category.name}</span>

                                            <span className="city-browse-subcategory-count">
                                                {count}
                                            </span>
                                        </button>

                                        {(category.subcategories ?? []).map(
                                            (subcategory) => {
                                                const subcategoryCount =
                                                    listings.filter(
                                                        (listing) =>
                                                            listing.category ===
                                                                category.id &&
                                                            normalize(
                                                                listing.subcategory ??
                                                                    listing.label,
                                                            ) === normalize(subcategory),
                                                    ).length;

                                                const isActiveSubcategory =
                                                    isActiveCategory &&
                                                    normalize(activeSubcategory) ===
                                                        normalize(subcategory);

                                                return (
                                                    <button
                                                        type="button"
                                                        key={subcategory}
                                                        className={`city-browse-subcategory ${
                                                            isActiveSubcategory
                                                                ? "active"
                                                                : ""
                                                        }`}
                                                        onClick={() =>
                                                            selectSubcategory(
                                                                category.id,
                                                                subcategory,
                                                            )
                                                        }
                                                    >
                                                        <span>{subcategory}</span>

                                                        <span className="city-browse-subcategory-count">
                                                            {subcategoryCount}
                                                        </span>
                                                    </button>
                                                );
                                            },
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </aside>

                {/* RESULTS */}

                <div className="city-browse-results">
                    {isPropertyCategory ? (
                        <div className="city-property-content">
                            <div className="city-property-topbar">
                                <div className="city-property-brand">
                                    <span className="city-property-brand-icon">
                                        <House size={23} />
                                    </span>

                                    <div>
                                        <h2>Find My Property</h2>
                                        <p>YOUR SPACE. YOUR NEXT CHAPTER.</p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="city-property-list-button"
                                    onClick={togglePropertyForm}
                                    aria-expanded={showListPropertyForm}
                                >
                                    {showListPropertyForm ? (
                                        <X size={17} />
                                    ) : (
                                        <Plus size={17} />
                                    )}

                                    {showListPropertyForm
                                        ? "Close Form"
                                        : "List Property"}
                                </button>
                            </div>

                            {showListPropertyForm && (
                                <section className="city-property-form-card">
                                    <div className="city-property-form-heading">
                                        <div>
                                            <h3>List your property</h3>
                                            <p>
                                                Create a sample listing to preview
                                                the owner experience.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            aria-label="Close property form"
                                            onClick={closePropertyForm}
                                        >
                                            <X size={19} />
                                        </button>
                                    </div>

                                    <form
                                        className="city-property-form"
                                        onSubmit={(event) => {
                                            event.preventDefault();
                                            previewProperty();
                                        }}
                                    >
                                        <fieldset className="city-property-fieldset">
                                            <legend>Property category</legend>

                                            <div className="city-property-radio-row">
                                                {(
                                                    [
                                                        "Residential",
                                                        "Commercial",
                                                    ] as PropertyCategory[]
                                                ).map((category) => (
                                                    <label
                                                        className="city-property-radio"
                                                        key={category}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="propertyCategory"
                                                            value={category}
                                                            checked={
                                                                propertyForm.category ===
                                                                category
                                                            }
                                                            onChange={() =>
                                                                updatePropertyForm(
                                                                    "category",
                                                                    category,
                                                                )
                                                            }
                                                        />

                                                        <span>{category}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </fieldset>

                                        <fieldset className="city-property-fieldset">
                                            <legend>Listing type</legend>

                                            <div className="city-property-radio-row">
                                                {(
                                                    [
                                                        "Rent",
                                                        "Lease",
                                                        "Sale",
                                                    ] as ListingType[]
                                                ).map((type) => (
                                                    <label
                                                        className="city-property-radio"
                                                        key={type}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="listingType"
                                                            value={type}
                                                            checked={
                                                                propertyForm.listingType ===
                                                                type
                                                            }
                                                            onChange={() =>
                                                                updatePropertyForm(
                                                                    "listingType",
                                                                    type,
                                                                )
                                                            }
                                                        />

                                                        <span>{type}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </fieldset>

                                        <label className="city-property-input-label">
                                            Property title

                                            <input
                                                type="text"
                                                value={propertyForm.title}
                                                onChange={(event) =>
                                                    updatePropertyForm(
                                                        "title",
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="e.g. 2 BHK flat for rent"
                                                required
                                            />
                                        </label>

                                        <label className="city-property-input-label">
                                            Price (₹)

                                            <input
                                                type="number"
                                                min="1"
                                                value={propertyForm.price}
                                                onChange={(event) =>
                                                    updatePropertyForm(
                                                        "price",
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Enter expected amount"
                                                required
                                            />
                                        </label>

                                        <label className="city-property-input-label">
                                            Locality

                                            <input
                                                type="text"
                                                value={propertyForm.locality}
                                                onChange={(event) =>
                                                    updatePropertyForm(
                                                        "locality",
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="e.g. MVP Colony, Vizag"
                                                required
                                            />
                                        </label>

                                        <button
                                            type="submit"
                                            className="city-property-preview-button"
                                        >
                                            Preview Sample Listing
                                        </button>
                                    </form>

                                    {showPropertyPreview && (
                                        <div className="city-property-preview">
                                            <div className="city-property-preview-top">
                                                <span>SAMPLE LISTING PREVIEW</span>

                                                <span className="city-property-preview-badge">
                                                    Preview
                                                </span>
                                            </div>

                                            <h4>{propertyForm.title}</h4>

                                            <p className="city-property-preview-price">
                                                ₹
                                                {Number(
                                                    propertyForm.price,
                                                ).toLocaleString("en-IN")}
                                                {propertyForm.listingType === "Sale"
                                                    ? ""
                                                    : propertyForm.listingType ===
                                                        "Rent"
                                                      ? " / month"
                                                      : " / lease"}
                                            </p>

                                            <p className="city-property-preview-location">
                                                <MapPin size={16} />
                                                {propertyForm.locality}
                                            </p>

                                            <div className="city-property-preview-meta">
                                                <span>{propertyForm.category}</span>
                                                <span>{propertyForm.listingType}</span>
                                            </div>

                                            <p className="city-property-preview-note">
                                                This is a sample preview only. Your
                                                property has not been published.
                                            </p>
                                        </div>
                                    )}
                                </section>
                            )}

                            <FindMyPropertyPage embedded />
                        </div>
                    ) : (
                        <>
                            <div className="city-browse-results-toolbar">
                                <div className="city-browse-results-title">
                                    <h2>{activeCategoryName}</h2>

                                    <p>
                                        Showing{" "}
                                        <strong>{filteredListings.length}</strong>{" "}
                                        {filteredListings.length === 1
                                            ? "business"
                                            : "businesses"}
                                    </p>
                                </div>

                                <div className="city-browse-toolbar-actions">
                                    {/* FILTER DROPDOWN */}

                                    <div
                                        className="city-browse-filter-dropdown"
                                        onMouseEnter={() => setFiltersOpen(true)}
                                        onMouseLeave={() => setFiltersOpen(false)}
                                    >
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
                                                            <p>Refine your results</p>
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

                                                    {filterGroups.map((group) => (
                                                        <div
                                                            className="city-browse-category-filter-section"
                                                            key={`${group.id}-${group.label}`}
                                                        >
                                                            <h4>{group.label}</h4>

                                                            {group.options.length > 0 ? (
                                                                <div className="city-browse-category-filter-options">
                                                                    {group.options.map(
                                                                        (option) => {
                                                                            const isChecked =
                                                                                selectedListingFilter?.groupId ===
                                                                                    group.id &&
                                                                                normalize(
                                                                                    selectedListingFilter.option,
                                                                                ) ===
                                                                                    normalize(option);

                                                                            return (
                                                                                <button
                                                                                    type="button"
                                                                                    key={option}
                                                                                    className={`city-browse-category-filter-chip ${
                                                                                        isChecked
                                                                                            ? "active"
                                                                                            : ""
                                                                                    }`}
                                                                                    onClick={() =>
                                                                                        chooseCategoryFilter(
                                                                                            group.id,
                                                                                            option,
                                                                                        )
                                                                                    }
                                                                                    aria-pressed={
                                                                                        isChecked
                                                                                    }
                                                                                >
                                                                                    {option}
                                                                                </button>
                                                                            );
                                                                        },
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <p>
                                                                    No additional options
                                                                    available.
                                                                </p>
                                                            )}
                                                        </div>
                                                    ))}

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

                            {/* ACTIVE FILTER CHIPS */}

                            {(activeSubcategory !== "all" ||
                                selectedListingFilter ||
                                verifiedOnly ||
                                openNowOnly) && (
                                <div className="city-browse-active-filters">
                                    <span>Active filters:</span>

                                    {activeSubcategory !== "all" && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                selectFilterSubcategory("all")
                                            }
                                            aria-label={`Remove ${activeSubcategory} filter`}
                                        >
                                            {activeSubcategory}
                                            <X size={14} />
                                        </button>
                                    )}

                                    {selectedListingFilter && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSelectedListingFilter(null)
                                            }
                                            aria-label={`Remove ${selectedListingFilter.option} filter`}
                                        >
                                            {selectedListingFilter.option}
                                            <X size={14} />
                                        </button>
                                    )}

                                    {verifiedOnly && (
                                        <button
                                            type="button"
                                            onClick={() => setVerifiedOnly(false)}
                                        >
                                            Verified
                                            <X size={14} />
                                        </button>
                                    )}

                                    {openNowOnly && (
                                        <button
                                            type="button"
                                            onClick={() => setOpenNowOnly(false)}
                                        >
                                            Open now
                                            <X size={14} />
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                    >
                                        Clear filters
                                    </button>
                                </div>
                            )}

                            {/* BUSINESS LIST + RANDOM AD BLOCKS */}

                            {filteredListings.length > 0 ? (
                                <div className="city-browse-list">
                                    {filteredListings.map((listing, index) => (
                                        <Fragment key={listing.id}>
                                            <article
                                                className="city-browse-business-card"
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
                                                        {listing.subcategory ??
                                                            listing.label}
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

                                            {/* Ads are inserted directly after a card.
                                                They cannot appear elsewhere on the page. */}
                                            {adPositions.includes(index + 1) && (
                                                <CityListingAd />
                                            )}
                                        </Fragment>
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
                        </>
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
