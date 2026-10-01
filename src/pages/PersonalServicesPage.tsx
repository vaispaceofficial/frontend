import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

import "./PersonalServicesPage.css";

const personalServices = [
  {
    name: "Makeup",
    slug: "makeup",
    description:
      "Professional makeup services for events, occasions and special moments",
    image: "/images/personalservices/makeup.webp",
  },
  {
    name: "Hair Styling",
    slug: "hair-styling",
    description:
      "Hair styling, grooming and personalized looks for every occasion",
    image: "/images/personalservices/stylist.webp",
  },
  {
    name: "Beautician",
    slug: "beautician",
    description:
      "Personal beauty and grooming services delivered at your convenience",
    image: "/images/personalservices/beautician.webp",
  },
];

function PersonalServicesPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const getIndex = (offset: number) => {
    return (
      (activeSlide + offset + personalServices.length) %
      personalServices.length
    );
  };

  const previousService = personalServices[getIndex(-1)];
  const currentService = personalServices[getIndex(0)];
  const nextService = personalServices[getIndex(1)];

  const nextSlide = () => {
    if (isAnimating) return;

    setIsAnimating(true);

    setTimeout(() => {
      setActiveSlide(
        (current) =>
          (current + 1) % personalServices.length,
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
          (current - 1 + personalServices.length) %
          personalServices.length,
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

      {/* =================================================
          HERO
      ================================================= */}

      <section className="category-hero">

        <div className="category-hero-inner">

          {/* HERO CONTENT */}

          <div className="category-hero-content">

            <Link
              to="/"
              className="category-back-link"
            >
              <ChevronRight size={15} />
              Home
            </Link>

            <span className="category-eyebrow">
              PERSONAL SERVICES
            </span>

            <h1>
              Personal <span>Services</span>
            </h1>

            <p>
              Professional beauty and personal care services
              designed to help you look and feel your best.
            </p>

          </div>


          {/* =================================================
              THREE CARD CAROUSEL
          ================================================= */}

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
                      "/images/services/beauty.png";
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
                      "/images/services/beauty.png";
                  }}
                />

                <div className="appliance-card-overlay" />

                <div className="appliance-card-badge">
                  <ShieldCheck size={14} />
                  Trusted Professionals
                </div>

                <div className="appliance-card-main-content">

                  <span>
                    PERSONAL SERVICES
                  </span>

                  <h2>
                    {currentService.name}
                  </h2>

                  <p>
                    Professional service at your doorstep
                  </p>

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
                      "/images/services/beauty.png";
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
            ================================================= */}

            <div className="appliance-carousel-controls">

              <button
                type="button"
                onClick={previousSlide}
                aria-label="Previous personal service"
              >
                <ArrowLeft size={17} />
              </button>

              <div className="appliance-carousel-dots">

                {personalServices.map((service, index) => (
                  <button
                    key={service.slug}
                    type="button"
                    className={
                      index === activeSlide
                        ? "active"
                        : ""
                    }
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
                aria-label="Next personal service"
              >
                <ArrowRight size={17} />
              </button>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          SERVICES
      ================================================= */}

      <section className="category-services-section">

        <div className="category-services-heading">

          <div>

            <span>
              OUR SERVICES
            </span>

            <h2>
              Choose a personal service
            </h2>

          </div>

          <p>
            Select a service to explore the available
            beauty and personal care solutions.
          </p>

        </div>


        {/* =================================================
            SERVICE GRID
        ================================================= */}

        <div className="category-service-grid">

          {personalServices.map((service, index) => (

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
                    event.currentTarget.src =
                      "/images/services/beauty.png";
                  }}
                />

              </div>


              <div className="category-service-content">

                <span className="category-service-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3>
                  {service.name}
                </h3>

                <p>
                  {service.description}
                </p>

              </div>


              <span className="category-service-arrow">
                <ArrowRight size={17} />
              </span>

            </Link>

          ))}

        </div>

      </section>


      {/* =================================================
          CTA
      ================================================= */}

      <section className="category-page-footer">

        <div className="category-footer-heading">

          <span>
            NEED A SERVICE?
          </span>

          <h2>
            We'll take care of
            <span> you.</span>
          </h2>

        </div>


        <div className="category-footer-action">

          <p>
            Book a professional personal care service
            or get in touch with our team.
          </p>

          <Link
            to="/contact"
            className="category-contact-button"
          >
            Contact Us
            <ArrowRight size={17} />
          </Link>

        </div>

      </section>

    </main>
  );
}

export default PersonalServicesPage;