import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, MessageCircle, ArrowUpRight } from "lucide-react";

import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      {/* =====================================================
          MAIN FOOTER
      ===================================================== */}

      <div className="footer-main">
        <div className="footer-container">
          {/* =================================================
              BRAND COLUMN
          ================================================= */}

          <div className="footer-brand-column">
            <Link to="/" className="footer-logo-link">
              <img
                src="/images/webHoriLogo.png"
                alt="NEED ONE SERVICE LLP"
                className="footer-vertical-logo"
              />
            </Link>

            <p className="footer-brand-description">
              Your trusted platform for reliable home, personal, professional
              and business services — all in one place.
            </p>

            <Link to="/services" className="footer-explore-link">
              Explore our services
              <ArrowUpRight size={16} />
            </Link>

            {/* SOCIAL MEDIA */}

            <div className="footer-socials">
              <a href="#" className="footer-social" aria-label="Facebook">
                f
              </a>

              <a href="#" className="footer-social" aria-label="Instagram">
                ◎
              </a>

              <a href="#" className="footer-social" aria-label="LinkedIn">
                in
              </a>

              <a href="#" className="footer-social" aria-label="YouTube">
                ▶
              </a>
            </div>
          </div>

          {/* =================================================
              COMPANY
          ================================================= */}

          <div className="footer-column">
            <h3>Company</h3>

            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>

              <li>
                <Link to="/contact">About Us</Link>
              </li>

              <li>
                <Link to="/contact">Contact Us</Link>
              </li>

              <li>
                <Link to="/register">Join Our Network</Link>
              </li>
            </ul>
          </div>

          {/* =================================================
              SERVICES
          ================================================= */}

          <div className="footer-column">
            <h3>Our Services</h3>

            <ul>
              <li>
                <Link to="/services/home-appliances">Home Appliances</Link>
              </li>

              <li>
                <Link to="/services/home-services">Home Services</Link>
              </li>

              <li>
                <Link to="/services/personal-services">Personal Services</Link>
              </li>

              <li>
                <Link to="/services/home-staff">Home Staff</Link>
              </li>

              <li>
                <Link to="/amc">AMC Services</Link>
              </li>
            </ul>
          </div>

          {/* =================================================
              PRODUCTS
          ================================================= */}

          <div className="footer-column">
            <h3>Products</h3>

            <ul>
              <li>
                <Link to="/accessories-sales">Accessories & Sales</Link>
              </li>

              <li>
                <Link to="/accessories-products">Accessories</Link>
              </li>

              <li>
                <Link to="/contact">Product Support</Link>
              </li>
            </ul>
          </div>

          {/* =================================================
              SUPPORT / CONTACT
          ================================================= */}

          <div className="footer-column footer-contact-column">
            <h3>Get in Touch</h3>

            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <span className="footer-contact-icon">
                  <MapPin size={17} />
                </span>

                <div>
                  <strong>Location</strong>
                  <span>Visakhapatnam, Andhra Pradesh</span>
                </div>
              </div>

              <a href="tel:+919999999999" className="footer-contact-item">
                <span className="footer-contact-icon">
                  <Phone size={17} />
                </span>

                <div>
                  <strong>Call Us</strong>
                  <span>+91 99999 99999</span>
                </div>
              </a>

              <a
                href="mailto:info@needoneservice.com"
                className="footer-contact-item"
              >
                <span className="footer-contact-icon">
                  <Mail size={17} />
                </span>

                <div>
                  <strong>Email</strong>
                  <span>info@needoneservice.com</span>
                </div>
              </a>

              <a
                href="https://wa.me/919999999999"
                className="footer-contact-item"
                target="_blank"
                rel="noreferrer"
              >
                <span className="footer-contact-icon">
                  <MessageCircle size={17} />
                </span>

                <div>
                  <strong>WhatsApp</strong>
                  <span>Chat with us</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          BLUE CTA STRIP
      ===================================================== */}

      <div className="footer-cta">
        <div className="footer-container footer-cta-inner">
          <div className="footer-cta-content">
            <span className="footer-cta-label">NEED A SERVICE?</span>

            <h2>
              Get the service you need,
              <span> when you need it.</span>
            </h2>
          </div>

          <Link to="/services" className="footer-cta-button">
            Book a Service
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>

      {/* =====================================================
          BOTTOM BAR
      ===================================================== */}

      <div className="footer-bottom">
        <div className="footer-container footer-bottom-inner">
          <div className="footer-copyright">
            © {currentYear} NEED ONE SERVICE LLP. All rights reserved.
          </div>

          <div className="footer-legal">
            <Link to="/privacy-policy">Privacy Policy</Link>

            <span className="footer-legal-divider" />

            <Link to="/terms">Terms & Conditions</Link>

            <span className="footer-legal-divider" />

            <Link to="/refund-policy">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
