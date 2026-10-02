import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

import "./HomeStaffPage.css";

const homeStaffServices = [
  {
    name: "Maid",
    slug: "maid",
    description: "Reliable household assistance for everyday home needs",
    image: "/images/homestaff/maid.webp",
  },
  {
    name: "Cooking",
    slug: "cooking",
    description: "Convenient home cooking assistance tailored to your needs",
    image: "/images/homestaff/cooking.jpg",
  },
  {
    name: "Cleaning",
    slug: "home-cleaning",
    description: "Dedicated household cleaning and regular home maintenance",
    image: "/images/homestaff/cleaning.webp",
  },
  {
    name: "Babysitting",
    slug: "babysitting",
    description:
      "Trusted childcare assistance for your family's daily needs",
    image: "/images/homestaff/babysitting.jpg",
  },
  {
    name: "Elder Assistance",
    slug: "elder-assistance",
    description:
      "Compassionate assistance and everyday support for elderly family members",
    image: "/images/homestaff/elderassistance.jpg",
  },
];

function HomeStaffPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const getIndex = (offset: number) => {
    return (
      (activeSlide + offset + homeStaffServices.length) %
      homeStaffServices.length
    );
  };

  const previousService = homeStaffServices[getIndex(-1)];
  const currentService = homeStaffServices[getIndex(0)];
  const nextService = homeStaffServices[getIndex(1)];

  const nextSlide = () => {
    if (isAnimating) return;

    setIsAnimating(true);

    setTimeout(() => {
      setActiveSlide(
        (current) =>
          (current + 1) % homeStaffServices.length,
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
          (current - 1 + homeStaffServices.length) %
          homeStaffServices.length,
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
              NEED ONE SERVICE
            </span>

            <h1>
              Home <span>Staff</span>
            </h1>

            <p>
              Reliable household support to make everyday
              home life easier, more comfortable and convenient.
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

              {/* PREVIOUS */}

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
                      "/images/services/personal.png";
                  }}
                />

                <div className="appliance-card-overlay" />

                <span className="appliance-card-label">
                  {previousService.name}
                </span>
              </button>


              {/* MAIN */}

              <Link
                to={`/services/${currentService.slug}`}
                className="appliance-carousel-card appliance-card-main"
              >
                <img
                  src={currentService.image}
                  alt={currentService.name}
                  onError={(event) => {
                    event.currentTarget.src =
                      "/images/services/personal.png";
                  }}
                />

                <div className="appliance-card-overlay" />

                <div className="appliance-card-badge">
                  <ShieldCheck size={14} />
                  Trusted Professionals
                </div>

                <div className="appliance-card-main-content">

                  <span>
                    HOME STAFF
                  </span>

                  <h2>
                    {currentService.name}
                  </h2>

                  <p>
                    Professional assistance at your doorstep
                  </p>

                </div>

                <div className="appliance-card-number">
                  {String(activeSlide + 1).padStart(2, "0")}
                </div>

              </Link>


              {/* NEXT */}

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
                      "/images/services/personal.png";
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
                aria-label="Previous home staff service"
              >
                <ArrowLeft size={17} />
              </button>

              <div className="appliance-carousel-dots">

                {homeStaffServices.map((service, index) => (
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
                aria-label="Next home staff service"
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
              Choose a home staff service
            </h2>

          </div>

          <p>
            Select a service to explore the available
            household support solutions.
          </p>

        </div>


        {/* =================================================
            SERVICE GRID
        ================================================= */}

        <div className="category-service-grid">

          {homeStaffServices.map((service, index) => (

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
                      "/images/services/personal.png";
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
            Book a professional home staff service or
            get in touch with our team.
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

export default HomeStaffPage;