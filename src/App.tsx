import { useEffect, useRef, useState } from "react";
import {
  Search,
  UserRound,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import "./App.css";

import ServicesPage from "./pages/ServicesPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import HomeAppliancesPage from "./pages/HomeAppliancesPage";
import HomeServicesPage from "./pages/HomeServicesPage";
import PersonalServicesPage from "./pages/PersonalServicesPage";
import HomeStaffPage from "./pages/HomeStaffPage";
import AMCPage from "./pages/AMCPage";
import AccessoriesSalesPage from "./pages/AccessoriesSalesPage";
import RegisterPage from "./pages/RegisterPage";
import ProfessionalRegisterPage from "./pages/ProfessionalRegisterPage";
import AccessoriesProductsPage from "./pages/AccessoriesProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";

/* =========================================================
   HERO IMAGES
========================================================= */

const heroImages = [
  "/images/hero/AC.webp",
  "/images/hero/Electrician.webp",
  "/images/hero/Microwave.webp",
  "/images/hero/Plumbing.webp",
  "/images/hero/Refrigerator.webp",
  "/images/hero/WashingMachine.webp",
  "/images/hero/Waterpurifier.webp",
];

/* =========================================================
   SERVICE MENU
========================================================= */

const serviceCategories = [
  {
    name: "Home Appliances",
    services: [
      {
        name: "AC",
        slug: "ac-repair",
      },
      {
        name: "TV",
        slug: "tv-repair",
      },
      {
        name: "Refrigerator",
        slug: "refrigerator-repair",
      },
      {
        name: "Washing Machine",
        slug: "washing-machine-repair",
      },
      {
        name: "Microwave",
        slug: "microwave-repair",
      },
      {
        name: "Water Purifier",
        slug: "water-purifier-service",
      },
    ],
  },

  {
    name: "Home Services",
    services: [
      {
        name: "Electrician",
        slug: "electrician",
      },
      {
        name: "Plumber",
        slug: "plumber",
      },
      {
        name: "Carpenter",
        slug: "carpenter",
      },
      {
        name: "Cleaning",
        slug: "cleaning",
      },
    ],
  },

  {
    name: "Personal Services",
    services: [
      {
        name: "Makeup",
        slug: "makeup",
      },
      {
        name: "Hair Styling",
        slug: "hair-styling",
      },
      {
        name: "Beautician",
        slug: "beautician",
      },
    ],
  },

  {
    name: "Home Staff",
    services: [
      {
        name: "Maid",
        slug: "maid",
      },
      {
        name: "Cooking",
        slug: "cooking",
      },
      {
        name: "Cleaning",
        slug: "home-cleaning",
      },
      {
        name: "Babysitting",
        slug: "babysitting",
      },
      {
        name: "Elder Assistance",
        slug: "elder-assistance",
      },
    ],
  },
];

/* =========================================================
   NAVBAR
========================================================= */

function Navbar() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const servicesRef = useRef<HTMLDivElement>(null);

  /* =================================================
     CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  ================================================= */

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        servicesRef.current &&
        !servicesRef.current.contains(event.target as Node)
      ) {
        setServicesOpen(false);
        setSelectedCategory(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const selectedCategoryData =
    selectedCategory !== null ? serviceCategories[selectedCategory] : null;

  /* =================================================
     TOGGLE SERVICES DROPDOWN
  ================================================= */

  const toggleServices = () => {
    setServicesOpen((current) => !current);

    if (servicesOpen) {
      setSelectedCategory(null);
    }
  };

  /* =================================================
     SELECT CATEGORY
  ================================================= */

  const selectCategory = (index: number) => {
    setSelectedCategory((current) => (current === index ? null : index));
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* =================================================
            LOGO
        ================================================= */}

        <Link className="logo" to="/">
          <img
            src="/images/logo.png"
            alt="NEED ONE SERVICE logo"
            className="logo-image"
          />
        </Link>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="nav-links">
          {/* SERVICES */}

          <div className="services-nav-wrapper" ref={servicesRef}>
            <button
              type="button"
              className={`services-nav-button ${servicesOpen ? "active" : ""}`}
              onClick={toggleServices}
            >
              <span>Services</span>

              <ChevronDown
                size={14}
                className={`services-chevron ${servicesOpen ? "open" : ""}`}
              />
            </button>

            {/* =================================================
                SERVICES DROPDOWN
            ================================================= */}

            {servicesOpen && (
              <div className="services-dropdown">
                {/* HEADER */}

                <div className="services-dropdown-header">
                  <span>OUR SERVICES</span>

                  <strong>Choose a service category</strong>
                </div>

                {/* CONTENT */}

                <div className="services-dropdown-content">
                  {/* CATEGORY COLUMN */}

                  <div className="service-category-list">
                    {serviceCategories.map((category, index) => (
                      <button
                        key={category.name}
                        type="button"
                        className={`service-category-item ${
                          selectedCategory === index ? "active" : ""
                        }`}
                        onClick={() => selectCategory(index)}
                      >
                        <span>{category.name}</span>

                        <span className="category-arrow">→</span>
                      </button>
                    ))}
                  </div>

                  {/* SUB-SERVICE COLUMN */}

                  <div className="service-submenu">
                    {selectedCategoryData ? (
                      <>
                        <div className="submenu-heading">
                          <span>{selectedCategoryData.name}</span>

                          <small>Select a service</small>
                        </div>

                        <div className="submenu-items">
                          {selectedCategoryData.services.map((service) => (
                            <Link
                              key={service.slug}
                              to={`/services/${service.slug}`}
                              className="service-submenu-item"
                              onClick={() => {
                                setServicesOpen(false);
                                setSelectedCategory(null);
                              }}
                            >
                              <span>{service.name}</span>

                              <ArrowRight size={14} />
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="submenu-empty">
                        <div className="submenu-empty-icon">1</div>

                        <strong>Select a category</strong>

                        <span>
                          Choose a category to view its available services.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* =================================================
              OTHER NAV ITEMS
          ================================================= */}

          <Link
            to="/amc"
            onClick={() => {
              setServicesOpen(false);
              setSelectedCategory(null);
            }}
          >
            AMC
          </Link>

          <Link to="/accessories-sales">Accessories &amp; Sales</Link>

          <Link
            to="/contact"
            onClick={() => {
              setServicesOpen(false);
              setSelectedCategory(null);
            }}
          >
            Contact
          </Link>

          <Link to="/register-professional" className="professional-link">
            Register as Professional
          </Link>
        </nav>

        {/* =================================================
            NAV ACTIONS
        ================================================= */}

        <div className="nav-actions">
          <button className="search-button" aria-label="Search" type="button">
            <Search size={20} />
          </button>

          <Link to="/login" className="login-button">
            <UserRound size={18} />

            <span>Login</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   HOME PAGE
========================================================= */

function HomePage() {
  const [currentImage, setCurrentImage] = useState(0);

  const location = useLocation();

  /* =================================================
     SCROLL TO SERVICES SECTION
  ================================================= */

  useEffect(() => {
    if (location.hash === "#services") {
      setTimeout(() => {
        document.getElementById("services")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [location]);

  /* =================================================
     AUTO CAROUSEL
  ================================================= */

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((current) => (current + 1) % heroImages.length);
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  /* =================================================
     PREVIOUS
  ================================================= */

  const previousImage = () => {
    setCurrentImage(
      (current) => (current - 1 + heroImages.length) % heroImages.length,
    );
  };

  /* =================================================
     NEXT
  ================================================= */

  const nextImage = () => {
    setCurrentImage((current) => (current + 1) % heroImages.length);
  };

  return (
    <div className="app">
      <main>
        {/* =================================================
            HERO
        ================================================= */}

        <section className="hero">
          {/* BACKGROUND */}

          <div className="hero-background">
            {heroImages.map((image, index) => (
              <img
                key={image}
                src={image}
                alt="NEED ONE SERVICE home service"
                className={`hero-bg-image ${
                  index === currentImage ? "active" : ""
                }`}
              />
            ))}

            <div className="hero-overlay" />
          </div>

          {/* HERO CONTENT */}

          <div className="hero-content">
            <div className="hero-copy">
              <div className="eyebrow">
                <span />
                TRUSTED HOME SERVICES
              </div>

              <h1>
                One Service.
                <br />
                <span>One Call Away.</span>
              </h1>

              <p>
                From everyday repairs to complete home maintenance, NEED ONE
                SERVICE connects you with trusted professionals for reliable,
                convenient and hassle-free home services.
              </p>

              <div className="hero-buttons">
                <button className="primary-button" type="button">
                  Book a Service
                  <ArrowRight size={18} />
                </button>

                <Link to="/#services" className="contact-services-button">
                  Explore Services
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* =================================================
              CAROUSEL CONTROLS
          ================================================= */}

          <div className="carousel-controls">
            <button
              type="button"
              onClick={previousImage}
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="carousel-dots">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentImage(index)}
                  className={index === currentImage ? "active" : ""}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button type="button" onClick={nextImage} aria-label="Next image">
              <ChevronRight size={20} />
            </button>
          </div>
        </section>

        {/* =================================================
            BENEFITS
        ================================================= */}

        <section className="service-benefits">
          <div className="benefit-item">
            <div className="benefit-icon">✓</div>

            <div>
              <strong>Verified</strong>
              <span>Professionals</span>
            </div>
          </div>

          <div className="benefit-item">
            <div className="benefit-icon">₹</div>

            <div>
              <strong>Transparent</strong>
              <span>Pricing</span>
            </div>
          </div>

          <div className="benefit-item">
            <div className="benefit-icon">◉</div>

            <div>
              <strong>Managed</strong>
              <span>Service</span>
            </div>
          </div>

          <div className="benefit-item">
            <div className="benefit-icon">♡</div>

            <div>
              <strong>Warranty</strong>
              <span>Support</span>
            </div>
          </div>

          <div className="benefit-item">
            <div className="benefit-icon">▣</div>

            <div>
              <strong>Easy</strong>
              <span>Payments</span>
            </div>
          </div>
        </section>

        {/* =================================================
            SERVICES
        ================================================= */}

        <section className="services-section" id="services">
          <div className="services-heading">
            <span className="services-eyebrow">WHAT WE OFFER</span>

            <h2>
              Everything your home needs,
              <br />
              <span>in one place.</span>
            </h2>

            <p>
              From everyday repairs to personal care and home assistance,
              discover trusted services designed around your needs.
            </p>
          </div>

          {/* =================================================
              SERVICE CARDS
          ================================================= */}

          <div className="service-cards">
            {/* =================================================
                HOME APPLIANCES
            ================================================= */}

            <article className="service-card">
              <div className="service-image">
                <img
                  src="/images/services/homeappliances.webp"
                  alt="Home appliances"
                />
              </div>

              <div className="service-card-content">
                <h3>Home Appliances</h3>

                <ul>
                  <li>AC</li>
                  <li>TV</li>
                  <li>Refrigerator</li>
                  <li>Washing Machine</li>
                  <li>Microwave</li>
                  <li>Water Purifier</li>
                </ul>

                <Link
                  to="/services/home-appliances"
                  className="service-explore"
                >
                  Explore
                  <ArrowRight size={15} />
                </Link>
              </div>
            </article>

            {/* =================================================
                HOME SERVICES
            ================================================= */}

            <article className="service-card">
              <div className="service-image">
                <img src="/images/services/HomeServices.webp" alt="Home services" />
              </div>

              <div className="service-card-content">
                <h3>Home Services</h3>

                <ul>
                  <li>Electrician</li>
                  <li>Plumber</li>
                  <li>Carpenter</li>
                  <li>Cleaning</li>
                </ul>

                <Link to="/services/home-services" className="service-explore">
                  Explore
                  <ArrowRight size={15} />
                </Link>
              </div>
            </article>

            {/* =================================================
                PERSONAL SERVICES
            ================================================= */}

            <article className="service-card">
              <div className="service-image">
                <img
                  src="/images/services/PersonalServices.webp"
                  alt="Personal services"
                />
              </div>

              <div className="service-card-content">
                <h3>Personal Services</h3>

                <ul>
                  <li>Makeup</li>
                  <li>Hair Styling</li>
                  <li>Beautician</li>
                </ul>

                <Link
                  to="/services/personal-services"
                  className="service-explore"
                >
                  Explore
                  <ArrowRight size={15} />
                </Link>
              </div>
            </article>

            {/* =================================================
                HOME STAFF
            ================================================= */}

            <article className="service-card">
              <div className="service-image">
                <img src="/images/services/homestaff.webp" alt="Home staff" />
              </div>

              <div className="service-card-content">
                <h3>Home Staff</h3>

                <ul>
                  <li>Maid</li>
                  <li>Cooking</li>
                  <li>Cleaning</li>
                  <li>Babysitting</li>
                  <li>Elder Assistance</li>
                </ul>

                <Link to="/services/home-staff" className="service-explore">
                  Explore
                  <ArrowRight size={15} />
                </Link>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

/* =========================================================
   APP ROUTING
========================================================= */

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* HOME */}

        <Route path="/" element={<HomePage />} />

        {/* SERVICES */}

        <Route path="/services" element={<ServicesPage />} />

        <Route path="/amc" element={<AMCPage />} />

        <Route path="/accessories-sales" element={<AccessoriesSalesPage />} />

        <Route
          path="/accessories-sales/products"
          element={<AccessoriesProductsPage />}
        />

        <Route
          path="/accessories-sales/products/:productId"
          element={<ProductDetailsPage />}
        />

        <Route
          path="/accessories/:categorySlug"
          element={<AccessoriesProductsPage />}
        />

        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/register-professional"
          element={<ProfessionalRegisterPage />}
        />

        {/* CATEGORY PAGES */}

        <Route
          path="/services/home-appliances"
          element={<HomeAppliancesPage />}
        />

        <Route path="/services/home-services" element={<HomeServicesPage />} />

        <Route
          path="/services/personal-services"
          element={<PersonalServicesPage />}
        />

        <Route path="/services/home-staff" element={<HomeStaffPage />} />

        {/* SERVICE DETAIL */}

        <Route path="/services/:serviceId" element={<ServiceDetailPage />} />

        {/* CONTACT */}

        <Route path="/contact" element={<ContactPage />} />

        {/* LOGIN */}

        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
