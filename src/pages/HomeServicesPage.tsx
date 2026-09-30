import { ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import "./HomeServicesPage.css";

const homeServices = [
  {
    name: "Electrician",
    slug: "electrician",
    description: "Electrical repair, installation and maintenance for your home",
  },
  {
    name: "Plumber",
    slug: "plumber",
    description: "Reliable plumbing repair, installation and maintenance",
  },
  {
    name: "Carpenter",
    slug: "carpenter",
    description: "Furniture repair, woodwork and custom carpentry services",
  },
  {
    name: "Cleaning",
    slug: "cleaning",
    description: "Professional home cleaning for a fresh and comfortable space",
  },
];

function HomeServicesPage() {
  return (
    <main className="category-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <section className="category-page-header">
        <div className="category-page-header-inner">

          <div className="category-page-header-content">

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

          <div className="category-page-header-image">
            <img
              src="/images/services/repairs.png"
              alt="Home Services"
            />
          </div>

        </div>
      </section>

      {/* =================================================
          SERVICES
      ================================================= */}

      <section className="category-services-section">

        <div className="category-services-heading">
          <div>
            <span>OUR SERVICES</span>

            <h2>
              Choose a home service
            </h2>
          </div>

          <p>
            Select a service to explore the available
            solutions.
          </p>
        </div>

        {/* =================================================
            VERTICAL SERVICE ROWS
        ================================================= */}

        <div className="category-service-list">

          {homeServices.map((service, index) => (
            <Link
              key={service.slug}
              to={`/services/${service.slug}`}
              className="category-service-row"
            >

              <div className="category-service-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="category-service-info">

                <h3>
                  {service.name}
                </h3>

                <p>
                  {service.description}
                </p>

              </div>

              <div className="category-service-arrow">
                <ArrowRight size={19} />
              </div>

            </Link>
          ))}

        </div>

      </section>

      {/* =================================================
          BOTTOM CTA
      ================================================= */}

      <section className="category-page-footer">

        <div>
          <span>NEED HELP?</span>

          <h2>
            We're here to take care of it.
          </h2>
        </div>

        <Link
          to="/contact"
          className="category-contact-button"
        >
          Contact Us
          <ArrowRight size={16} />
        </Link>

      </section>

    </main>
  );
}

export default HomeServicesPage;