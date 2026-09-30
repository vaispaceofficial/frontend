import { ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import "./PersonalServicesPage.css";

const personalServices = [
  {
    name: "Makeup",
    slug: "makeup",
    description: "Professional makeup services for events, occasions and special moments",
  },
  {
    name: "Hair Styling",
    slug: "hair-styling",
    description: "Hair styling, grooming and personalized looks for every occasion",
  },
  {
    name: "Beautician",
    slug: "beautician",
    description: "Personal beauty and grooming services delivered at your convenience",
  },
];

function PersonalServicesPage() {
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

          <div className="category-page-header-image">
            <img
              src="/images/services/beauty.png"
              alt="Personal Services"
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
              Choose a personal service
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

          {personalServices.map((service, index) => (
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

export default PersonalServicesPage;