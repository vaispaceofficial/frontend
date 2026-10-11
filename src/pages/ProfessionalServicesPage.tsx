
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

import "./ProfessionalServicesPage.css";

const professionalServices = [
  {
    name: "Lawyers and Accountants",
    slug: "legal-tax-financial",
    description: "Legal, tax, accounting, insurance and financial experts.",
    image: "/images/professionalservices/legal-finance.webp",
    services: [
      "Advocates & Lawyers",
      "High Court / District Court Lawyers",
      "Family Law Specialists",
      "Criminal Lawyers",
      "Property/Land Dispute Lawyers",
      "Cyber Law Experts",
      "Income Tax Advocates",
      "Chartered Accountants (CA)",
      "Certified Financial Planners (CFP)",
      "Cost & Management Accountants (CMA)",
      "Company Secretaries (CS)",
      "Independent Accountants",
      "Freelance Bookkeepers",
      "GST Consultants",
      "Tax Return Preparers",
      "Insurance Agents",
      "Banking & Loan Advisors",
      "Stock Market & Mutual Fund Consultants",
      "Wealth Management Advisors",
    ],
  },
  {
    name: "Healthcare & Medical",
    slug: "healthcare-medical",
    description: "Doctors, nurses, therapists and healthcare specialists.",    
    image: "/images/professionalservices/healthcare.jpg",
    services: [
      "Home Visit Doctors",
      "General Physicians",
      "Pediatricians",
      "Geriatric Care Specialists",
      "Private Duty Nurses",
      "Compounders",
      "Speech Therapists",
      "Occupational Therapists",
      "Clinical Psychologists",
      "Mental Health Counselors",
      "Physiotherapists",
    ],
  },
  {
    name: "Religious, Vedic & Astrology",
    slug: "religious-vedic-astrology",
    description:
      "Purohithulu, priests, Vedic astrologers, Vastu consultants and spiritual specialists.",
    image: "/images/professionalservices/astrology.jpg",
    services: [
      "Priests & Pandits",
      "Home Pujas",
      "Homas",
      "Marriage Rituals",
      "Housewarming Ceremonies",
      "Vedic Astrologers",
      "Vastu Consultants",
      "Numerologists",
      "Palmists",
      "Tarot Card Readers",
    ],
  },
  {
    name: "Arts, Hobbies & Trainers",
    slug: "arts-hobbies-trainers",
    description: "Music, dance, art, hobby and sports instructors.",    
    image: "/images/professionalservices/arts.avif",
    services: [
      "Vocal & Classical Music Teachers",
      "Guitar, Keyboard & Drums Teachers",
      "Dance Choreographers",
      "Acting & Theatre Tutors",
      "Drawing & Painting Tutors",
      "Craft & Pottery Instructors",
      "Calligraphy Trainers",
      "Swimming Coaches",
      "Tennis & Badminton Coaches",
      "Chess Coaches",
      "Martial Arts & Karate Trainers",
      "Self-Defense Trainers",
    ],
  },
  {
    name: "Freelancers, Tech & Academic",
    slug: "freelancers-tech-academic",
    description: "Freelancers, developers, designers and academic mentors.",    
    image: "/images/professionalservices/freelancers.png",
    services: [
      "Content Writers",
      "Copywriters",
      "Graphic Designers",
      "Motion Graphic Artists",
      "Video Editors",
      "Digital Marketing Strategists",
      "Web & App Developers",
      "UI/UX Designers",
      "Translators",
      "Academic Project Guidance Mentors",
      "Thesis & Research Advisors",
      "Exam Invigilators",
      "Lab Assistants",
      "Part-time Student Workers",
      "College Interns",
      "Event Volunteers",
      "Project Assistants",
    ],
  },
  {
    name: "Event Artists & Performers",
    slug: "event-artists-performers",
    description: "Anchors, singers, DJs, photographers and performers.",    
    image: "/images/professionalservices/events.avif",
    services: [
      "Anchors & Emcees",
      "Solo Musicians",
      "Singers",
      "Stand-up Comedians",
      "Magicians",
      "Mimicry Artists",
      "DJ Artists",
      "Freelance Photographers",
      "Videographers",
      "Drone Operators",
      "Video Editors",
    ],
  },
  {
    name: "Personal Helpers & Support",
    slug: "personal-helpers-support",
    description: "Personal assistants, drivers, errand helpers and caregivers.",    
    image: "/images/professionalservices/personal-support.jpg",
    services: [
      "Personal Assistants",
      "Concierge & Errand Helpers",
      "Bill Payment Assistants",
      "Queue Assistants",
      "Private & Personal Car Drivers",
      "Senior Care Attendants",
      "Patient Attendants",
      "Baby Nurses",
    ],
  },
  {
    name: "Tailors and Alteration Experts",
    slug: "artisans-local-craftsmen",
    description: "Tailors, locksmiths, cobblers, welders and local artisans.",    
    image: "/images/professionalservices/artisans.jpg",
    services: [
      "Home Tailors",
      "Boutique Designers",
      "Dress Alteration Specialists",
      "Embroidery Workers",
      "Key Makers & Locksmiths",
      "Cobblers & Shoe Repairers",
      "Blacksmiths",
      "On-Demand Welders",
    ],
  },
];

function ProfessionalServicesPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const getIndex = (offset: number) => {
    return (
      (activeSlide + offset + professionalServices.length) %
      professionalServices.length
    );
  };

  const previousService = professionalServices[getIndex(-1)];
  const currentService = professionalServices[getIndex(0)];
  const nextService = professionalServices[getIndex(1)];

  const nextSlide = () => {
    if (isAnimating) return;

    setIsAnimating(true);

    setTimeout(() => {
      setActiveSlide(
        (current) => (current + 1) % professionalServices.length,
      );

      setIsAnimating(false);
    }, 650);
  };

  const previousSlide = () => {
    if (isAnimating) return;

    setIsAnimating(true);

    setTimeout(() => {
      setActiveSlide(
        (current) =>
          (current - 1 + professionalServices.length) %
          professionalServices.length,
      );

      setIsAnimating(false);
    }, 650);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAnimating]);

  return (
    <main className="category-page">
      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="category-hero">
        <div className="category-hero-inner">
          {/* HERO CONTENT */}
          <div className="category-hero-content">
            <Link to="/" className="category-back-link">
              <ChevronRight size={15} />
              Home
            </Link>

            <span className="category-eyebrow">NEED ONE SERVICE</span>

            <h1>
              Professional <span>Services</span>
            </h1>

            <p>
              Connect with individual experts and specialists for legal,
              financial, healthcare, creative, technical and personal support.
            </p>
          </div>

          {/* =================================================
              THREE CARD CAROUSEL
          ================================================== */}
          <div className="appliance-carousel">
            <div
              className={`appliance-carousel-track ${
                isAnimating ? "is-animating" : ""
              }`}
            >
              {/* PREVIOUS CARD */}
              <button
                type="button"
                className="appliance-carousel-card appliance-card-side appliance-card-left"
                onClick={previousSlide}
                aria-label={`Previous: ${previousService.name}`}
              >
                <img
                  src={previousService.image}
                  alt={previousService.name}
                  onError={(event) => {
                    event.currentTarget.src =
                      "/images/services/repairs.png";
                  }}
                />

                <div className="appliance-card-overlay" />

                <span className="appliance-card-label">
                  {previousService.name}
                </span>
              </button>

              {/* MAIN CARD */}
              <Link
                to={`/services/${currentService.slug}`}
                className="appliance-carousel-card appliance-card-main"
              >
                <img
                  src={currentService.image}
                  alt={currentService.name}
                  onError={(event) => {
                    event.currentTarget.src =
                      "/images/services/repairs.png";
                  }}
                />

                <div className="appliance-card-overlay" />

                <div className="appliance-card-badge">
                  <ShieldCheck size={14} />
                  Trusted Professionals
                </div>

                <div className="appliance-card-main-content">
                  <span>PROFESSIONAL SERVICES</span>

                  <h2>{currentService.name}</h2>

                  <p>Connect with an individual expert</p>
                </div>

                <div className="appliance-card-number">
                  {String(activeSlide + 1).padStart(2, "0")}
                </div>
              </Link>

              {/* NEXT CARD */}
              <button
                type="button"
                className="appliance-carousel-card appliance-card-side appliance-card-right"
                onClick={nextSlide}
                aria-label={`Next: ${nextService.name}`}
              >
                <img
                  src={nextService.image}
                  alt={nextService.name}
                  onError={(event) => {
                    event.currentTarget.src =
                      "/images/services/repairs.png";
                  }}
                />

                <div className="appliance-card-overlay" />

                <span className="appliance-card-label">
                  {nextService.name}
                </span>
              </button>
            </div>

            {/* =================================================
                CAROUSEL CONTROLS
            ================================================== */}
            <div className="appliance-carousel-controls">
              <button
                type="button"
                onClick={previousSlide}
                aria-label="Previous professional service"
              >
                <ArrowLeft size={17} />
              </button>

              <div className="appliance-carousel-dots">
                {professionalServices.map((service, index) => (
                  <button
                    key={service.slug}
                    type="button"
                    className={index === activeSlide ? "active" : ""}
                    onClick={() => {
                      if (!isAnimating) {
                        setActiveSlide(index);
                      }
                    }}
                    aria-label={`Show ${service.name}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next professional service"
              >
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SERVICES
      ====================================================== */}
      <section className="category-services-section">
        <div className="category-services-heading">
          <div>
            <span>OUR SERVICES</span>

            <h2>Choose a professional service</h2>
          </div>

          <p>
            Explore specialist categories and find the right professional for
            your needs.
          </p>
        </div>

        <div className="category-service-grid">
          {professionalServices.map((service, index) => (
            <Link
              key={service.slug}
              to={`/services/${service.slug}`}
              className="category-service-card"
            >
              <div className="category-service-image">
                <img
                  src={service.image}
                  alt={service.name}
                  onError={(event) => {
                    event.currentTarget.src = "/images/services/repairs.png";
                  }}
                />
              </div>

              <div className="category-service-content">
                <span className="category-service-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3>{service.name}</h3>

                <p>{service.description}</p>

              </div>

              <span className="category-service-arrow">
                <ArrowRight size={17} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}
      <section className="category-page-footer">
        <div className="category-footer-heading">
          <span>NEED A PROFESSIONAL?</span>

          <h2>
            Find the right expert
            <span> for your needs.</span>
          </h2>
        </div>

        <div className="category-footer-action">
          <p>
            Explore professional services or get in touch with our team.
          </p>

          <Link to="/contact" className="category-contact-button">
            Contact Us
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default ProfessionalServicesPage;
