
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
  Navigate,
  useLocation,
} from "react-router-dom";

import "./App.css";

/* =========================================================
   PUBLIC PAGES
========================================================= */

import ServicesPage from "./pages/ServicesPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";

import HomeAppliancesPage from "./pages/HomeAppliancesPage";
import HomeServicesPage from "./pages/HomeServicesPage";
import PersonalServicesPage from "./pages/PersonalServicesPage";
import HomeStaffPage from "./pages/HomeStaffPage";
import EduTechPage from "./pages/EduTechPage";
import ProfessionalServicesPage from "./pages/ProfessionalServicesPage";

import AMCPage from "./pages/AMCPage";
import AccessoriesSalesPage from "./pages/AccessoriesSalesPage";
import CityListingsPage from "./pages/CityListingsPage";

import RegisterPage from "./pages/RegisterPage";
import ProfessionalRegisterPage from "./pages/ProfessionalRegisterPage";
import PartnerRegisterPage from "./pages/PartnerRegisterPage";
import VendorRegisterPage from "./pages/VendorRegisterPage";
import StudentRegisterPage from "./pages/StudentRegisterPage";
import TutorRegisterPage from "./pages/TutorRegisterPage";

import CartPage from "./pages/CartPage";
import AccessoriesProductsPage from "./pages/AccessoriesProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";

import Footer from "./components/Footer";

/* =========================================================
   ADMIN
========================================================= */

import AdminLayout from "./admin/components/AdminLayout";
import AdminProtectedRoute from "./admin/components/AdminProtectedRoute";

import AdminDashboard from "./admin/pages/AdminDashboard";
import BookServicesPage from "./admin/pages/BookServices";
import ProductsPage from "./admin/pages/Products";
import BusinessesPage from "./admin/pages/Businesses";
import SubscriptionsPage from "./admin/pages/Subscriptions";
import CompliancePage from "./admin/pages/Compliance";
import SettingsPage from "./admin/pages/Settings";
import AdminLogin from "./admin/pages/AdminLogin";

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
   HOME SERVICE CARD DATA
========================================================= */

const homeServiceCards = [
  {
    title: "Home Appliances",
    description:
      "Repair, maintenance and installation for your everyday appliances.",
    image: "/images/services/homeappliances.webp",
    alt: "Home appliance repair services",
    path: "/services/home-appliances",
    services: [
      "AC",
      "TV",
      "Refrigerator",
      "Washing Machine",
      "Microwave",
      "Water Purifier",
    ],
  },
  {
    title: "Home Services",
    description:
      "Reliable help for electrical, plumbing, carpentry and cleaning needs.",
    image: "/images/services/HomeServices.webp",
    alt: "Home maintenance and repair services",
    path: "/services/home-services",
    services: ["Electrician", "Plumber", "Carpenter", "Cleaning"],
  },
  {
    title: "Personal Services",
    description:
      "Professional personal care and beauty services at your convenience.",
    image: "/images/services/PersonalServices.webp",
    alt: "Personal care and beauty services",
    path: "/services/personal-services",
    services: ["Makeup", "Hair Styling", "Beautician"],
  },
  {
    title: "Home Staff",
    description:
      "Everyday assistance for a more comfortable and well-managed home.",
    image: "/images/services/homestaff.webp",
    alt: "Home staff and household assistance",
    path: "/services/home-staff",
    services: [
      "Maid",
      "Cooking",
      "Cleaning",
      "Babysitting",
      "Elder Assistance",
    ],
  },
  {
    title: "EduTech & Home Tutors",
    description:
      "Find tutors and trainers for academic learning and skill development.",
    image: "/images/services/edutech.webp",
    alt: "Education, tuition and home tutoring services",
    path: "/services/edutech",
    services: [
      "School Tuition",
      "Competitive Exam Coaching",
      "Higher Education Tutors",
      "Language & Skill Classes",
    ],
    fallbackImage: "/images/services/homestaff.webp",
  },
  {
    title: "Professional Services",
    description:
      "Connect with specialists for professional advice, support and expertise.",
    image: "/images/professionalservices/legal-financial.webp",
    alt: "Professional consultation and specialist services",
    path: "/services/professional-services",
    services: [
      "Legal, Tax & Financial",
      "Healthcare & Medical",
      "Religious, Vedic & Astrology",
      "Arts, Hobbies & Trainers",
      "Freelancers, Tech & Academic",
      "Event Artists & Performers",
      "Personal Helpers & Support",
      "Artisans & Local Craftsmen",
    ],
    fallbackImage: "/images/services/repairs.png",
  },
];

/* =========================================================
   NAVBAR
========================================================= */

function Navbar() {
  const [networkOpen, setNetworkOpen] = useState(false);

  const networkRef = useRef<HTMLDivElement>(null);

  /* CLOSE NETWORK DROPDOWN WHEN CLICKING OUTSIDE */

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (networkRef.current && !networkRef.current.contains(target)) {
        setNetworkOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const closeDropdowns = () => {
    setNetworkOpen(false);
  };

  const toggleNetwork = () => {
    setNetworkOpen((current) => !current);
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* LOGO */}

        <Link className="logo" to="/" onClick={closeDropdowns}>
          <img
            src="/images/logo.png"
            alt="NEED ONE SERVICE logo"
            className="logo-image"
          />
        </Link>

        {/* NAVIGATION */}

        <nav className="nav-links">
          <Link to="/services" onClick={closeDropdowns}>
            Services
          </Link>

          <Link to="/accessories-sales" onClick={closeDropdowns}>
            MarketPlace
          </Link>

          <Link to="/city-listings" onClick={closeDropdowns}>
            City Listings
          </Link>

          <Link to="/contact" onClick={closeDropdowns}>
            Contact
          </Link>

          {/* JOIN OUR NETWORK */}

          <div className="network-nav-wrapper" ref={networkRef}>
            <button
              type="button"
              className={`network-nav-button ${
                networkOpen ? "active" : ""
              }`}
              onClick={toggleNetwork}
              aria-expanded={networkOpen}
              aria-haspopup="true"
            >
              <span>Join Our Network</span>

              <ChevronDown
                size={14}
                className={networkOpen ? "open" : ""}
              />
            </button>

            {networkOpen && (
              <div className="network-dropdown">
                <div className="network-dropdown-header">
                  <span>JOIN OUR NETWORK</span>

                  <strong>Choose how you want to grow with us</strong>
                </div>

                <div className="network-dropdown-items">
                  <Link
                    to="/register-professional"
                    className="network-dropdown-item"
                    onClick={closeDropdowns}
                  >
                    <div className="network-item-icon">🔧</div>

                    <div className="network-item-content">
                      <strong>Join as a Technician</strong>
                      <span>Provide professional home services</span>
                    </div>

                    <ArrowRight size={15} />
                  </Link>

                  <Link
                    to="/register-partner"
                    className="network-dropdown-item"
                    onClick={closeDropdowns}
                  >
                    <div className="network-item-icon">🤝</div>

                    <div className="network-item-content">
                      <strong>Join as a Service Partner</strong>
                      <span>Grow your service business with us</span>
                    </div>

                    <ArrowRight size={15} />
                  </Link>

                  <Link
                    to="/register-vendor"
                    className="network-dropdown-item"
                    onClick={closeDropdowns}
                  >
                    <div className="network-item-icon">🏪</div>

                    <div className="network-item-content">
                      <strong>Join as a Vendor</strong>
                      <span>Sell products and accessories</span>
                    </div>

                    <ArrowRight size={15} />
                  </Link>

                  <Link
                    to="/register-student"
                    className="network-dropdown-item"
                    onClick={closeDropdowns}
                  >
                    <div className="network-item-icon">🎓</div>

                    <div className="network-item-content">
                      <strong>Join as a Student</strong>
                      <span>Learn, train and build your skills</span>
                    </div>

                    <ArrowRight size={15} />
                  </Link>

                  <Link
                    to="/register-tutor"
                    className="network-dropdown-item"
                    onClick={closeDropdowns}
                  >
                    <div className="network-item-icon">📚</div>

                    <div className="network-item-content">
                      <strong>Join as a Tutor</strong>
                      <span>Share your knowledge and teach others</span>
                    </div>

                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* NAV ACTIONS */}

        <div className="nav-actions">
          <Link
            to="/accessories/all"
            className="search-button"
            aria-label="Search products"
            onClick={closeDropdowns}
          >
            <Search size={20} />
          </Link>

          <Link
            to="/login"
            className="login-button"
            onClick={closeDropdowns}
          >
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

  /* SCROLL TO SERVICES SECTION */

  useEffect(() => {
    if (location.hash === "#services") {
      const timer = window.setTimeout(() => {
        document.getElementById("services")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);

      return () => window.clearTimeout(timer);
    }
  }, [location]);

  /* HERO AUTO CAROUSEL */

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentImage((current) => (current + 1) % heroImages.length);
    }, 5000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const previousImage = () => {
    setCurrentImage(
      (current) => (current - 1 + heroImages.length) % heroImages.length,
    );
  };

  const nextImage = () => {
    setCurrentImage((current) => (current + 1) % heroImages.length);
  };

  return (
    <div className="app">
      <main>
        {/* HERO */}

        <section className="hero">
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
                <Link to="/services" className="primary-button">
                  Book a Service
                  <ArrowRight size={18} />
                </Link>

                <Link to="/#services" className="contact-services-button">
                  Explore Services
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* HERO CAROUSEL CONTROLS */}

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

            <button
              type="button"
              onClick={nextImage}
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </section>

        {/* BENEFITS */}

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
            SERVICES — BLUE GLASSMORPHISM CARDS
            Existing section background is preserved.
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

          {/* MOVING CARD TRACK */}

          <div
            className="glass-services-marquee"
            aria-label="Explore OneService categories"
          >
            <div className="glass-services-track">
              {[0, 1].map((copy) => (
                <div
                  className="glass-services-group"
                  key={copy}
                  aria-hidden={copy === 1 ? "true" : undefined}
                >
                  {homeServiceCards.map((service) => (
                    <Link
                      key={`${copy}-${service.path}`}
                      to={service.path}
                      className="glass-service-card"
                      tabIndex={copy === 1 ? -1 : undefined}
                    >
                      <div className="glass-service-image">
                        <img
                          src={service.image}
                          alt={copy === 1 ? "" : service.alt}
                          loading="lazy"
                          onError={(event) => {
                            if (
                              service.fallbackImage &&
                              event.currentTarget.src !==
                                new URL(
                                  service.fallbackImage,
                                  window.location.origin,
                                ).href
                            ) {
                              event.currentTarget.src =
                                service.fallbackImage;
                            }
                          }}
                        />

                        <span className="glass-service-image-shade" />
                        <span className="glass-service-number">
                          {String(
                            homeServiceCards.indexOf(service) + 1,
                          ).padStart(2, "0")}
                        </span>
                      </div>

                      <div className="glass-service-content">
                        <h3>{service.title}</h3>

                        <p className="glass-service-description">
                          {service.description}
                        </p>

                        <div className="glass-service-tags">
                          {service.services.slice(0, 3).map((item) => (
                            <span key={item}>{item}</span>
                          ))}

                          {service.services.length > 3 && (
                            <span>+{service.services.length - 3} more</span>
                          )}
                        </div>

                        <span className="glass-service-explore">
                          Explore services
                          <span className="glass-service-arrow">
                            <ArrowRight size={17} />
                          </span>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* VIEW ALL SERVICES */}

          <div className="service-cards-top">
            <Link to="/services" className="view-all-services-button">
              View All Services
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

/* =========================================================
   APP CONTENT
========================================================= */

function AppContent() {
  const location = useLocation();

  /*
   * Admin pages use their own complete layout.
   * The public navbar and footer are hidden on admin routes.
   */

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* HOME */}

        <Route path="/" element={<HomePage />} />

        {/* SERVICES */}

        <Route path="/services" element={<ServicesPage />} />

        {/* AMC */}

        <Route path="/amc" element={<AMCPage />} />

        <Route path="/city-listings" element={<CityListingsPage />} />

        {/* ACCESSORIES & MARKETPLACE */}

        <Route
          path="/accessories-sales"
          element={<AccessoriesSalesPage />}
        />

        <Route
          path="/accessories"
          element={<Navigate to="/accessories/all" replace />}
        />

        <Route
          path="/accessories/all"
          element={<AccessoriesProductsPage />}
        />

        <Route
          path="/accessories/:categorySlug/:subcategorySlug"
          element={<AccessoriesProductsPage />}
        />

        <Route
          path="/accessories/:categorySlug"
          element={<AccessoriesProductsPage />}
        />

        <Route
          path="/accessories-sales/products"
          element={<AccessoriesProductsPage />}
        />

        <Route
          path="/accessories-sales/products/:productId"
          element={<ProductDetailsPage />}
        />

        {/* SHOPPING CART */}

        <Route path="/cart" element={<CartPage />} />

        {/* REGISTRATION */}

        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/register-professional"
          element={<ProfessionalRegisterPage />}
        />

        <Route
          path="/register-partner"
          element={<PartnerRegisterPage />}
        />

        <Route path="/register-vendor" element={<VendorRegisterPage />} />

        <Route path="/register-student" element={<StudentRegisterPage />} />

        <Route path="/register-tutor" element={<TutorRegisterPage />} />

        {/* SERVICE CATEGORY PAGES */}

        <Route
          path="/services/home-appliances"
          element={<HomeAppliancesPage />}
        />

        <Route
          path="/services/home-services"
          element={<HomeServicesPage />}
        />

        <Route
          path="/services/personal-services"
          element={<PersonalServicesPage />}
        />

        <Route path="/services/home-staff" element={<HomeStaffPage />} />

        <Route path="/services/edutech" element={<EduTechPage />} />

        <Route
          path="/services/professional-services"
          element={<ProfessionalServicesPage />}
        />

        {/* SERVICE DETAIL */}

        <Route
          path="/services/:serviceId"
          element={<ServiceDetailPage />}
        />

        {/* CONTACT */}

        <Route path="/contact" element={<ContactPage />} />

        {/* LOGIN */}

        <Route path="/login" element={<LoginPage />} />

        {/* ADMIN LOGIN */}

        <Route path="/admin/login" element={<AdminLogin />} />

        {/* PROTECTED ADMIN AREA */}

        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />

            <Route path="book-services" element={<BookServicesPage />} />

            <Route path="products" element={<ProductsPage />} />

            <Route path="businesses" element={<BusinessesPage />} />

            <Route path="subscriptions" element={<SubscriptionsPage />} />

            <Route path="compliance" element={<CompliancePage />} />

            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
}

/* =========================================================
   APP
========================================================= */

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
