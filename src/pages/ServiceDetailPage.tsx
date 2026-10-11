

import { useState } from "react";

import type { FormEvent, CSSProperties } from "react";



import {

  ArrowRight,

  CheckCircle2,

  ChevronDown,

  ChevronRight,

  Clock3,

  MapPin,

  Phone,

  ShieldCheck,

  Star,

  Wrench,

  Zap,

  X,

} from "lucide-react";



import { Link, useParams } from "react-router-dom";

import { services } from "../data/serviceMenu";

import "./ServiceDetailPage.css";



type CustomerReview = {

  name: string;

  rating: number;

  comment: string;

};



type Professional = {

  id: number;

  name: string;

  image: string;

  rating: number;

  reviews: number;

  area: string;

  experience: string;

  responseTime: string;

  customerReviews: CustomerReview[];

};



function ServiceDetailPage() {

  const { serviceId } = useParams();



  const professionals: Professional[] = [

    {

      id: 1,

      name: "Rajesh Kumar",

      image: "/images/professionals/image1.avif",

      rating: 5.0,

      reviews: 128,

      area: "MVP Colony, Vizag",

      experience: "8+ years",

      responseTime: "Within 15 minutes",

      customerReviews: [

        {

          name: "Anil Kumar",

          rating: 5,

          comment:

            "Excellent service! Arrived on time and explained the repair clearly.",

        },

        {

          name: "Priya Sharma",

          rating: 5,

          comment:

            "Very professional and responsive. The work was completed perfectly.",

        },

      ],

    },

    {

      id: 2,

      name: "Suresh Reddy",

      image: "/images/professionals/image1.avif",

      rating: 4.8,

      reviews: 96,

      area: "Madhurawada, Vizag",

      experience: "6+ years",

      responseTime: "Within 30 minutes",

      customerReviews: [

        {

          name: "Kiran Kumar",

          rating: 5,

          comment:

            "Good experience. He responded quickly and did a neat job.",

        },

        {

          name: "Sneha Reddy",

          rating: 4,

          comment:

            "Professional service and friendly communication.",

        },

      ],

    },

    {

      id: 3,

      name: "Ravi Teja",

      image: "/images/professionals/image1.avif",

      rating: 4.7,

      reviews: 84,

      area: "Gajuwaka, Vizag",

      experience: "5+ years",

      responseTime: "Within 45 minutes",

      customerReviews: [

        {

          name: "Vamsi Krishna",

          rating: 5,

          comment:

            "Helpful technician who explained everything before starting.",

        },

        {

          name: "Divya",

          rating: 4,

          comment:

            "Good service and a smooth overall experience.",

        },

      ],

    },

    {

      id: 4,

      name: "Arjun Rao",

      image: "/images/professionals/image1.avif",

      rating: 4.9,

      reviews: 112,

      area: "Seethammadhara, Vizag",

      experience: "7+ years",

      responseTime: "Within 20 minutes",

      customerReviews: [

        {

          name: "Praveen",

          rating: 5,

          comment:

            "Very professional and completed the work neatly.",

        },

        {

          name: "Divya",

          rating: 5,

          comment:

            "Good service and arrived on time.",

        },

      ],

    },

    {

      id: 5,

      name: "Kiran Kumar",

      image: "/images/professionals/image1.avif",

      rating: 4.8,

      reviews: 105,

      area: "MVP Colony, Vizag",

      experience: "6+ years",

      responseTime: "Within 25 minutes",

      customerReviews: [

        {

          name: "Sandeep",

          rating: 5,

          comment:

            "Excellent service and friendly professional.",

        },

        {

          name: "Lakshmi",

          rating: 4,

          comment:

            "Work was completed properly.",

        },

      ],

    },

    {

      id: 6,

      name: "Vamsi Krishna",

      image: "/images/professionals/image1.avif",

      rating: 4.7,

      reviews: 89,

      area: "Gajuwaka, Vizag",

      experience: "5+ years",

      responseTime: "Within 30 minutes",

      customerReviews: [

        {

          name: "Ramesh",

          rating: 5,

          comment:

            "Quick response and reliable service.",

        },

        {

          name: "Anitha",

          rating: 4,

          comment:

            "Good experience overall.",

        },

      ],

    },

    {

      id: 7,

      name: "Prasad Varma",

      image: "/images/professionals/image1.avif",

      rating: 4.9,

      reviews: 134,

      area: "Madhurawada, Vizag",

      experience: "9+ years",

      responseTime: "Within 15 minutes",

      customerReviews: [

        {

          name: "Harish",

          rating: 5,

          comment:

            "Experienced professional with excellent service.",

        },

        {

          name: "Meena",

          rating: 5,

          comment:

            "Very satisfied with the quality of work.",

        },

      ],

    },

    {

      id: 8,

      name: "Manoj Reddy",

      image: "/images/professionals/image1.avif",

      rating: 4.8,

      reviews: 76,

      area: "Rushikonda, Vizag",

      experience: "4+ years",

      responseTime: "Within 35 minutes",

      customerReviews: [

        {

          name: "Karthik",

          rating: 5,

          comment:

            "Helpful and professional service.",

        },

        {

          name: "Swathi",

          rating: 4,

          comment:

            "Arrived on time and did a good job.",

        },

      ],

    },

    {

      id: 9,

      name: "Naveen Kumar",

      image: "/images/professionals/image1.avif",

      rating: 4.6,

      reviews: 68,

      area: "Madhurawada, Vizag",

      experience: "5+ years",

      responseTime: "Within 40 minutes",

      customerReviews: [

        {

          name: "Rohit",

          rating: 5,

          comment:

            "Good communication and efficient work.",

        },

        {

          name: "Pooja",

          rating: 4,

          comment:

            "Satisfied with the service provided.",

        },

      ],

    },

  ];



  const service = services.find(

    (item) =>

      item.id === serviceId ||

      item.legacyIds?.includes(serviceId ?? "")

  );



  // Service selection

  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

  const [selectedType, setSelectedType] = useState<string | null>(null);



  // Booking popup

  const [showBookingPopup, setShowBookingPopup] = useState(false);

  const [showCustomerForm, setShowCustomerForm] = useState(false);

  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const [customerName, setCustomerName] = useState("");

  const [customerPhone, setCustomerPhone] = useState("");



  // Callback popup

  const [showCallbackPopup, setShowCallbackPopup] = useState(false);

  const [callbackSubmitted, setCallbackSubmitted] = useState(false);

  const [callbackName, setCallbackName] = useState("");

  const [callbackPhone, setCallbackPhone] = useState("");



  // Professional selection and details popup

  const [selectedProfessional, setSelectedProfessional] =

    useState<number | null>(null);
  // Persists after the profile popup is closed.
  const [confirmedProfessional, setConfirmedProfessional] =
    useState<number | null>(null);

  const [professionalRowStart, setProfessionalRowStart] = useState(0);



  // Both selections are required before booking or callback.

  const canBook = selectedIssue !== null && selectedType !== null;



  // This card always shows the highest-rated professional.

  // When ratings tie, the highest review count wins.

  const topProfessional = [...professionals].sort(

    (a, b) => b.rating - a.rating || b.reviews - a.reviews

  )[0];



  const selectedProfessionalDetails =

    professionals.find(

      (professional) => professional.id === selectedProfessional

    ) ?? null;

  const confirmedProfessionalDetails =
    professionals.find(
      (professional) => professional.id === confirmedProfessional
    ) ?? null;



  // Professional carousel: three cards per row.

  const professionalRows = Array.from(

    { length: Math.ceil(professionals.length / 3) },

    (_, index) => professionals.slice(index * 3, index * 3 + 3)

  );



  // Show two rows at a time.

  const visibleProfessionalRows =

    professionalRows.length > 0

      ? Array.from(

        { length: Math.min(2, professionalRows.length) },

        (_, index) =>

          professionalRows[

          (professionalRowStart + index) % professionalRows.length

          ]

      )

      : [];



  const visibleProfessionals = visibleProfessionalRows.flat();



  const showNextProfessionalRow = () => {

    if (professionalRows.length <= 1) return;



    setProfessionalRowStart(

      (current) => (current + 1) % professionalRows.length

    );

  };



  const closeProfessionalPopup = () => {

    setSelectedProfessional(null);

  };

  const confirmProfessionalSelection = () => {
    if (selectedProfessional !== null) {
      setConfirmedProfessional(selectedProfessional);
    }
    closeProfessionalPopup();
  };



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

        <a href="#overview" className="active">Overview</a>

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

              {service.description} Our certified professionals are

              equipped to diagnose issues, explain the required work

              and provide reliable service at your doorstep.

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



          {/* COMMON ISSUES */}

          <section id="issues" className="detail-section">

            <span className="detail-section-label">COMMON ISSUES</span>



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

                    className={`issue-item ${isSelected ? "selected" : ""}`}

                    aria-pressed={isSelected}

                    onClick={() =>

                      setSelectedIssue(isSelected ? null : issue)

                    }

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

                    className={`service-type-card ${isSelected ? "selected" : ""

                      }`}

                    aria-pressed={isSelected}

                    onClick={() =>

                      setSelectedType(isSelected ? null : type)

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

              Select a professional based on their experience, ratings,

              and service area. Select a card to see their full profile.

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

                    className={`professional-selection-card ${isSelected ? "selected" : ""

                      }`}

                    onClick={() => setSelectedProfessional(professional.id)}

                    aria-pressed={isSelected}

                  >

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

                        <Star size={13} fill="currentColor" />

                        <strong>{professional.rating.toFixed(1)}</strong>

                        <span>({professional.reviews} reviews)</span>

                      </div>



                      <p className="professional-selection-area">

                        <MapPin size={13} />

                        <span>{professional.area}</span>

                      </p>



                      <span className="professional-experience">

                        {professional.experience} experience

                      </span>

                    </div>

                  </button>

                );

              })}

            </div>



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

                  Select a common issue and a service type, then click

                  Book Now to continue with your booking.

                </p>

              </details>



              <details>

                <summary>Will the professional visit my home?</summary>

                <p>

                  Yes. NEED ONE SERVICE connects you with a professional

                  who can provide the service at your selected location.

                </p>

              </details>



              <details>

                <summary>Is the final price fixed?</summary>

                <p>

                  The displayed starting price is indicative. Any

                  additional work or parts will be explained before

                  proceeding.

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

                  {Array.from({ length: 5 }, (_, index) => (

                    <Star

                      key={index}

                      size={14}

                      fill="currentColor"

                    />

                  ))}

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

                Choose a common issue and service type to continue.

              </small>

            )}

          </div>



          {/* FIXED TOP PROFESSIONAL */}

          <div className="professional-card top-professional-card">

            <div className="professional-card-heading">

              <Star size={19} fill="currentColor" />

              <strong>Top Professional</strong>

            </div>



            {topProfessional && (

              <>

                <div className="professional-profile">

                  <div className="professional-avatar professional-avatar-photo">

                    <img

                      src={topProfessional.image}

                      alt={topProfessional.name}

                      loading="lazy"

                    />

                  </div>



                  <div className="professional-profile-info">

                    <strong>{topProfessional.name}</strong>



                    <span>{service.shortName} Specialist</span>



                    <div className="professional-rating">

                      <Star size={13} fill="currentColor" />

                      <strong>{topProfessional.rating.toFixed(1)}</strong>

                      <span>

                        ({topProfessional.reviews} reviews)

                      </span>

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

              </>

            )}

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



      {/* SELECTED PROFESSIONAL DETAIL POPUP */}

      {selectedProfessionalDetails && (

        <div

          className="professional-popup-backdrop"

          onClick={closeProfessionalPopup}

        >

          <section

            className="professional-detail-popup"

            role="dialog"

            aria-modal="true"

            aria-labelledby="professional-popup-title"

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



            <div className="professional-popup-profile">

              <img

                src={selectedProfessionalDetails.image}

                alt={selectedProfessionalDetails.name}

              />



              <div>

                <h2 id="professional-popup-title">

                  {selectedProfessionalDetails.name}

                </h2>



                <p>{service.shortName} Specialist</p>



                <div className="professional-popup-rating">

                  <Star size={15} fill="currentColor" />

                  <strong>

                    {selectedProfessionalDetails.rating.toFixed(1)}

                  </strong>

                  <span>

                    ({selectedProfessionalDetails.reviews} reviews)

                  </span>

                </div>

              </div>

            </div>



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

                <strong>{selectedProfessionalDetails.area}</strong>

              </div>



              <div>

                <Zap size={18} />

                <span>Average Response Time</span>

                <strong>

                  {selectedProfessionalDetails.responseTime}

                </strong>

              </div>

            </div>



            <div className="professional-popup-reviews">

              <h3>

                <Star size={17} fill="currentColor" />

                Customer Reviews

              </h3>



              {selectedProfessionalDetails.customerReviews.map(

                (review, index) => (

                  <article

                    className="professional-popup-review"

                    key={`${selectedProfessionalDetails.id}-${index}`}

                  >

                    <div className="professional-popup-review-header">

                      <strong>{review.name}</strong>



                      <span>

                        <Star size={12} fill="currentColor" />

                        {review.rating.toFixed(1)}

                      </span>

                    </div>



                    <p>{review.comment}</p>

                  </article>

                )

              )}



              <div className="professional-popup-review-summary">

                <strong>

                  {selectedProfessionalDetails.rating.toFixed(1)}/5

                </strong>



                <span>

                  Overall rating from{" "}

                  {selectedProfessionalDetails.reviews} reviews

                </span>

              </div>

            </div>



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



      {/* BOOKING POPUP */}

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

                      onClick={() => setShowCustomerForm(true)}

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

                      Enter your details so our team can contact you

                      about your booking.

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

                  Your request was submitted successfully. You will

                  receive a call within 24 hours.

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

                <h2 id="callback-popup-title">Request a Callback</h2>



                <p>

                  Enter your details and our team will call you within

                  24 hours.

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



                <h2 id="callback-popup-title">Callback Requested!</h2>



                <p>

                  Thank you, <strong>{callbackName.trim()}</strong>.

                </p>



                <p>

                  Your callback request has been submitted. You will

                  receive a call within 24 hours.

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
