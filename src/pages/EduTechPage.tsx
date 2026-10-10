import { useEffect, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

import { Link } from "react-router-dom";

import "./HomeAppliancesPage.css";

const eduTechServices = [
  {
    name: "School Tuition",
    slug: "school-tuition",
    description:
      "Personalized tutoring to help school students strengthen concepts and improve academic performance.",
    image: "/images/edutech/school-tuition.webp",
  },
  {
    name: "Home Tuition",
    slug: "home-tuition",
    description:
      "One-to-one tutoring at home with personalized guidance to support students' learning and academic progress.",
    image: "/images/edutech/home-tuition.png",
  },
  {
    name: "Competitive Exam Coaching",
    slug: "competitive-exam-coaching",
    description:
      "Focused preparation, expert guidance and practice for competitive examinations.",
    image: "/images/edutech/competitive-exam.png",
  },
  {
    name: "Higher Education Tutors",
    slug: "higher-education-tutors",
    description:
      "Subject-specific tutoring and academic support for college and university students.",
    image: "/images/edutech/higher-education.jpg",
  },
  {
    name: "Language & Skill Classes",
    slug: "language-skill-classes",
    description:
      "Build communication, language and practical skills with personalized learning.",
    image: "/images/edutech/language-classes.jpg",
  },
];

function EduTechPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const getIndex = (offset: number) =>
    (activeSlide + offset + eduTechServices.length) %
    eduTechServices.length;

  const previousService = eduTechServices[getIndex(-1)];
  const currentService = eduTechServices[getIndex(0)];
  const nextService = eduTechServices[getIndex(1)];

  const nextSlide = () => {
    if (isAnimating) return;

    setIsAnimating(true);

    setTimeout(() => {
      setActiveSlide(
        (current) => (current + 1) % eduTechServices.length,
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
          (current - 1 + eduTechServices.length) %
          eduTechServices.length,
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
      {/* HERO */}
      <section className="category-hero">
        <div className="category-hero-inner">
          <div className="category-hero-content">
            <Link to="/" className="category-back-link">
              <ChevronRight size={15} />
              Home
            </Link>

            <span className="category-eyebrow">
              NEED ONE SERVICE
            </span>

            <h1>
              EduTech <span>& Home Tutors</span>
            </h1>

            <p>
              Discover experienced tutors, personalized learning
              and skill development services to help learners
              achieve their goals.
            </p>
          </div>

          {/* THREE-CARD IMAGE CAROUSEL */}
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
                />

                <div className="appliance-card-overlay" />

                <div className="appliance-card-badge">
                  <ShieldCheck size={14} />
                  Learning Support
                </div>

                <div className="appliance-card-main-content">
                  <span>EDUTECH & HOME TUTORS</span>

                  <h2>{currentService.name}</h2>

                  <p>
                    Personalized learning at your convenience
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
                />

                <div className="appliance-card-overlay" />

                <span className="appliance-card-label">
                  {nextService.name}
                </span>
              </button>
            </div>

            {/* CAROUSEL CONTROLS */}
            <div className="appliance-carousel-controls">
              <button
                type="button"
                onClick={previousSlide}
                aria-label="Previous learning service"
              >
                <ArrowLeft size={17} />
              </button>

              <div className="appliance-carousel-dots">
                {eduTechServices.map((service, index) => (
                  <button
                    key={service.slug}
                    type="button"
                    className={
                      index === activeSlide ? "active" : ""
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
                aria-label="Next learning service"
              >
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* LEARNING SERVICES */}
      <section className="category-services-section">
        <div className="category-services-heading">
          <div>
            <span>OUR SERVICES</span>
            <h2>Explore learning services</h2>
          </div>

          <p>
            Choose a learning service to discover tutoring,
            coaching and skill development options.
          </p>
        </div>

        <div className="category-service-grid">
          {eduTechServices.map((service, index) => (
            <Link
              key={service.slug}
              to={`/services/${service.slug}`}
              className="category-service-card"
            >
              <div className="category-service-image">
                <img
                  src={service.image}
                  alt={service.name}
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

      {/* CALL TO ACTION */}
      <section className="category-page-footer">
        <div className="category-footer-heading">
          <span>READY TO GET STARTED?</span>

          <h2>
            Your learning journey,
            <span> starts here.</span>
          </h2>
        </div>

        <div className="category-footer-action">
          <p>
            Need help choosing a learning service? Get in touch
            with our team.
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

export default EduTechPage;