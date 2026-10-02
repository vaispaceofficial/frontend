import { MapPin, Phone, MessageCircle, Clock3, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import "./ContactPage.css";

function ContactPage() {
  return (
    <main className="contact-page">
      {/* =========================
          PAGE HEADER
      ========================= */}

      <section className="contact-header">
        <span className="contact-eyebrow">GET IN TOUCH</span>

        <h1>
          We're here to help.
          <span> Contact NEED ONE SERVICE.</span>
        </h1>

        <p>
          Have a question about a service, booking, or anything else? Reach out
          to our team.
        </p>
      </section>

      {/* =========================
          MAIN CONTACT AREA
      ========================= */}

      <section className="contact-layout">
        {/* =========================
            HEADQUARTERS
        ========================= */}

        <div className="contact-location-card">
          <div className="contact-card-heading">
            <div className="contact-icon">
              <MapPin size={19} />
            </div>

            <div>
              <span>OUR LOCATION</span>
              <h2>Headquarters</h2>
            </div>
          </div>

          <div className="contact-address">
            <strong>NEED ONE SERVICE</strong>

            <p>
              Headquarters Address
              <br />
              City, Andhra Pradesh
              <br />
              India
            </p>
          </div>

          {/* MAP */}

          <div className="contact-map">
            <div className="map-placeholder">
              <MapPin size={26} />

              <strong>NEED ONE SERVICE Headquarters</strong>

              <span>Location map</span>
            </div>
          </div>
        </div>

        {/* =========================
            RIGHT SIDE ACTIONS
        ========================= */}

        <div className="contact-actions">
          {/* CALL */}

          <div className="contact-action-card">
            <div className="contact-action-icon">
              <Phone size={19} />
            </div>

            <div className="contact-action-content">
              <span>CALL US</span>

              <h3>Speak with our team</h3>

              <p>Assistance with bookings and enquiries.</p>
            </div>

            <a href="tel:+910000000000" className="contact-action-button">
              Call
              <ArrowRight size={15} />
            </a>
          </div>

          {/* WHATSAPP */}

          <div className="contact-action-card">
            <div className="contact-action-icon whatsapp-icon">
              <MessageCircle size={19} />
            </div>

            <div className="contact-action-content">
              <span>WHATSAPP</span>

              <h3>Chat with us</h3>

              <p>Message our team directly on WhatsApp.</p>
            </div>

            <a
              href="https://wa.me/910000000000"
              target="_blank"
              rel="noreferrer"
              className="contact-action-button"
            >
              Chat
              <ArrowRight size={15} />
            </a>
          </div>

          {/* WORKING HOURS */}

          <div className="contact-action-card">
            <div className="contact-action-icon">
              <Clock3 size={19} />
            </div>

            <div className="contact-action-content">
              <span>WORKING HOURS</span>

              <h3>We're available to help</h3>

              <p>Monday – Saturday · 9:00 AM – 7:00 PM</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          BOTTOM CTA
      ========================= */}

      <section className="contact-bottom">
        <div>
          <span>NEED A SERVICE?</span>

          <h2>Let NEED ONE SERVICE take care of it.</h2>
        </div>

        <Link to="/#services" className="contact-services-button">
          Explore Services
          <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
}

export default ContactPage;
