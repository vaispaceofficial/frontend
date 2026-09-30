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
} from "lucide-react";

import { Link, useParams } from "react-router-dom";
import { services } from "../data/serviceMenu";
import "./ServiceDetailPage.css";

function ServiceDetailPage() {
  const { serviceId } = useParams();

  const service = services.find(
    (item) => item.id === serviceId
  );

  if (!service) {
    return (
      <main className="service-not-found">
        <h1>Service not found</h1>

        <Link to="/services">
          Back to Services
        </Link>
      </main>
    );
  }

  return (
    <main className="service-detail-page">

      {/* HERO */}

      <section className="service-detail-hero">
        <div className="service-detail-hero-image">
          <img
            src={service.image}
            alt={service.name}
          />
        </div>

        <div className="service-detail-hero-overlay"></div>

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

              <span>
                ({service.reviews} reviews)
              </span>
            </div>

            <div className="detail-price">
              Starting from{" "}
              <strong>₹{service.price}</strong>
            </div>

          </div>
        </div>
      </section>


      {/* TABS */}

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
              are equipped to diagnose issues, explain the required
              work and provide reliable service at your doorstep.
            </p>

          </section>


          <section id="issues" className="detail-section">

            <span className="detail-section-label">
              COMMON ISSUES
            </span>

            <h2>What can we help with?</h2>

            <div className="issues-grid">
              {service.commonIssues.map((issue) => (
                <div
                  className="issue-item"
                  key={issue}
                >
                  <CheckCircle2 size={17} />
                  <span>{issue}</span>
                </div>
              ))}
            </div>

          </section>


          <section id="types" className="detail-section">

            <span className="detail-section-label">
              SERVICE TYPES
            </span>

            <h2>Choose the service you need</h2>

            <div className="service-type-grid">
              {service.serviceTypes.map((type) => (
                <div
                  className="service-type-card"
                  key={type}
                >
                  <Wrench size={19} />
                  <span>{type}</span>
                </div>
              ))}
            </div>

          </section>


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
                >
                  <div className="process-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <span>{step}</span>
                </div>
              ))}
            </div>

          </section>


          <section id="benefits" className="detail-section">

            <span className="detail-section-label">
              WHY ONE SERVICE
            </span>

            <h2>Built around your convenience</h2>

            <div className="benefits-grid">
              {service.benefits.map((benefit) => (
                <div
                  className="detail-benefit"
                  key={benefit}
                >
                  <ShieldCheck size={20} />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

          </section>


          <section id="faq" className="detail-section">

            <span className="detail-section-label">
              FAQ
            </span>

            <h2>Frequently asked questions</h2>

            <div className="faq-list">

              <details open>
                <summary>
                  How do I book this service?
                </summary>

                <p>
                  Select your preferred service and click
                  Book Now. You can then choose your preferred
                  date and time.
                </p>
              </details>

              <details>
                <summary>
                  Will the professional visit my home?
                </summary>

                <p>
                  Yes. ONE SERVICE connects you with a
                  professional who can provide the service
                  at your selected location.
                </p>
              </details>

              <details>
                <summary>
                  Is the final price fixed?
                </summary>

                <p>
                  The displayed starting price is indicative.
                  Any additional work or parts will be explained
                  before proceeding.
                </p>
              </details>

            </div>

          </section>


          <section id="reviews" className="detail-section">

            <span className="detail-section-label">
              REVIEWS
            </span>

            <h2>What customers say</h2>

            <div className="review-card">
              <div className="review-avatar">
                RK
              </div>

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
                  Professional service and quick response.
                  The technician explained everything clearly.
                </p>
              </div>
            </div>

          </section>

        </div>


        {/* SIDEBAR */}

        <aside className="service-detail-sidebar">

          <div className="booking-card">

            <span>Starting from</span>

            <strong className="booking-price">
              ₹{service.price}
            </strong>

            <small>
              Visit charge may apply
            </small>

            <button className="book-now-button">
              Book Now
              <ArrowRight size={18} />
            </button>

            <button className="callback-button">
              <Phone size={17} />
              Get a Callback
            </button>

          </div>


          <div className="professional-card">

            <div className="professional-card-heading">
              <ShieldCheck size={19} />
              <strong>Verified Professionals</strong>
            </div>

            <div className="professional-profile">

              <div className="professional-avatar">
                RK
              </div>

              <div>
                <strong>Rajesh Kumar</strong>

                <span>
                  {service.shortName} Technician
                </span>

                <div className="professional-rating">
                  <Star size={13} fill="currentColor" />
                  4.8
                </div>
              </div>

            </div>

            <div className="verified-row">
              <CheckCircle2 size={14} />
              Verified
            </div>

            <div className="experience-row">
              <Clock3 size={14} />
              8+ Years Experience
            </div>

          </div>


          <div className="location-card">

            <div className="location-heading">
              <MapPin size={19} />
              <strong>Service Locations</strong>
            </div>

            <ul>
              {service.locations.map((location) => (
                <li key={location}>
                  {location}
                </li>
              ))}
            </ul>

            <button>
              More Areas
              <ArrowRight size={14} />
            </button>

          </div>

        </aside>

      </section>
    </main>
  );
}

export default ServiceDetailPage;