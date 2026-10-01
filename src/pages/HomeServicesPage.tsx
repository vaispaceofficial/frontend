import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

import "./HomeServicesPage.css";

const homeServices = [
  {
    name: "Electrician",
    slug: "electrician",
    description:
      "Electrical repair, installation and maintenance for your home",
    image: "/images/homeservices/electrician.avif",
  },
  {
    name: "Plumber",
    slug: "plumber",
    description:
      "Reliable plumbing repair, installation and maintenance",
    image: "/images/homeservices/plumber.png",
  },
  {
    name: "Carpenter",
    slug: "carpenter",
    description:
      "Furniture repair, woodwork and custom carpentry services",
    image: "/images/homeservices/carpenter.webp",
  },
  {
    name: "Cleaning",
    slug: "cleaning",
    description:
      "Professional home cleaning for a fresh and comfortable space",
    image: "/images/homeservices/cleaning.png",
  },
];

function HomeServicesPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const getIndex = (offset: number) => {
    return (
      (activeSlide + offset + homeServices.length) %
      homeServices.length
    );
  };

  const previousService = homeServices[getIndex(-1)];
  const currentService = homeServices[getIndex(0)];
  const nextService = homeServices[getIndex(1)];

  const nextSlide = () => {
    if (isAnimating) return;

    setIsAnimating(true);

    setTimeout(() => {
      setActiveSlide(
        (current) =>
          (current + 1) % homeServices.length,
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
          (current - 1 + homeServices.length) %
          homeServices.length,
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
              HOME SERVICES
            </span>

            <h1>
              Home <span>Services</span>
            </h1>

            <p>
              Trusted professionals for repairs, maintenance
              and essential services around your home.
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

                  <span>
                    HOME SERVICES
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
            ================================================= */}

            <div className="appliance-carousel-controls">

              <button
                type="button"
                onClick={previousSlide}
                aria-label="Previous home service"
              >
                <ArrowLeft size={17} />
              </button>

              <div className="appliance-carousel-dots">

                {homeServices.map((service, index) => (
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
                aria-label="Next home service"
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
              Choose a home service
            </h2>

          </div>

          <p>
            Select a service to explore the available
            repair, maintenance and household solutions.
          </p>

        </div>


        {/* =================================================
            SERVICE GRID
        ================================================= */}

        <div className="category-service-grid">

          {homeServices.map((service, index) => (

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
                      "/images/services/repairs.png";
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
            <span> your home.</span>
          </h2>

        </div>


        <div className="category-footer-action">

          <p>
            Book a professional home service or get in
            touch with our team.
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

export default HomeServicesPage;