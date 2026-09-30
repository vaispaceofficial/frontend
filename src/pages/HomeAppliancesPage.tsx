import { ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import "./HomeAppliancesPage.css";

const applianceServices = [
  {
    name: "AC",
    slug: "ac-repair",
    description: "AC repair, servicing, installation and maintenance",
  },
  {
    name: "TV",
    slug: "tv-repair",
    description: "TV installation, repair and troubleshooting",
  },
  {
    name: "Refrigerator",
    slug: "refrigerator-repair",
    description: "Refrigerator repair, servicing and maintenance",
  },
  {
    name: "Washing Machine",
    slug: "washing-machine-repair",
    description: "Washing machine repair and maintenance",
  },
  {
    name: "Microwave",
    slug: "microwave-repair",
    description: "Microwave repair and servicing",
  },
  {
    name: "Water Purifier",
    slug: "water-purifier-service",
    description: "Water purifier servicing and maintenance",
  },
];

function HomeAppliancesPage() {
  return (
    <main className="category-page">
      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <section className="category-page-header">
        <div className="category-page-header-inner">
          <div className="category-page-header-content">
            <Link to="/" className="category-back-link">
              <ChevronRight size={15} />
              Home
            </Link>

            <span className="category-eyebrow">HOME SERVICES</span>

            <h1>
              Home <span>Appliances</span>
            </h1>

            <p>
              Reliable repair, servicing and maintenance for the essential
              appliances in your home.
            </p>
          </div>

          <div className="category-page-header-image">
            <img
              src="/images/services/homeappliances.png"
              alt="Home Appliances"
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

            <h2>Choose an appliance</h2>
          </div>

          <p>Select a service to explore the available solutions.</p>
        </div>

        {/* =================================================
            VERTICAL SERVICE ROWS
        ================================================= */}

        <div className="category-service-list">
          {applianceServices.map((service, index) => (
            <Link
              key={service.slug}
              to={`/services/${service.slug}`}
              className="category-service-row"
            >
              <div className="category-service-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="category-service-info">
                <h3>{service.name}</h3>

                <p>{service.description}</p>
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

          <h2>We're here to take care of it.</h2>
        </div>

        <Link to="/contact" className="category-contact-button">
          Contact Us
          <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
}

export default HomeAppliancesPage;
