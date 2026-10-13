
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import {
  X,
  Star,
  MapPin,
  Phone,
  Clock3,
  BadgeCheck,
  IdCard,
  Images,
  BriefcaseBusiness,
  ShoppingBag,
  MapPinned,
  MessageCircle,
  Check,
  Share2,
  Navigation,
  Building2,
} from "lucide-react";

import "./CityBusinessProfileModal.css";

export type BusinessProfile = {
  id: number;
  name: string;
  category: string;
  label: string;
  description: string;
  rating: number;
  location: string;
  phone: string;
  image: string;
  verified?: boolean;
  openNow?: boolean;
  reviewCount?: number;
  address?: string;
  email?: string;
  coverImage?: string;
  avatar?: string;
  about?: string;
  hours?: { day: string; time: string }[];
  amenities?: string[];
  services?: string[];
  gallery?: string[];
};

type Props = {
  listing: BusinessProfile;
  onClose: () => void;
};

type ProfileTab =
  | "overview"
  | "media"
  | "services"
  | "products"
  | "location"
  | "reviews";

const tabs: {
  id: ProfileTab;
  label: string;
  icon: typeof IdCard;
}[] = [
  { id: "overview", label: "Overview", icon: IdCard },
  { id: "media", label: "Media & Gallery", icon: Images },
  {
    id: "services",
    label: "Services Offered",
    icon: BriefcaseBusiness,
  },
  {
    id: "products",
    label: "Products / Catalogue",
    icon: ShoppingBag,
  },
  {
    id: "location",
    label: "Location & Map",
    icon: MapPinned,
  },
  {
    id: "reviews",
    label: "Customer Reviews",
    icon: MessageCircle,
  },
];

function CityBusinessProfileModal({
  listing,
  onClose,
}: Props) {
  const [activeTab, setActiveTab] =
    useState<ProfileTab>("overview");

  // Keep the latest close handler without restarting the
  // scroll-lock effect when the parent component rerenders.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const address =
    listing.address ||
    (listing.location.toLowerCase().includes("add business")
      ? "Business address will be updated soon"
      : listing.location);

  const hours = listing.hours ?? [
    { day: "Mon – Sat", time: "09:00 AM – 08:30 PM" },
    { day: "Sunday", time: "10:00 AM – 01:30 PM" },
  ];

  const amenities = listing.amenities ?? [
    "Professional Consultation",
    "Experienced Staff",
    "Modern Facilities",
    "Customer Support",
    "Appointment Available",
  ];

  const services = listing.services ?? [
    listing.label,
    "Professional Consultation",
    "Customer Assistance",
  ];

  const gallery = listing.gallery?.length
    ? listing.gallery
    : [listing.coverImage || listing.image, listing.image];

  const directionsUrl =
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  // FIX: Preserve and restore the page's original scroll position.
  useEffect(() => {
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    const body = document.body;
    const html = document.documentElement;

    // Save the original inline styles so they can be restored.
    const previousBodyStyles = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    const previousHtmlOverflow = html.style.overflow;

    // Freeze the background page where it currently is.
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = `-${scrollX}px`;
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    html.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseRef.current();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);

      // Restore every inline style changed by the modal.
      body.style.position = previousBodyStyles.position;
      body.style.top = previousBodyStyles.top;
      body.style.left = previousBodyStyles.left;
      body.style.right = previousBodyStyles.right;
      body.style.width = previousBodyStyles.width;
      body.style.overflow = previousBodyStyles.overflow;
      html.style.overflow = previousHtmlOverflow;

      // Restore the exact scroll position from before opening.
      window.scrollTo(scrollX, scrollY);
    };
  }, []);

  const callBusiness = () => {
    if (listing.phone) {
      window.location.href = `tel:${listing.phone}`;
    }
  };

  const shareBusiness = async () => {
    const shareData = {
      title: listing.name,
      text: `${listing.name} — ${address}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(
          `${listing.name}\n${address}\n${window.location.href}`,
        );

        window.alert("Business details copied to clipboard.");
      } else {
        window.alert(`${listing.name}\n${address}`);
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.name !== "AbortError"
      ) {
        console.error("Unable to share business:", error);
      }
    }
  };

  const coverStyle: CSSProperties = {
    backgroundImage: `linear-gradient(
      90deg,
      rgba(8, 18, 38, 0.88) 0%,
      rgba(8, 18, 38, 0.54) 54%,
      rgba(8, 18, 38, 0.12) 100%
    ), linear-gradient(
      0deg,
      rgba(8, 18, 38, 0.82) 0%,
      transparent 75%
    ), url("${listing.coverImage || listing.image}")`,
  };

  return (
    <div
      className="business-profile-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onCloseRef.current();
        }
      }}
    >
      <section
        className="business-profile-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${listing.name} business profile`}
      >
        <button
          type="button"
          className="business-profile-close"
          onClick={() => onCloseRef.current()}
          aria-label="Close business profile"
        >
          <X size={20} />
        </button>

        {/* BUSINESS COVER */}
        <header
          className="business-profile-cover"
          style={coverStyle}
        >
          <div className="business-profile-identity">
            <img
              className="business-profile-avatar"
              src={
                listing.avatar ||
                "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=180&q=80"
              }
              alt={`${listing.name} profile`}
            />

            <div className="business-profile-heading">
              <div className="business-profile-badges">
                <span className="business-profile-category-badge">
                  <Building2 size={13} />
                  {listing.category}
                </span>

                {listing.verified && (
                  <span className="business-profile-verified">
                    <BadgeCheck size={14} />
                    Verified
                  </span>
                )}

                {listing.openNow !== undefined && (
                  <span
                    className={`business-profile-open-status ${
                      listing.openNow ? "is-open" : "is-closed"
                    }`}
                  >
                    <span className="business-profile-status-dot" />
                    {listing.openNow ? "Open now" : "Closed"}
                  </span>
                )}
              </div>

              <h1>{listing.name}</h1>

              <p className="business-profile-tagline">
                {listing.description}
              </p>

              <div className="business-profile-meta">
                <span className="business-profile-rating">
                  <Star size={15} fill="currentColor" />
                  {listing.rating.toFixed(1)}
                  <span>
                    ({listing.reviewCount ?? 142} reviews)
                  </span>
                </span>

                <span className="business-profile-meta-divider">
                  •
                </span>

                <span className="business-profile-location-meta">
                  <MapPin size={14} />
                  <span>{address}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="business-profile-actions">
            <button
              type="button"
              className="business-profile-call"
              onClick={callBusiness}
              disabled={!listing.phone}
              title={
                listing.phone
                  ? "Call this business"
                  : "Phone number not available yet"
              }
            >
              <Phone size={15} />
              Call Now
            </button>

            <a
              className="business-profile-directions"
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Navigation size={15} />
              Directions
            </a>

            <button
              type="button"
              className="business-profile-share"
              onClick={shareBusiness}
              aria-label="Share business profile"
              title="Share business profile"
            >
              <Share2 size={17} />
            </button>
          </div>
        </header>

        {/* PROFILE NAVIGATION */}
        <nav
          className="business-profile-tabs"
          aria-label="Business profile sections"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;

            return (
              <button
                type="button"
                key={tab.id}
                className={`business-profile-tab ${
                  active ? "active" : ""
                }`}
                onClick={() => setActiveTab(tab.id)}
                aria-pressed={active}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* TAB CONTENT */}
        <div className="business-profile-body">
          {activeTab === "overview" && (
            <div className="business-profile-overview">
              <div className="business-profile-main-column">
                <section className="business-profile-panel">
                  <h2>About Business</h2>

                  <p>
                    {listing.about || listing.description}
                    {!listing.about &&
                      ` ${listing.name} provides professional services with a focus on quality, customer care, and reliable support.`}
                  </p>
                </section>

                <section className="business-profile-panel">
                  <h2>Key Highlights & Amenities</h2>

                  <div className="business-profile-amenities">
                    {amenities.map((amenity) => (
                      <div
                        className="business-profile-amenity"
                        key={amenity}
                      >
                        <Check size={14} />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <aside className="business-profile-side-column">
                <section className="business-profile-panel">
                  <h2>
                    <Clock3 size={17} />
                    Operating Hours
                  </h2>

                  <div className="business-profile-hours">
                    {hours.map((item) => (
                      <div key={item.day}>
                        <strong>{item.day}</strong>
                        <span>{item.time}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="business-profile-panel">
                  <h2>
                    <IdCard size={17} />
                    Contact Details
                  </h2>

                  <div className="business-profile-contact">
                    <p>
                      <MapPin size={14} />
                      <span>{address}</span>
                    </p>

                    <p>
                      <Phone size={14} />
                      <span>
                        {listing.phone ||
                          "Phone number not provided"}
                      </span>
                    </p>

                    {listing.email && (
                      <p>
                        <MessageCircle size={14} />
                        <span>{listing.email}</span>
                      </p>
                    )}
                  </div>
                </section>
              </aside>
            </div>
          )}

          {activeTab === "media" && (
            <section className="business-profile-panel business-profile-full-panel">
              <h2>Media & Gallery</h2>

              <p className="business-profile-section-description">
                Photos provided for this business.
              </p>

              <div className="business-profile-gallery">
                {gallery.map((image, index) => (
                  <img
                    key={`${image}-${index}`}
                    src={image}
                    alt={`${listing.name} gallery ${index + 1}`}
                    loading="lazy"
                  />
                ))}
              </div>
            </section>
          )}

          {activeTab === "services" && (
            <section className="business-profile-panel business-profile-full-panel">
              <h2>Services Offered</h2>

              <div className="business-profile-services">
                {services.map((service, index) => (
                  <div
                    className="business-profile-service"
                    key={`${service}-${index}`}
                  >
                    <Check size={16} />
                    <span>{service}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "products" && (
            <section className="business-profile-panel business-profile-full-panel">
              <h2>Products / Catalogue</h2>

              <div className="business-profile-empty-tab">
                <ShoppingBag size={30} />

                <h3>Catalogue coming soon</h3>

                <p>
                  Product and catalogue information will appear
                  here when it is added for this business.
                </p>
              </div>
            </section>
          )}

          {activeTab === "location" && (
            <section className="business-profile-panel business-profile-full-panel">
              <h2>Location & Map</h2>

              <div className="business-profile-location-card">
                <MapPin size={24} />

                <div>
                  <strong>{listing.name}</strong>
                  <p>{address}</p>
                </div>
              </div>

              <a
                className="business-profile-map-link"
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Google Maps
                <Navigation size={15} />
              </a>
            </section>
          )}

          {activeTab === "reviews" && (
            <section className="business-profile-panel business-profile-full-panel">
              <h2>Customer Reviews</h2>

              <div className="business-profile-review-summary">
                <Star size={24} fill="currentColor" />

                <strong>
                  {listing.rating.toFixed(1)} / 5.0
                </strong>

                <span>
                  {listing.reviewCount ?? 142} reviews
                </span>
              </div>

              <div className="business-profile-empty-tab">
                <MessageCircle size={28} />

                <h3>Customer feedback</h3>

                <p>
                  Individual customer reviews will appear here
                  once real review data is connected.
                </p>
              </div>
            </section>
          )}
        </div>
      </section>
    </div>
  );
}

export default CityBusinessProfileModal;
