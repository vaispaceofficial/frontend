import { ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import "./HomeStaffPage.css";

const homeStaffServices = [
  {
    name: "Maid",
    slug: "maid",
    description: "Reliable household assistance for everyday home needs",
  },
  {
    name: "Cooking",
    slug: "cooking",
    description: "Convenient home cooking assistance tailored to your needs",
  },
  {
    name: "Cleaning",
    slug: "home-cleaning",
    description: "Dedicated household cleaning and regular home maintenance",
  },
  {
    name: "Babysitting",
    slug: "babysitting",
    description: "Trusted childcare assistance for your family's daily needs",
  },
  {
    name: "Elder Assistance",
    slug: "elder-assistance",
    description: "Compassionate assistance and everyday support for elderly family members",
  },
];

function HomeStaffPage() {
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
              HOME STAFF
            </span>

            <h1>
              Home <span>Staff</span>
            </h1>

            <p>
              Reliable household support to make everyday
              home life easier, more comfortable and convenient.
            </p>

          </div>

          <div className="category-page-header-image">
            <img
              src="/images/services/personal.png"
              alt="Home Staff"
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
              Choose a home staff service
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

          {homeStaffServices.map((service, index) => (
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

export default HomeStaffPage;