import { useState } from "react";
import type { FormEvent, CSSProperties } from "react";

import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  Wrench,
  X,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";
import { services } from "../data/serviceMenu";
import "./ServiceDetailPage.css";

function ServiceDetailPage() {
  const { serviceId } = useParams();

  const professionals = [
    {
      id: 1,
      name: "Rajesh Kumar",
      image: "/images/professionals/image1.avif",
      rating: 4.9,
      reviews: 128,
      area: "MVP Colony, Vizag",
      experience: "8+ years",
    },
    {
      id: 2,
      name: "Suresh Reddy",
      image: "/images/professionals/image1.avif",
      rating: 4.8,
      reviews: 96,
      area: "Madhurawada, Vizag",
      experience: "6+ years",
    },
    {
      id: 3,
      name: "Ravi Teja",
      image: "/images/professionals/image1.avif",
      rating: 4.7,
      reviews: 84,
      area: "Gajuwaka, Vizag",
      experience: "5+ years",
    },
  ];

  const service = services.find((item) => item.id === serviceId);

  // Selection state
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showBookingPopup, setShowBookingPopup] = useState(false);

  // Customer booking popup state
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // Callback popup state
  const [showCallbackPopup, setShowCallbackPopup] = useState(false);
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);
  const [callbackName, setCallbackName] = useState("");
  const [callbackPhone, setCallbackPhone] = useState("");

  // Both selections are required to enable booking
  const canBook = selectedIssue !== null && selectedType !== null;

  const [selectedProfessional, setSelectedProfessional] = useState<
    number | null
  >(null);

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

  const closeCallbackPopup = () => {
    setShowCallbackPopup(false);
    setCallbackSubmitted(false);
  };

  const resetCallbackPopup = () => {
    closeCallbackPopup();
    setCallbackName("");
    setCallbackPhone("");
  };

  if (!service) {
    return (
      <main className="service-not-found">
        {" "}
        <h1>Service not found</h1>
        <Link to="/services">Back to Services</Link>
      </main>
    );
  }

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

          <span className="detail-category">{service.category}</span>

          <h1>{service.name}</h1>

          <p>{service.description}</p>

          <div className="detail-meta">
            <div className="detail-rating">
              <Star size={16} fill="currentColor" />

              <strong>{service.rating}</strong>

              <span>({service.reviews} reviews)</span>
            </div>

            <div className="detail-price">
              Starting from <strong>₹{service.price}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* NAVIGATION TABS */}

      <nav className="service-detail-tabs">
        <a href="#overview" className="active">
          Overview
        </a>

        <a href="#issues">Common Issues</a>

        <a href="#types">Service Types</a>

        <a href="#process">Process</a>

        <a href="#benefits">Benefits</a>

        <a href="#faq">FAQ</a>

        <a href="#reviews">Reviews</a>
      </nav>

      {/* MAIN CONTENT */}

      <section className="service-detail-body">
        <div className="service-detail-main">
          {/* OVERVIEW */}

          <section id="overview" className="detail-section">
            <span className="detail-section-label">ABOUT THIS SERVICE</span>

            <h2>
              Professional {service.shortName} you can
              <span> rely on.</span>
            </h2>

            <p>
              {service.description} Our certified professionals are equipped to
              diagnose issues, explain the required work and provide reliable
              service at your doorstep.
            </p>
          </section>

          {/* COMMON ISSUES */}

          <section id="issues" className="detail-section">
            <span className="detail-section-label">COMMON ISSUES</span>

            <h2>What can we help with?</h2>

            <div className="issues-grid">
              {service.commonIssues.map((issue) => {
                const isSelected = selectedIssue === issue;

                return (
                  <button
                    type="button"
                    key={issue}
                    className={`issue-item ${isSelected ? "selected" : ""}`}
                    aria-pressed={isSelected}
                    onClick={() => setSelectedIssue(isSelected ? null : issue)}
                  >
                    <CheckCircle2 size={17} className="issue-check" />

                    <span>{issue}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* SERVICE TYPES */}

          <section id="types" className="detail-section">
            <span className="detail-section-label">SERVICE TYPES</span>

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
                    onClick={() => setSelectedType(isSelected ? null : type)}
                  >
                    <Wrench size={19} />

                    <span>{type}</span>

                    {isSelected && (
                      <CheckCircle2 size={17} className="selection-check" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* CHOOSE YOUR PROFESSIONAL */}

          <section id="professionals" className="detail-section">
            <span className="detail-section-label">OUR PROFESSIONALS</span>

            <h2>Choose your professional</h2>

            <p className="professional-section-description">
              Select a professional based on their experience, ratings, and
              service area.
            </p>

            <div className="professional-selection-grid">
              {professionals.map((professional) => {
                const isSelected = selectedProfessional === professional.id;

                return (
                  <button
                    type="button"
                    key={professional.id}
                    className={`professional-selection-card ${
                      isSelected ? "selected" : ""
                    }`}
                    onClick={() =>
                      setSelectedProfessional(
                        isSelected ? null : professional.id,
                      )
                    }
                    aria-pressed={isSelected}
                  >
                    {/* Professional photo */}
                    <div className="professional-selection-photo">
                      <img
                        src={professional.image}
                        alt={professional.name}
                        loading="lazy"
                      />

                      {isSelected && (
                        <span className="professional-selected-badge">
                          <CheckCircle2 size={12} />
                          Selected
                        </span>
                      )}
                    </div>

                    {/* Professional details */}
                    <div className="professional-selection-info">
                      {/* Professional name */}
                      <h3>{professional.name}</h3>

                      {/* Verified badge below the name */}
                      <div className="professional-verified-row">
                        <span
                          className="professional-verified-badge"
                          title="Verified Professional"
                        >
                          <CheckCircle2 size={12} />
                          Verified
                        </span>
                      </div>

                      {/* Rating */}
                      <div className="professional-selection-rating">
                        <Star size={13} fill="currentColor" />
                        <strong>{professional.rating}</strong>
                        <span>({professional.reviews} reviews)</span>
                      </div>

                      {/* Service area */}
                      <p className="professional-selection-area">
                        <MapPin size={13} />
                        <span>{professional.area}</span>
                      </p>

                      {/* Experience */}
                      <span className="professional-experience">
                        {professional.experience} experience
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* SERVICE PROCESS */}

          <section id="process" className="detail-section">
            <span className="detail-section-label">OUR SERVICE PROCESS</span>

            <h2>Simple from booking to completion</h2>

            <div className="process-grid">
              {service.process.map((step, index) => (
                <div
                  className="process-step"
                  key={step}
                  style={{ "--step-index": index } as CSSProperties}
                >
                  <div className="process-number">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </div>

                  <span className="process-step-label">{step}</span>
                </div>
              ))}
            </div>
          </section>

          {/* BENEFITS */}

          <section id="benefits" className="detail-section">
            <span className="detail-section-label">WHY NEED ONE SERVICE</span>

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
                  Select a common issue and a service type, then click Book Now
                  to continue with your booking.
                </p>
              </details>

              <details>
                <summary>Will the professional visit my home?</summary>

                <p>
                  Yes. NEED ONE SERVICE connects you with a professional who can
                  provide the service at your selected location.
                </p>
              </details>

              <details>
                <summary>Is the final price fixed?</summary>

                <p>
                  The displayed starting price is indicative. Any additional
                  work or parts will be explained before proceeding.
                </p>
              </details>
            </div>
          </section>

          {/* REVIEWS */}

          <section id="reviews" className="detail-section">
            <span className="detail-section-label">REVIEWS</span>

            <h2>What customers say</h2>

            <div className="review-card">
              <div className="review-avatar">RK</div>

              <div>
                <strong>Rajesh Kumar</strong>

                <div className="review-stars">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>

                <p>
                  Professional service and quick response. The technician
                  explained everything clearly.
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

            <strong className="booking-price">₹{service.price}</strong>

            <small>Visit charge may apply</small>

            <button
              type="button"
              className="book-now-button"
              disabled={!canBook}
              onClick={() => {
                if (canBook) {
                  setShowBookingPopup(true);
                }
              }}
            >
              Book Now
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="callback-button"
              onClick={() => {
                if (canBook) {
                  setShowCallbackPopup(true);
                }
              }}
              disabled={!canBook}
            >
              <Phone size={17} />
              Get a Callback
            </button>
          </div>

          {/* TOP PROFESSIONAL CARD */}

          <div className="professional-card">
            <div className="professional-card-heading">
              <Star size={19} fill="currentColor" />

              <strong>Top Professional</strong>
            </div>

            <div className="professional-profile">
              <div className="professional-avatar">RK</div>

              <div>
                <strong>Rajesh Kumar</strong>

                <span>{service.shortName} Specialist</span>

                <div className="professional-rating">
                  <Star size={13} fill="currentColor" />
                  <strong>4.9</strong>
                  <span>(128 reviews)</span>
                </div>
              </div>
            </div>

            <div className="verified-row">
              <CheckCircle2 size={14} />
              Top Rated Professional
            </div>

            <div className="experience-row">
              <Clock3 size={14} />
              8+ Years Experience
            </div>
          </div>

          {/* SERVICE LOCATIONS */}

          <div className="location-card">
            <div className="location-heading">
              <MapPin size={19} />

              <strong>Service Locations</strong>
            </div>

            <ul>
              {[...new Set(service.locations)].map((location) => (
                <li key={location}>{location}</li>
              ))}
            </ul>

            <button type="button">
              More Areas
              <ArrowRight size={14} />
            </button>
          </div>
        </aside>
      </section>

      {/* BOOKING POPUP */}

      {showBookingPopup && (
        <div className="booking-popup-backdrop" onClick={closeBookingPopup}>
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
                    <h2 id="booking-popup-title">Book Your Service</h2>

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
                        {selectedProfessional !== null
                          ? (professionals.find(
                              (professional) =>
                                professional.id === selectedProfessional,
                            )?.name ?? "Assigned by OneService")
                          : "Assigned by OneService"}
                      </strong>
                    </div>

                    <div className="booking-popup-selection">
                      <span>Starting Price</span>
                      <strong>₹{service.price}</strong>
                    </div>

                    <button
                      type="button"
                      className="booking-confirm-button"
                      onClick={() => setShowCustomerForm(true)}
                    >
                      Continue
                      <ArrowRight size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <h2 id="booking-popup-title">Your Contact Details</h2>

                    <p>
                      Enter your details so our team can contact you about your
                      booking.
                    </p>

                    <form
                      className="customer-booking-form"
                      onSubmit={(event: FormEvent<HTMLFormElement>) => {
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
                        <label htmlFor="booking-customer-name">Full Name</label>

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
                                  .slice(0, 10),
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

                      <button type="submit" className="booking-confirm-button">
                        Submit Request
                        <ArrowRight size={18} />
                      </button>

                      <button
                        type="button"
                        className="booking-back-button"
                        onClick={() => setShowCustomerForm(false)}
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

                <h2 id="booking-popup-title">Request Submitted!</h2>

                <p>
                  Thank you, <strong>{customerName.trim()}</strong>.
                </p>

                <p>
                  Your request was submitted successfully. You will receive a
                  call within 24 hours.
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

      {/* CALLBACK POPUP */}

      {showCallbackPopup && (
        <div className="booking-popup-backdrop" onClick={closeCallbackPopup}>
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
                <h2 id="callback-popup-title">Request a Callback</h2>

                <p>
                  Enter your details and our team will call you within 24 hours.
                </p>

                <form
                  className="customer-booking-form"
                  onSubmit={(event: FormEvent<HTMLFormElement>) => {
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
                    <label htmlFor="callback-customer-name">Full Name</label>

                    <input
                      id="callback-customer-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={callbackName}
                      onChange={(event) => setCallbackName(event.target.value)}
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
                            event.target.value.replace(/\D/g, "").slice(0, 10),
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

                  <button type="submit" className="booking-confirm-button">
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

                <h2 id="callback-popup-title">Callback Requested!</h2>

                <p>
                  Thank you, <strong>{callbackName.trim()}</strong>.
                </p>

                <p>
                  Your callback request has been submitted. You will receive a
                  call within 24 hours.
                </p>

                <button
                  type="button"
                  className="booking-confirm-button"
                  onClick={resetCallbackPopup}
                >
                  Done
                  <CheckCircle2 size={18} />
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
