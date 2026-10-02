import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ImagePlus,
  MapPin,
  Phone,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import "./AMCPage.css";

const maintenanceServices = [
  "AC",
  "TV",
  "Refrigerator",
  "Washing Machine",
  "Microwave",
  "Water Purifier",
  "Electrician",
  "Plumber",
  "Carpenter",
  "Other",
];

function AMCPage() {
  const [submitted, setSubmitted] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [preferredDate, setPreferredDate] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitted(true);
  };

  const handleCloseDialog = () => {
    setSubmitted(false);

    setFromDate("");
    setToDate("");
    setPreferredDate("");
  };

  return (
    <main className="amc-page">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="amc-hero">
        <div className="amc-hero-background">
          <div className="amc-hero-glow amc-hero-glow-one" />
          <div className="amc-hero-glow amc-hero-glow-two" />
          <div className="amc-hero-grid" />
        </div>

        <div className="amc-container amc-hero-content">
          <div className="amc-hero-copy">
            <div className="amc-eyebrow">
              <span />
              NEED ONE SERVICE MAINTENANCE
            </div>

            <h1>
              Keep your home
              <br />
              <span>running smoothly.</span>
            </h1>

            <p>
              From routine maintenance to unexpected repairs, OneService makes
              it simple to get the right professional for your home.
            </p>

            <div className="amc-hero-actions">
              <a href="#maintenance-request" className="amc-primary-button">
                Request Maintenance
                <ArrowRight size={17} />
              </a>

              <a href="#how-it-works" className="amc-secondary-button">
                How it works
              </a>
            </div>
          </div>

          <div className="amc-hero-card">
            <div className="amc-hero-card-top">
              <div className="amc-hero-icon">
                <Wrench size={21} />
              </div>

              <span>MAINTENANCE SUPPORT</span>
            </div>

            <div className="amc-hero-card-line" />

            <div className="amc-hero-stat">
              <strong>One request.</strong>
              <span>We handle the rest.</span>
            </div>

            <div className="amc-hero-card-list">
              <div>
                <CheckCircle2 size={16} />
                <span>Professional assistance</span>
              </div>

              <div>
                <CheckCircle2 size={16} />
                <span>Scheduled at your convenience</span>
              </div>

              <div>
                <CheckCircle2 size={16} />
                <span>Service request tracking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRO / BENEFITS
      ===================================================== */}

      <section className="amc-benefits-section">
        <div className="amc-container">
          <div className="amc-section-heading">
            <span>MAINTENANCE MADE SIMPLE</span>

            <h2>
              Your home deserves
              <br />
              <strong>reliable care.</strong>
            </h2>

            <p>
              Tell us what needs attention and OneService will help you arrange
              the maintenance support you need.
            </p>
          </div>

          <div className="amc-benefits-grid">
            <article className="amc-benefit-card">
              <div className="amc-benefit-icon">
                <ShieldCheck size={20} />
              </div>

              <h3>Trusted Support</h3>

              <p>Get assistance through the OneService maintenance system.</p>
            </article>

            <article className="amc-benefit-card">
              <div className="amc-benefit-icon">
                <CalendarDays size={20} />
              </div>

              <h3>Convenient Scheduling</h3>

              <p>
                Choose a preferred date and time for your maintenance visit.
              </p>
            </article>

            <article className="amc-benefit-card">
              <div className="amc-benefit-icon">
                <Clock3 size={20} />
              </div>

              <h3>Easy Tracking</h3>

              <p>
                Keep track of your maintenance request from submission to
                completion.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* =====================================================
          REQUEST FORM
      ===================================================== */}

      <section className="amc-request-section" id="maintenance-request">
        <div className="amc-container amc-request-layout">
          <div className="amc-request-intro">
            <div className="amc-eyebrow dark">
              <span />
              RAISE A REQUEST
            </div>

            <h2>
              What can we
              <br />
              <strong>help you with?</strong>
            </h2>

            <p>
              Fill in the details below. Our team can use this information to
              understand your requirement and arrange the appropriate
              maintenance support.
            </p>

            <div className="amc-request-info">
              <div className="amc-info-item">
                <div>
                  <Phone size={17} />
                </div>

                <span>
                  Need help?
                  <strong>Our support team is here.</strong>
                </span>
              </div>

              <div className="amc-info-item">
                <div>
                  <MapPin size={17} />
                </div>

                <span>
                  Service at your home
                  <strong>Convenient and scheduled.</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="amc-form-card">
            <form onSubmit={handleSubmit}>
              <div className="amc-form-header">
                <span>MAINTENANCE REQUEST</span>
                <h3>Tell us what you need.</h3>
              </div>

              <div className="amc-form-grid">
                {/* SERVICE */}

                <div className="amc-field full">
                  <label htmlFor="service">Service / Product</label>

                  <select id="service" required defaultValue="">
                    <option value="" disabled>
                      Select a service or product
                    </option>

                    {maintenanceServices.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                {/* NAME */}

                <div className="amc-field">
                  <label htmlFor="name">Full Name</label>

                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    autoComplete="name"
                    required
                  />
                </div>

                {/* PHONE */}

                <div className="amc-field">
                  <label htmlFor="phone">Mobile Number</label>

                  <input
                    id="phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    autoComplete="tel"
                    required
                  />
                </div>

                {/* SERVICE PERIOD — FROM */}

                <div className="amc-field">
                  <label htmlFor="fromDate">Service Period — From</label>

                  <div className="amc-input-icon">
                    <CalendarDays size={16} />

                    <input
                      id="fromDate"
                      type="date"
                      value={fromDate}
                      onChange={(event) => {
                        const value = event.target.value;

                        setFromDate(value);

                        if (toDate && value > toDate) {
                          setToDate("");
                        }

                        if (preferredDate && value > preferredDate) {
                          setPreferredDate("");
                        }
                      }}
                      required
                    />
                  </div>
                </div>

                {/* SERVICE PERIOD — TO */}

                <div className="amc-field">
                  <label htmlFor="toDate">Service Period — To</label>

                  <div className="amc-input-icon">
                    <CalendarDays size={16} />

                    <input
                      id="toDate"
                      type="date"
                      min={fromDate || undefined}
                      value={toDate}
                      onChange={(event) => setToDate(event.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* PREFERRED DATE */}

                <div className="amc-field">
                  <label htmlFor="date">Preferred Date</label>

                  <div className="amc-input-icon">
                    <CalendarDays size={16} />

                    <input
                      id="date"
                      type="date"
                      min={fromDate || undefined}
                      max={toDate || undefined}
                      value={preferredDate}
                      onChange={(event) =>
                        setPreferredDate(event.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                {/* TIME */}

                <div className="amc-field">
                  <label htmlFor="time">Preferred Time</label>

                  <div className="amc-input-icon">
                    <Clock3 size={16} />

                    <select id="time" required defaultValue="">
                      <option value="" disabled>
                        Select time
                      </option>

                      <option value="morning">
                        Morning — 9 AM to 12 PM
                      </option>

                      <option value="afternoon">
                        Afternoon — 12 PM to 4 PM
                      </option>

                      <option value="evening">
                        Evening — 4 PM to 7 PM
                      </option>
                    </select>
                  </div>
                </div>

                {/* ADDRESS */}

                <div className="amc-field full">
                  <label htmlFor="address">Service Address</label>

                  <textarea
                    id="address"
                    rows={3}
                    placeholder="Enter the address where service is required"
                    autoComplete="street-address"
                    required
                  />
                </div>

                {/* ISSUE */}

                <div className="amc-field full">
                  <label htmlFor="issue">Describe the issue</label>

                  <textarea
                    id="issue"
                    rows={4}
                    placeholder="Tell us what needs maintenance or repair..."
                    required
                  />
                </div>

                {/* UPLOAD */}

                <div className="amc-field full">
                  <label htmlFor="supporting-image">
                    Photos / Supporting Image
                    <span className="optional">Optional</span>
                  </label>

                  <label className="amc-upload">
                    <ImagePlus size={19} />

                    <span>
                      <strong>Upload a photo</strong>
                      <small>Help us understand the issue better</small>
                    </span>

                    <input
                      id="supporting-image"
                      type="file"
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>

              <button type="submit" className="amc-submit-button">
                Submit Maintenance Request
                <ArrowRight size={17} />
              </button>

              <p className="amc-form-note">
                By submitting this request, you agree to be contacted by
                OneService regarding your maintenance requirement.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section className="amc-how-section" id="how-it-works">
        <div className="amc-container">
          <div className="amc-section-heading centered">
            <span>HOW IT WORKS</span>

            <h2>
              Maintenance without
              <br />
              <strong>the hassle.</strong>
            </h2>
          </div>

          <div className="amc-steps">
            <div className="amc-step">
              <div className="amc-step-number">01</div>

              <h3>Tell us the issue</h3>

              <p>
                Submit your maintenance requirement and provide the important
                details.
              </p>
            </div>

            <div className="amc-step-line" />

            <div className="amc-step">
              <div className="amc-step-number">02</div>

              <h3>We arrange support</h3>

              <p>
                Your request can be reviewed and the appropriate service
                support can be arranged.
              </p>
            </div>

            <div className="amc-step-line" />

            <div className="amc-step">
              <div className="amc-step-number">03</div>

              <h3>Get it taken care of</h3>

              <p>
                Receive the maintenance service at your selected location and
                scheduled time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          REQUEST SUBMITTED DIALOG
      ===================================================== */}

      {submitted && (
        <div
          className="amc-dialog-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="amc-dialog-title"
        >
          <div className="amc-dialog">
            <div className="amc-dialog-icon">
              <CheckCircle2 size={32} />
            </div>

            <span className="amc-dialog-label">REQUEST SUBMITTED</span>

            <h3 id="amc-dialog-title">
              Your maintenance request
              <br />
              has been submitted.
            </h3>

            <p>
              Thank you for contacting OneService. Your request has been
              received successfully. Our technician will review it and notify
              you within <strong>24 hours</strong>.
            </p>

            <button
              type="button"
              className="amc-dialog-button"
              onClick={handleCloseDialog}
            >
              Okay, Got It
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default AMCPage;