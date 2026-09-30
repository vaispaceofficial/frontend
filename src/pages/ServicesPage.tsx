import { ArrowRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { services } from "../data/serviceMenu";
import "./ServicesPage.css";

const categories = [
  "All",
  "Home Appliances",
  "Home Services",
  "Personal Services",
  "Home Staff",
];

function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesCategory =
        activeCategory === "All" ||
        service.category === activeCategory;

      const searchText = search.toLowerCase();

      const matchesSearch =
        service.name.toLowerCase().includes(searchText) ||
        service.category.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <main className="services-page">
      <section className="services-page-hero">
        <div>
          <span className="services-page-eyebrow">
            ONE SERVICE
          </span>

          <h1>
            Services for every
            <br />
            <span>home need.</span>
          </h1>

          <p>
            From repairs and maintenance to personal care and home
            assistance, find the right professional for your needs.
          </p>
        </div>
      </section>

      <section className="services-browser">
        <div className="services-browser-top">
          <div>
            <span className="services-small-label">
              EXPLORE SERVICES
            </span>

            <h2>Find the service you need</h2>
          </div>

          <div className="services-search">
            <Search size={19} />

            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category}
              className={
                activeCategory === category ? "active" : ""
              }
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="services-grid">
          {filteredServices.map((service) => (
            <a
              key={service.id}
              href={`/services/${service.id}`}
              className="service-list-card"
            >
              <div className="service-list-image">
                <img
                  src={service.image}
                  alt={service.name}
                />
              </div>

              <div className="service-list-content">
                <span>{service.category}</span>

                <h3>{service.name}</h3>

                <p>{service.description}</p>

                <div className="service-list-footer">
                  <strong>
                    Starting ₹{service.price}
                  </strong>

                  <span>
                    Explore
                    <ArrowRight size={15} />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

export default ServicesPage;