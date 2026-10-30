
import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, CSSProperties } from "react";

import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  FileText,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  Wallet,
  Wrench,
  X,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";
import { services } from "../data/serviceMenu";
import "./ServiceDetailPage.css";

/* =========================================================
   TYPES
========================================================= */

type CustomerReview = {
  name: string;
  rating: number;
  comment: string;
};

type RegisteredServicePrice = {
  id: string;
  name: string;
  price: string;
};

type ProfessionalApplication = {
  id: string;
  fullName: string;
  mobile?: string;
  email?: string;
  city?: string;
  state?: string;
  category?: string;
  services?: string[];
  experience?: string;
  workType?: string;
  workingDays?: string[];
  serviceArea?: string;
  submittedAt?: string;
  status?: string;
  visitingFee?: string;
  about?: string;

  // Profile image saved during registration
  profileImage?: string;
  image?: string;

  // Optional rating and review data
  rating?: number | string;
  reviews?: number;
  reviewCount?: number;
  customerReviews?: CustomerReview[];
};

type Professional = {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  area: string;
  experience: string;
  responseTime: string;
  customerReviews: CustomerReview[];
  category: string;
  services: string[];
  workType: string;
  workingDays: string[];
  city: string;
  state: string;
  about: string;
  visitingFee: string;
  servicePrices: RegisteredServicePrice[];
};

/* =========================================================
   STORAGE KEYS
========================================================= */

const APPLICATION_KEY = "oneservice_professional_application";
const APPLICATIONS_KEY = "oneservice_professional_applications";
const PROFESSIONALS_KEY = "oneservice_professionals";
const PRICING_KEY = "oneservice_professional_service_prices";
const AVAILABILITY_KEY = "oneservice_professional_accepting_calls";

const DEFAULT_PROFESSIONAL_IMAGE = "/images/professionals/image1.avif";

/* =========================================================
   STORAGE HELPERS
========================================================= */

function safeReadJson<T>(key: string): T | null {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

function readRegisteredApplications(): ProfessionalApplication[] {
  const candidates: ProfessionalApplication[] = [];

  const single = safeReadJson<
    ProfessionalApplication | ProfessionalApplication[]
  >(APPLICATION_KEY);

  const collectionA =
    safeReadJson<ProfessionalApplication[]>(APPLICATIONS_KEY);

  const collectionB =
    safeReadJson<ProfessionalApplication[]>(PROFESSIONALS_KEY);

  if (Array.isArray(single)) {
    candidates.push(...single);
  } else if (single && typeof single === "object") {
    candidates.push(single);
  }

  if (Array.isArray(collectionA)) {
    candidates.push(...collectionA);
  }

  if (Array.isArray(collectionB)) {
    candidates.push(...collectionB);
  }

  const unique = new Map<string, ProfessionalApplication>();

  candidates.forEach((item, index) => {
    if (item?.id && item.fullName) {
      unique.set(String(item.id), item);
    } else if (item?.fullName) {
      unique.set(
        `professional-${index}-${item.fullName}`,
        item
      );
    }
  });

  return [...unique.values()];
}

function readPricesForProfessional(
  id: string
): RegisteredServicePrice[] {
  const perProfessional = safeReadJson<RegisteredServicePrice[]>(
    `${PRICING_KEY}_${id}`
  );

  if (Array.isArray(perProfessional)) {
    return perProfessional;
  }

  const stored = safeReadJson<
    RegisteredServicePrice[] |
    Record<string, RegisteredServicePrice[]>
  >(PRICING_KEY);

  if (Array.isArray(stored)) {
    return stored;
  }

  if (
    stored &&
    typeof stored === "object" &&
    Array.isArray(stored[id])
  ) {
    return stored[id];
  }

  return [];
}

/* =========================================================
   PROFESSIONAL IMAGE
========================================================= */

function ProfessionalAvatar({
  src,
  name,
  className = "",
}: {
  src?: string;
  name: string;
  className?: string;
}) {
  const [imageFailed, setImageFailed] = useState(!src);

  useEffect(() => {
    setImageFailed(!src);
  }, [src]);

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  if (!src || imageFailed) {
    return (
      <span
        className={`professional-image-fallback ${className}`}
        aria-label={`${name} profile`}
        role="img"
      >
        {initials || "P"}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={`${name} profile`}
      className={className}
      loading="lazy"
      onError={() => setImageFailed(true)}
    />
  );
}

/* =========================================================
   NORMALIZE PROFESSIONAL DATA
========================================================= */

function normalizeProfessional(
  application: ProfessionalApplication
): Professional {
  const parsedRating = Number(application.rating) || 0;

  const rating = Math.max(
    0,
    Math.min(5, parsedRating)
  );

  const customerReviews = Array.isArray(
    application.customerReviews
  )
    ? application.customerReviews.filter(
        (review) =>
          review &&
          typeof review.name === "string" &&
          typeof review.comment === "string" &&
          Number(review.rating) >= 1 &&
          Number(review.rating) <= 5
      )
    : [];

  const reviewCount =
    Number(
      application.reviewCount ?? application.reviews
    ) || customerReviews.length;

  return {
    id: String(application.id),
    name: application.fullName,

    // Use the actual registered image first.
    image:
      application.profileImage ||
      application.image ||
      DEFAULT_PROFESSIONAL_IMAGE,

    rating,
    reviews: reviewCount,
    customerReviews,

    area:
      application.serviceArea ||
      [application.city, application.state]
        .filter(Boolean)
        .join(", ") ||
      "Service area not provided",

    experience:
      application.experience || "Experience not provided",

    responseTime: "Response time varies",

    category:
      application.category || "Professional service",

    services: Array.isArray(application.services)
      ? application.services
      : [],

    workType:
      application.workType || "Not specified",

    workingDays: Array.isArray(application.workingDays)
      ? application.workingDays
      : [],

    city: application.city || "",
    state: application.state || "",
    about: application.about || "",
    visitingFee: application.visitingFee || "",

    servicePrices: readPricesForProfessional(
      String(application.id)
    ),
  };
}

/* =========================================================
   SERVICE MATCHING
========================================================= */

function matchesService(
  professional: Professional,
  service: (typeof services)[number]
): boolean {
  const normalize = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();

  const targets = [
    service.name,
    service.shortName,
    service.category,
    ...(service.serviceTypes || []),
  ]
    .filter(Boolean)
    .map((value) => normalize(String(value)));

  const offered = [
    professional.category,
    ...professional.services,
    ...professional.servicePrices.map((item) => item.name),
  ]
    .filter(Boolean)
    .map(normalize);

  return offered.some((entry) =>
    targets.some(
      (target) =>
        entry === target ||
        entry.includes(target) ||
        target.includes(entry)
    )
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

function ServiceDetailPage() {
  const { serviceId } = useParams();

  const service = services.find(
    (item) =>
      item.id === serviceId ||
      item.legacyIds?.includes(serviceId ?? "")
  );

  /* =======================================================
     REGISTERED PROFESSIONALS
  ======================================================= */

  const [registeredProfessionals, setRegisteredProfessionals] =
    useState<Professional[]>([]);

  useEffect(() => {
    const loadProfessionals = () => {
      const applications = readRegisteredApplications();

      const available = applications
        .filter(
          (application) =>
            (application.status || "").toLowerCase() ===
            "approved"
        )
        .filter(() => {
          try {
            return (
              localStorage.getItem(AVAILABILITY_KEY) !==
              "false"
            );
          } catch {
            return true;
          }
        })
        .map(normalizeProfessional);

      setRegisteredProfessionals(available);
    };

    loadProfessionals();

    const onStorage = (event: StorageEvent) => {
      if (
        !event.key ||
        [
          APPLICATION_KEY,
          APPLICATIONS_KEY,
          PROFESSIONALS_KEY,
          PRICING_KEY,
          AVAILABILITY_KEY,
        ].includes(event.key) ||
        event.key.startsWith(`${PRICING_KEY}_`)
      ) {
        loadProfessionals();
      }
    };

    const onProfessionalChange = () => loadProfessionals();

    window.addEventListener("storage", onStorage);

    window.addEventListener(
      "oneservice-professional-change",
      onProfessionalChange
    );

    return () => {
      window.removeEventListener("storage", onStorage);

      window.removeEventListener(
        "oneservice-professional-change",
        onProfessionalChange
      );
    };
  }, []);

  const professionals = useMemo(
    () =>
      service
        ? registeredProfessionals.filter((professional) =>
            matchesService(professional, service)
          )
        : [],
    [registeredProfessionals, service]
  );

  /* =======================================================
     SERVICE SELECTION
  ======================================================= */

  const [selectedIssue, setSelectedIssue] =
    useState<string | null>(null);

  const [selectedType, setSelectedType] =
    useState<string | null>(null);

  /* =======================================================
     BOOKING POPUP
  ======================================================= */

  const [showBookingPopup, setShowBookingPopup] =
    useState(false);

  const [showCustomerForm, setShowCustomerForm] =
    useState(false);

  const [requestSubmitted, setRequestSubmitted] =
    useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  /* =======================================================
     CALLBACK POPUP
  ======================================================= */

  const [showCallbackPopup, setShowCallbackPopup] =
    useState(false);

  const [callbackSubmitted, setCallbackSubmitted] =
    useState(false);

  const [callbackName, setCallbackName] = useState("");
  const [callbackPhone, setCallbackPhone] = useState("");

  /* =======================================================
     PROFESSIONAL SELECTION AND DETAILS POPUP
  ======================================================= */

  const [selectedProfessional, setSelectedProfessional] =
    useState<string | null>(null);

  const [isProfessionalPopupPinned, setIsProfessionalPopupPinned] =
    useState(false);

  const professionalPopupCloseTimer =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const [confirmedProfessional, setConfirmedProfessional] =
    useState<string | null>(null);

  const [professionalRowStart, setProfessionalRowStart] =
    useState(0);

  /* =======================================================
     DERIVED VALUES
  ======================================================= */

  const canBook =
    selectedIssue !== null && selectedType !== null;

  const topProfessional = professionals[0] ?? null;

  const selectedProfessionalDetails =
    professionals.find(
      (professional) =>
        professional.id === selectedProfessional
    ) ?? null;

  const confirmedProfessionalDetails =
    professionals.find(
      (professional) =>
        professional.id === confirmedProfessional
    ) ?? null;

  /* =======================================================
     PROFESSIONAL CAROUSEL
  ======================================================= */

  const professionalRows = Array.from(
    {
      length: Math.ceil(professionals.length / 3),
    },
    (_, index) =>
      professionals.slice(index * 3, index * 3 + 3)
  );

  const visibleProfessionalRows =
    professionalRows.length > 0
      ? Array.from(
          {
            length: Math.min(2, professionalRows.length),
          },
          (_, index) =>
            professionalRows[
              (professionalRowStart + index) %
                professionalRows.length
            ]
        )
      : [];

  const visibleProfessionals =
    visibleProfessionalRows.flat();

  const showNextProfessionalRow = () => {
    if (professionalRows.length <= 1) return;

    setProfessionalRowStart(
      (current) =>
        (current + 1) % professionalRows.length
    );
  };

  /* =======================================================
     PROFESSIONAL POPUP HANDLERS
  ======================================================= */

  const cancelProfessionalPopupClose = () => {
    if (professionalPopupCloseTimer.current !== null) {
      clearTimeout(professionalPopupCloseTimer.current);
      professionalPopupCloseTimer.current = null;
    }
  };

  const scheduleProfessionalPopupClose = () => {
    cancelProfessionalPopupClose();

    professionalPopupCloseTimer.current = setTimeout(() => {
      setSelectedProfessional(null);
      professionalPopupCloseTimer.current = null;
    }, 220);
  };

  const closeProfessionalPopup = () => {
    cancelProfessionalPopupClose();
    setSelectedProfessional(null);
    setIsProfessionalPopupPinned(false);
  };

  const confirmProfessionalSelection = () => {
    if (selectedProfessional !== null) {
      setConfirmedProfessional(selectedProfessional);
    }

    closeProfessionalPopup();
  };

  useEffect(() => {
    return () => {
      if (professionalPopupCloseTimer.current !== null) {
        clearTimeout(professionalPopupCloseTimer.current);
      }
    };
  }, []);

  /* =======================================================
     BOOKING HANDLERS
  ======================================================= */

  const closeBookingPopup = () => {
    setShowBookingPopup(false);
    setShowCustomerForm(false);
    setRequestSubmitted(false);
  };

  const resetBookingPopup = () => {
    closeBookingPopup();
    setCustomerName("");
    setCustomerPhone("");
  };

  /* =======================================================
     CALLBACK HANDLERS
  ======================================================= */

  const closeCallbackPopup = () => {
    setShowCallbackPopup(false);
    setCallbackSubmitted(false);
  };

  const resetCallbackPopup = () => {
    closeCallbackPopup();
    setCallbackName("");
    setCallbackPhone("");
  };

  /* =======================================================
     SERVICE NOT FOUND
  ======================================================= */

  if (!service) {
    return (
      <main className="service-not-found">
        <h1>Service not found</h1>
        <Link to="/services">Back to Services</Link>
      </main>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="service-detail-page">
      {/* HERO */}

      <section className="service-detail-hero">
        <div className="service-detail-hero-image">
          <img src={service.image} alt={service.name} />
        </div>

        <div className="service-detail-hero-overlay" />

        <div className="service-detail-hero-content">
          <div className="service-breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={14} />
            <Link to="/services">Services</Link>
            <ChevronRight size={14} />
            <span>{service.name}</span>
          </div>

          <span className="detail-category">
            {service.category}
          </span>

          <h1>{service.name}</h1>

          <p>{service.description}</p>

          <div className="detail-meta">
            <div className="detail-rating">
              <Star size={16} fill="currentColor" />
              <strong>{service.rating}</strong>
              <span>({service.reviews} reviews)</span>
            </div>

            <div className="detail-price">
              Starting from{" "}
              <strong>₹{service.price}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* NAVIGATION TABS */}

      <nav className="service-detail-tabs">
        <a href="#overview" className="active">
          Overview
        </a>
        <a href="#process">Process</a>
        <a href="#issues">Common Issues</a>
        <a href="#types">Service Types</a>
        <a href="#professionals">Professionals</a>
        <a href="#benefits">Benefits</a>
        <a href="#faq">FAQ</a>
        <a href="#reviews">Reviews</a>
      </nav>

      {/* MAIN CONTENT */}

      <section className="service-detail-body">
        <div className="service-detail-main">
          {/* OVERVIEW */}

          <section id="overview" className="detail-section">
            <span className="detail-section-label">
              ABOUT THIS SERVICE
            </span>

            <h2>
              Professional {service.shortName} you can
              <span> rely on.</span>
            </h2>

            <p>
              {service.description} Our certified professionals
              are equipped to diagnose issues, explain the
              required work and provide reliable service at
              your doorstep.
            </p>
          </section>

          {/* SERVICE PROCESS */}

          <section id="process" className="detail-section">
            <span className="detail-section-label">
              OUR SERVICE PROCESS
            </span>

            <h2>Simple from booking to completion</h2>

            <div className="process-grid">
              {service.process.map((step, index) => (
                <div
                  className="process-step"
                  key={step}
                  style={
                    {
                      "--step-index": index,
                    } as CSSProperties
                  }
                >
                  <div className="process-number">
                    <span>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <span className="process-step-label">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* COMMON ISSUES */}

          <section id="issues" className="detail-section">
            <span className="detail-section-label">
              COMMON ISSUES
            </span>

            <h2>What can we help with?</h2>

            <p className="issues-helper-text">
              Choose one of the issues below to continue.
            </p>

            <div className="issues-grid">
              {service.commonIssues.map((issue) => {
                const isSelected = selectedIssue === issue;

                return (
                  <button
                    type="button"
                    key={issue}
                    className={`issue-item ${
                      isSelected ? "selected" : ""
                    }`}
                    aria-pressed={isSelected}
                    onClick={() =>
                      setSelectedIssue(
                        isSelected ? null : issue
                      )
                    }
                  >
                    <CheckCircle2
                      size={17}
                      className="issue-check"
                    />
                    <span>{issue}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* SERVICE TYPES */}

          <section id="types" className="detail-section">
            <span className="detail-section-label">
              SERVICE TYPES
            </span>

            <h2>Choose the service you need</h2>

            <div className="service-type-grid">
              {service.serviceTypes.map((type) => {
                const isSelected = selectedType === type;

                return (
                  <button
                    type="button"
                    key={type}
                    className={`service-type-card ${
                      isSelected ? "selected" : ""
                    }`}
                    aria-pressed={isSelected}
                    onClick={() =>
                      setSelectedType(
                        isSelected ? null : type
                      )
                    }
                  >
                    <Wrench size={19} />
                    <span>{type}</span>

                    {isSelected && (
                      <CheckCircle2
                        size={17}
                        className="selection-check"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* CHOOSE YOUR PROFESSIONAL */}

          <section id="professionals" className="detail-section">
            <span className="detail-section-label">
              OUR PROFESSIONALS
            </span>

            <h2>Choose your professional</h2>

            <p className="professional-section-description">
              Select a professional based on their experience,
              ratings, and service area. Select a card to see
              their full profile.
            </p>

            <div
              key={professionalRowStart}
              className="professional-selection-grid professional-grid-animated"
            >
              {visibleProfessionals.map((professional) => {
                const isSelected =
                  selectedProfessional === professional.id ||
                  confirmedProfessional === professional.id;

                return (
                  <button
                    type="button"
                    key={professional.id}
                    className={`professional-selection-card ${
                      isSelected ? "selected" : ""
                    }`}
                    onMouseEnter={() => {
                      cancelProfessionalPopupClose();

                      if (!isProfessionalPopupPinned) {
                        setSelectedProfessional(professional.id);
                      }
                    }}
                    onMouseLeave={() => {
                      if (!isProfessionalPopupPinned) {
                        scheduleProfessionalPopupClose();
                      }
                    }}
                    onFocus={() => {
                      cancelProfessionalPopupClose();

                      if (!isProfessionalPopupPinned) {
                        setSelectedProfessional(professional.id);
                      }
                    }}
                    onBlur={() => {
                      if (!isProfessionalPopupPinned) {
                        scheduleProfessionalPopupClose();
                      }
                    }}
                    onClick={() => {
                      cancelProfessionalPopupClose();
                      setSelectedProfessional(professional.id);
                      setIsProfessionalPopupPinned(true);
                    }}
                    aria-pressed={
                      confirmedProfessional === professional.id
                    }
                  >
                    <div className="professional-selection-photo">
                      <ProfessionalAvatar
                        src={professional.image}
                        name={professional.name}
                      />

                      {isSelected && (
                        <span className="professional-selected-badge">
                          <CheckCircle2 size={12} />
                          Selected
                        </span>
                      )}
                    </div>

                    <div className="professional-selection-info">
                      <h3>{professional.name}</h3>

                      <div className="professional-verified-row">
                        <span
                          className="professional-verified-badge"
                          title="Verified Professional"
                        >
                          <CheckCircle2 size={12} />
                          Verified
                        </span>
                      </div>

                      <div className="professional-selection-rating">
                        <BriefcaseBusiness size={13} />
                        <strong>{professional.category}</strong>
                      </div>

                      <p className="professional-selection-area">
                        <MapPin size={13} />
                        <span>{professional.area}</span>
                      </p>

                      <span className="professional-experience">
                        {professional.experience} experience
                      </span>

                      {professional.rating > 0 && (
                        <span className="professional-card-rating">
                          <Star
                            size={13}
                            fill="currentColor"
                          />
                          {professional.rating.toFixed(1)}
                          {professional.reviews > 0 &&
                            ` (${professional.reviews})`}
                        </span>
                      )}

                      {professional.servicePrices.some(
                        (item) =>
                          Number.isFinite(Number(item.price)) &&
                          Number(item.price) >= 0
                      ) && (
                        <span className="professional-card-price">
                          From ₹
                          {Math.min(
                            ...professional.servicePrices
                              .map((item) => Number(item.price))
                              .filter(
                                (price) =>
                                  Number.isFinite(price) &&
                                  price >= 0
                              )
                          ).toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {professionals.length === 0 && (
              <div className="professional-empty-state">
                <BriefcaseBusiness size={24} />
                <strong>
                  No approved professionals available for this
                  service yet.
                </strong>
                <p>
                  Approved professionals who register for{" "}
                  {service.name} will appear here.
                </p>
              </div>
            )}

            {professionals.length > 3 && (
              <div className="professional-carousel-controls">
                <button
                  type="button"
                  className="professional-next-row"
                  aria-label="Show next professionals"
                  onClick={showNextProfessionalRow}
                >
                  <ChevronDown size={16} />
                </button>
              </div>
            )}
          </section>

          {/* BENEFITS */}

          <section id="benefits" className="detail-section">
            <span className="detail-section-label">
              WHY NEED ONE SERVICE
            </span>

            <h2>Built around your convenience</h2>

            <div className="benefits-grid">
              {service.benefits.map((benefit) => (
                <div className="detail-benefit" key={benefit}>
                  <ShieldCheck size={20} />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}

          <section id="faq" className="detail-section">
            <span className="detail-section-label">FAQ</span>

            <h2>Frequently asked questions</h2>

            <div className="faq-list">
              <details open>
                <summary>How do I book this service?</summary>
                <p>
                  Select a common issue and a service type, then
                  click Book Now to continue with your booking.
                </p>
              </details>

              <details>
                <summary>
                  Will the professional visit my home?
                </summary>
                <p>
                  Yes. NEED ONE SERVICE connects you with a
                  professional who can provide the service at
                  your selected location.
                </p>
              </details>

              <details>
                <summary>Is the final price fixed?</summary>
                <p>
                  The displayed starting price is indicative.
                  Any additional work or parts will be explained
                  before proceeding.
                </p>
              </details>
            </div>
          </section>

          {/* REVIEWS */}

          <section id="reviews" className="detail-section">
            <span className="detail-section-label">REVIEWS</span>

            <h2>What customers say</h2>

            <div className="review-card">
              <div className="review-avatar">
                <Star size={18} />
              </div>

              <div>
                <strong>
                  Customer reviews will appear here
                </strong>
                <p>
                  Verified customer ratings and feedback will
                  be displayed after customers complete services
                  and submit their reviews.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* SIDEBAR */}

        <aside className="service-detail-sidebar">
          {/* BOOKING CARD */}

          <div className="booking-card">
            <span>Starting from</span>

            <strong className="booking-price">
              ₹{service.price}
            </strong>

            <small>Visit charge may apply</small>

            <button
              type="button"
              className="book-now-button"
              disabled={!canBook}
              onClick={() => {
                if (canBook) setShowBookingPopup(true);
              }}
            >
              Book Now
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="callback-button"
              disabled={!canBook}
              onClick={() => {
                if (canBook) setShowCallbackPopup(true);
              }}
            >
              <Phone size={17} />
              Get a Callback
            </button>

            {!canBook && (
              <small className="booking-hint">
                Choose a common issue and service type to
                continue.
              </small>
            )}
          </div>

          {/* TOP PROFESSIONAL */}

          <div className="professional-card top-professional-card">
            <div className="professional-card-heading">
              <Star size={19} fill="currentColor" />
              <strong>Top Professional</strong>
            </div>

            {topProfessional ? (
              <>
                <div className="professional-profile">
                  <div className="professional-avatar professional-avatar-photo">
                    <ProfessionalAvatar
                      src={topProfessional.image}
                      name={topProfessional.name}
                    />
                  </div>

                  <div className="professional-profile-info">
                    <strong>{topProfessional.name}</strong>

                    <span>{topProfessional.category}</span>

                    <div className="professional-rating">
                      <BadgeCheck size={13} />
                      <strong>Registered Professional</strong>
                    </div>
                  </div>
                </div>

                <div className="verified-row">
                  <CheckCircle2 size={14} />
                  Verified Professional
                </div>

                <div className="experience-row">
                  <Clock3 size={14} />
                  {topProfessional.experience} Experience
                </div>

                <div className="experience-row">
                  <MapPin size={14} />
                  {topProfessional.area}
                </div>

                {topProfessional.rating > 0 && (
                  <div className="experience-row">
                    <Star
                      size={14}
                      fill="currentColor"
                    />
                    {topProfessional.rating.toFixed(1)} rating
                    {topProfessional.reviews > 0 &&
                      ` · ${topProfessional.reviews} reviews`}
                  </div>
                )}
              </>
            ) : (
              <p className="professional-empty-note">
                No approved professional is listed for this
                service yet.
              </p>
            )}
          </div>

          {/* SERVICE LOCATIONS */}

          <div className="location-card">
            <div className="location-heading">
              <MapPin size={19} />
              <strong>Service Locations</strong>
            </div>

            <ul>
              {[...new Set(service.locations)].map(
                (location) => (
                  <li key={location}>{location}</li>
                )
              )}
            </ul>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("professionals")
                  ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
              }
            >
              Find a Professional
              <ArrowRight size={14} />
            </button>
          </div>
        </aside>
      </section>

      {/* =====================================================
          SELECTED PROFESSIONAL DETAIL POPUP
      ===================================================== */}

      {selectedProfessionalDetails && (
        <div
          className={`professional-popup-backdrop ${
            isProfessionalPopupPinned ? "pinned" : "preview"
          }`}
          onClick={
            isProfessionalPopupPinned
              ? closeProfessionalPopup
              : undefined
          }
        >
          <section
            className="professional-detail-popup"
            role="dialog"
            aria-modal={isProfessionalPopupPinned}
            aria-labelledby="professional-popup-title"
            onMouseEnter={cancelProfessionalPopupClose}
            onMouseLeave={() => {
              if (!isProfessionalPopupPinned) {
                scheduleProfessionalPopupClose();
              }
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="professional-popup-close"
              aria-label="Close professional details"
              onClick={closeProfessionalPopup}
            >
              <X size={19} />
            </button>

            <span className="professional-popup-label">
              <CheckCircle2 size={15} />
              Professional Profile
            </span>

            {/* PROFILE HEADER */}

            <div className="professional-popup-profile">
              <ProfessionalAvatar
                src={selectedProfessionalDetails.image}
                name={selectedProfessionalDetails.name}
                className="professional-popup-avatar"
              />

              <div>
                <h2 id="professional-popup-title">
                  {selectedProfessionalDetails.name}
                </h2>

                <p>
                  {selectedProfessionalDetails.category}
                </p>

                <div className="professional-popup-rating">
                  <BadgeCheck size={15} />
                  <strong>Registered Professional</strong>
                </div>
              </div>
            </div>

            {/* RATING SUMMARY */}

            <div className="professional-popup-rating-card">
              <div className="professional-popup-rating-summary">
                <div className="professional-popup-rating-score">
                  {selectedProfessionalDetails.rating > 0
                    ? selectedProfessionalDetails.rating.toFixed(1)
                    : "New"}
                </div>

                <div className="professional-popup-rating-content">
                  <div className="professional-popup-stars">
                    {Array.from(
                      { length: 5 },
                      (_, index) => (
                        <Star
                          key={index}
                          size={17}
                          fill={
                            index <
                            Math.round(
                              selectedProfessionalDetails.rating
                            )
                              ? "currentColor"
                              : "none"
                          }
                        />
                      )
                    )}
                  </div>

                  <strong>
                    {selectedProfessionalDetails.reviews > 0
                      ? `${selectedProfessionalDetails.reviews} Customer Reviews`
                      : "No reviews yet"}
                  </strong>

                  <span>
                    {selectedProfessionalDetails.rating > 0
                      ? "Customer rating"
                      : "Be the first to review this professional"}
                  </span>
                </div>
              </div>
            </div>

            {/* PROFESSIONAL INFORMATION */}

            <div className="professional-popup-stats">
              <div>
                <Clock3 size={18} />
                <span>Experience</span>
                <strong>
                  {selectedProfessionalDetails.experience}
                </strong>
              </div>

              <div>
                <MapPin size={18} />
                <span>Service Area</span>
                <strong>
                  {selectedProfessionalDetails.area}
                </strong>
              </div>

              <div>
                <BriefcaseBusiness size={18} />
                <span>Work Type</span>
                <strong>
                  {selectedProfessionalDetails.workType}
                </strong>
              </div>
            </div>

            {/* REGISTERED SERVICES AND DETAILS */}

            <div className="professional-popup-reviews professional-popup-details">
              <h3>
                <BriefcaseBusiness size={17} />
                Registered Services
              </h3>

              <div className="professional-popup-service-chips">
                {selectedProfessionalDetails.services.length >
                0 ? (
                  selectedProfessionalDetails.services.map(
                    (item) => (
                      <span key={item}>{item}</span>
                    )
                  )
                ) : (
                  <span>
                    {selectedProfessionalDetails.category}
                  </span>
                )}
              </div>

              <h3>
                <Wallet size={17} />
                Service Charges
              </h3>

              {selectedProfessionalDetails.servicePrices
                .length > 0 ? (
                selectedProfessionalDetails.servicePrices.map(
                  (item) => (
                    <div
                      className="professional-popup-price-row"
                      key={item.id}
                    >
                      <span>{item.name}</span>
                      <strong>
                        ₹
                        {Number(item.price).toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </div>
                  )
                )
              ) : (
                <div className="professional-popup-price-row">
                  <span>Visiting fee</span>
                  <strong>
                    {selectedProfessionalDetails.visitingFee
                      ? `₹${selectedProfessionalDetails.visitingFee}`
                      : "Price not provided"}
                  </strong>
                </div>
              )}

              <h3>
                <CalendarDays size={17} />
                Availability
              </h3>

              <p>
                {selectedProfessionalDetails.workingDays.length >
                0
                  ? selectedProfessionalDetails.workingDays.join(
                      ", "
                    )
                  : "Working days not provided"}
              </p>

              {selectedProfessionalDetails.about && (
                <>
                  <h3>
                    <FileText size={17} />
                    About
                  </h3>

                  <p>
                    {selectedProfessionalDetails.about}
                  </p>
                </>
              )}

              <p className="professional-popup-contact-note">
                For privacy, contact details are shared through
                the booking process.
              </p>
            </div>

            {/* CUSTOMER REVIEWS */}

            <div className="professional-popup-customer-reviews">
              <div className="professional-popup-reviews-heading">
                <h3>
                  <Star size={17} />
                  Customer Reviews
                </h3>

                <span>
                  {selectedProfessionalDetails.reviews} reviews
                </span>
              </div>

              {selectedProfessionalDetails.customerReviews
                .length > 0 ? (
                selectedProfessionalDetails.customerReviews.map(
                  (review, index) => (
                    <div
                      className="professional-popup-review-item"
                      key={`${review.name}-${index}`}
                    >
                      <div className="professional-popup-review-top">
                        <strong>{review.name}</strong>

                        <span>
                          <Star
                            size={13}
                            fill="currentColor"
                          />
                          {Number(review.rating).toFixed(1)}
                        </span>
                      </div>

                      <p>{review.comment}</p>
                    </div>
                  )
                )
              ) : (
                <div className="professional-popup-no-reviews">
                  <Star size={19} />

                  <strong>No customer reviews yet</strong>

                  <p>
                    Customer feedback will appear here after
                    completed services receive verified reviews.
                  </p>
                </div>
              )}
            </div>

            {/* DONE BUTTON */}

            <button
              type="button"
              className="professional-popup-select-button"
              onClick={confirmProfessionalSelection}
            >
              <CheckCircle2 size={17} />
              Done
            </button>
          </section>
        </div>
      )}

      {/* =====================================================
          BOOKING POPUP
      ===================================================== */}

      {showBookingPopup && (
        <div
          className="booking-popup-backdrop"
          onClick={closeBookingPopup}
        >
          <div
            className="booking-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-popup-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="booking-popup-close"
              aria-label="Close booking popup"
              onClick={closeBookingPopup}
            >
              <X size={20} />
            </button>

            {!requestSubmitted ? (
              <>
                {!showCustomerForm ? (
                  <>
                    <h2 id="booking-popup-title">
                      Book Your Service
                    </h2>

                    <p>Your selected service details:</p>

                    <div className="booking-popup-selection">
                      <span>Service</span>
                      <strong>{service.name}</strong>
                    </div>

                    <div className="booking-popup-selection">
                      <span>Common Issue</span>
                      <strong>{selectedIssue}</strong>
                    </div>

                    <div className="booking-popup-selection">
                      <span>Service Type</span>
                      <strong>{selectedType}</strong>
                    </div>

                    <div className="booking-popup-selection">
                      <span>Professional</span>
                      <strong>
                        {confirmedProfessionalDetails?.name ??
                          "Assigned by OneService"}
                      </strong>
                    </div>

                    <div className="booking-popup-selection">
                      <span>Starting Price</span>
                      <strong>₹{service.price}</strong>
                    </div>

                    <button
                      type="button"
                      className="booking-confirm-button"
                      onClick={() =>
                        setShowCustomerForm(true)
                      }
                    >
                      Continue
                      <ArrowRight size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <h2 id="booking-popup-title">
                      Your Contact Details
                    </h2>

                    <p>
                      Enter your details so our team can contact
                      you about your booking.
                    </p>

                    <form
                      className="customer-booking-form"
                      onSubmit={(
                        event: FormEvent<HTMLFormElement>
                      ) => {
                        event.preventDefault();

                        if (
                          !customerName.trim() ||
                          !/^[6-9]\d{9}$/.test(customerPhone)
                        ) {
                          return;
                        }

                        setRequestSubmitted(true);
                      }}
                    >
                      <div className="customer-form-field">
                        <label htmlFor="booking-customer-name">
                          Full Name
                        </label>

                        <input
                          id="booking-customer-name"
                          type="text"
                          placeholder="Enter your full name"
                          value={customerName}
                          onChange={(event) =>
                            setCustomerName(event.target.value)
                          }
                          autoComplete="name"
                          required
                        />
                      </div>

                      <div className="customer-form-field">
                        <label htmlFor="booking-customer-phone">
                          Phone Number
                        </label>

                        <div className="customer-phone-input">
                          <span>+91</span>

                          <input
                            id="booking-customer-phone"
                            type="tel"
                            placeholder="10-digit mobile number"
                            value={customerPhone}
                            onChange={(event) =>
                              setCustomerPhone(
                                event.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 10)
                              )
                            }
                            inputMode="numeric"
                            autoComplete="tel-national"
                            pattern="[6-9][0-9]{9}"
                            title="Enter a valid 10-digit Indian mobile number"
                            maxLength={10}
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="booking-confirm-button"
                      >
                        Submit Request
                        <ArrowRight size={18} />
                      </button>

                      <button
                        type="button"
                        className="booking-back-button"
                        onClick={() =>
                          setShowCustomerForm(false)
                        }
                      >
                        Back to Booking Details
                      </button>
                    </form>
                  </>
                )}
              </>
            ) : (
              <div className="booking-success">
                <div className="booking-success-icon">
                  <CheckCircle2 size={36} />
                </div>

                <h2 id="booking-popup-title">
                  Request Submitted!
                </h2>

                <p>
                  Thank you,{" "}
                  <strong>{customerName.trim()}</strong>.
                </p>

                <p>
                  Your request was submitted successfully. You
                  will receive a call within 24 hours.
                </p>

                <button
                  type="button"
                  className="booking-confirm-button"
                  onClick={resetBookingPopup}
                >
                  Done
                  <CheckCircle2 size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================
          CALLBACK POPUP
      ===================================================== */}

      {showCallbackPopup && (
        <div
          className="booking-popup-backdrop"
          onClick={closeCallbackPopup}
        >
          <div
            className="booking-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="callback-popup-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="booking-popup-close"
              aria-label="Close callback popup"
              onClick={closeCallbackPopup}
            >
              <X size={20} />
            </button>

            {!callbackSubmitted ? (
              <>
                <h2 id="callback-popup-title">
                  Request a Callback
                </h2>

                <p>
                  Enter your details and our team will call you
                  within 24 hours.
                </p>

                <div className="booking-popup-selection">
                  <span>Service</span>
                  <strong>{service.name}</strong>
                </div>

                <div className="booking-popup-selection">
                  <span>Common Issue</span>
                  <strong>{selectedIssue}</strong>
                </div>

                <div className="booking-popup-selection">
                  <span>Service Type</span>
                  <strong>{selectedType}</strong>
                </div>

                <div className="booking-popup-selection">
                  <span>Professional</span>
                  <strong>
                    {confirmedProfessionalDetails?.name ??
                      "Assigned by OneService"}
                  </strong>
                </div>

                <form
                  className="customer-booking-form"
                  onSubmit={(
                    event: FormEvent<HTMLFormElement>
                  ) => {
                    event.preventDefault();

                    if (
                      !callbackName.trim() ||
                      !/^[6-9]\d{9}$/.test(callbackPhone)
                    ) {
                      return;
                    }

                    setCallbackSubmitted(true);
                  }}
                >
                  <div className="customer-form-field">
                    <label htmlFor="callback-customer-name">
                      Full Name
                    </label>

                    <input
                      id="callback-customer-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={callbackName}
                      onChange={(event) =>
                        setCallbackName(event.target.value)
                      }
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div className="customer-form-field">
                    <label htmlFor="callback-customer-phone">
                      Mobile Number
                    </label>

                    <div className="customer-phone-input">
                      <span>+91</span>

                      <input
                        id="callback-customer-phone"
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={callbackPhone}
                        onChange={(event) =>
                          setCallbackPhone(
                            event.target.value
                              .replace(/\D/g, "")
                              .slice(0, 10)
                          )
                        }
                        inputMode="numeric"
                        autoComplete="tel-national"
                        pattern="[6-9][0-9]{9}"
                        title="Enter a valid 10-digit Indian mobile number"
                        maxLength={10}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="booking-confirm-button"
                  >
                    Request a Callback
                    <Phone size={17} />
                  </button>
                </form>
              </>
            ) : (
              <div className="booking-success">
                <div className="booking-success-icon">
                  <CheckCircle2 size={36} />
                </div>

                <h2 id="callback-popup-title">
                  Callback Requested!
                </h2>

                <p>
                  Thank you,{" "}
                  <strong>{callbackName.trim()}</strong>.
                </p>

                <p>
                  Your callback request has been submitted. You
                  will receive a call within 24 hours.
                </p>

                <button
                  type="button"
                  className="booking-confirm-button"
                  onClick={resetCallbackPopup}
                >
                  <CheckCircle2 size={17} />
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default ServiceDetailPage;
