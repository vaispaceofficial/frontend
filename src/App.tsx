
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { CSSProperties } from "react";

import {
  Search,
  UserRound,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ChevronDown,
  Wrench,
  Sparkles,
  GraduationCap,
  BriefcaseBusiness,
  House,
  ShieldCheck,
} from "lucide-react";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";

import { gsap } from "gsap";
import { Flip } from "gsap/Flip";

import "./App.css";

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
import AccessoriesSalesPage from "./pages/Marketplace";



import CityListingsPage from "./pages/CityListingsPage";
import CityListingsBrowsePage from "./pages/CityListingsBrowsePage";

import RegisterPage from "./pages/RegisterPage";
import ProfessionalRegisterPage from "./pages/ProfessionalRegisterPage";
import PartnerRegisterPage from "./pages/PartnerRegisterPage";
import VendorRegisterPage from "./pages/VendorRegisterPage";
import StudentRegisterPage from "./pages/StudentRegisterPage";
import TutorRegisterPage from "./pages/TutorRegisterPage";

import CartPage from "./pages/CartPage";
import AccessoriesProductsPage from "./pages/AccessoriesProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";

import FindMyPropertyPage from "./pages/FindMyPropertyPage";

import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";

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
   GSAP SETUP
========================================================= */

gsap.registerPlugin(Flip);

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
    path: "/services?category=Home%20Appliances",
    icon: Wrench,
    accent: "#60a5fa",
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
    image: "/images/homeservice.jpg",
    alt: "Home maintenance and repair services",
    path: "/services?category=Home%20Services",
    icon: House,
    accent: "#38bdf8",
    services: [
      "Electrician",
      "Plumber",
      "Carpenter",
      "Cleaning",
    ],
  },
  {
    title: "Personal Services",
    description:
      "Professional personal care and beauty services at your convenience.",
    image: "/images/services/PersonalServices.webp",
    alt: "Personal care and beauty services",
    path: "/services?category=Personal%20Services",
    icon: Sparkles,
    accent: "#a78bfa",
    services: [
      "Makeup",
      "Hair Styling",
      "Beautician",
    ],
  },
  {
    title: "Home Staff",
    description:
      "Everyday assistance for a more comfortable and well-managed home.",
    image: "/images/services/homestaff.webp",
    alt: "Home staff and household assistance",
    path: "/services?category=Home%20Staff",
    icon: ShieldCheck,
    accent: "#34d399",
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
    alt: "Education and home tutoring services",
    path: "/services?category=EduTech%20%26%20Home%20Tutors",
    icon: GraduationCap,
    accent: "#fbbf24",
    fallbackImage: "/images/edutech.jpg",
    services: [
      "Home Tution",
      "Competitive Exam Coaching",
      "Higher Education Tutors",
      "Language & Skill Classes",
    ],
  },
  {
    title: "Professional Services",
    description:
      "Connect with specialists for advice, support and expertise.",
    image: "/images/professionalservices/legal-financial.webp",
    alt: "Professional consultation and specialist services",
    path: "/services?category=Professional%20Services",
    icon: BriefcaseBusiness,
    accent: "#fb923c",
    fallbackImage: "/images/Lawyers.jpg",
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
  },
];

/* =========================================================
   NAVBAR
========================================================= */

function Navbar() {
  const [networkOpen, setNetworkOpen] = useState(false);
  const networkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        networkRef.current &&
        !networkRef.current.contains(target)
      ) {
        setNetworkOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  const closeDropdowns = () => {
    setNetworkOpen(false);
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link
          className="logo"
          to="/"
          onClick={closeDropdowns}
        >
          <img
            src="/images/logo.png"
            alt="NEED ONE SERVICE logo"
            className="logo-image"
          />
        </Link>

        <nav className="nav-links">
          <Link
            to="/services"
            onClick={closeDropdowns}
          >
            Services
          </Link>

          <Link
            to="/marketplace"
            onClick={closeDropdowns}
          >
            Marketplace
          </Link>

          <Link
            to="/city-listings"
            onClick={closeDropdowns}
          >
            City Listings
          </Link>

          <Link
            to="/contact"
            onClick={closeDropdowns}
          >
            Contact
          </Link>

          <div
            className="network-nav-wrapper"
            ref={networkRef}
          >
            <button
              type="button"
              className={`network-nav-button ${networkOpen ? "active" : ""
                }`}
              onClick={() =>
                setNetworkOpen((current) => !current)
              }
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

                  <strong>
                    Choose how you want to grow with us
                  </strong>
                </div>

                <div className="network-dropdown-items">
                  {[
                    {
                      path: "/register-professional",
                      icon: "🔧",
                      title: "Join as a Professional",
                      description:
                        "Provide trusted home services",
                    },
                    {
                      path: "/register-partner",
                      icon: "🛠️",
                      title: "Products & Spares",
                      description:
                        "Explore and sell products and spare parts",
                    },
                    {
                      path: "/register-vendor",
                      icon: "🏪",
                      title: "Business & Vendors",
                      description:
                        "Grow your business with OneService",
                    },
                    {
                      path: "/register-student",
                      icon: "🎓",
                      title: "Join as a Student",
                      description:
                        "Learn, train and build your skills",
                    },
                  ].map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="network-dropdown-item"
                      onClick={closeDropdowns}
                    >
                      <div className="network-item-icon">
                        {item.icon}
                      </div>

                      <div className="network-item-content">
                        <strong>{item.title}</strong>
                        <span>{item.description}</span>
                      </div>

                      <ArrowRight size={15} />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

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
   GSAP SERVICE CARD STACK
   - Auto rotates every 3 seconds
   - Pauses on hover
   - Clicking a card opens its category
   - Respects reduced-motion preferences
========================================================= */

function ServiceCardStack() {
  const stackRef = useRef<HTMLDivElement>(null);
  const animatingRef = useRef(false);
  const hoveredRef = useRef(false);

  const flipStateRef = useRef<
    ReturnType<typeof Flip.getState> | null
  >(null);

  const [orderedCards, setOrderedCards] =
    useState(homeServiceCards);

  const [, setIsAnimating] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const moveCard = () => {
    const stack = stackRef.current;

    if (!stack || animatingRef.current) return;

    const cards = Array.from(
      stack.querySelectorAll<HTMLElement>(
        ".stack-service-card",
      ),
    );

    if (cards.length < 2) return;

    animatingRef.current = true;
    setIsAnimating(true);

    flipStateRef.current = Flip.getState(cards);

    setOrderedCards((current) => [
      current[current.length - 1],
      ...current.slice(0, -1),
    ]);
  };

  useEffect(() => {
    const media = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const update = () => {
      setReducedMotion(media.matches);
    };

    update();

    media.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  useLayoutEffect(() => {
    const state = flipStateRef.current;

    if (!state) return;

    flipStateRef.current = null;

    const animation = Flip.from(state, {
      duration: reducedMotion ? 0 : 0.7,
      ease: "power2.inOut",
      absolute: true,
      scale: true,
      onComplete: () => {
        animatingRef.current = false;
        setIsAnimating(false);
      },
      onInterrupt: () => {
        animatingRef.current = false;
        setIsAnimating(false);
      },
    });

    return () => {
      animation.kill();
    };
  }, [orderedCards, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    const timer = window.setInterval(() => {
      if (
        hoveredRef.current ||
        animatingRef.current
      ) {
        return;
      }

      moveCard();
    }, 3000);

    return () => {
      window.clearInterval(timer);
    };
  }, [reducedMotion]);

  const currentIndex = homeServiceCards.findIndex(
    (service) =>
      service.title === orderedCards[0]?.title,
  );

  return (
    <div
      className="service-stack-area"
      onMouseEnter={() => {
        hoveredRef.current = true;
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
      }}
      onFocusCapture={() => {
        hoveredRef.current = true;
      }}
      onBlurCapture={(event) => {
        const next = event.relatedTarget as Node | null;

        if (
          !next ||
          !event.currentTarget.contains(next)
        ) {
          hoveredRef.current = false;
        }
      }}
    >
      <div className="service-stack-heading">
        <span className="service-stack-count">
          {String(currentIndex + 1).padStart(2, "0")}
          {" / "}
          {String(homeServiceCards.length).padStart(2, "0")}
        </span>

        <span className="service-stack-heading-label">
          DISCOVER OUR SERVICES
        </span>
      </div>

      <div
        className="service-card-stack"
        ref={stackRef}
        aria-label="Explore OneService categories"
      >
        {orderedCards.map((service, index) => {
          const Icon = service.icon;

          const originalIndex =
            homeServiceCards.findIndex(
              (item) => item.title === service.title,
            );

          return (
            <Link
              to={service.path}
              className={`stack-service-card stack-card-${index + 1
                }`}
              key={service.title}
              style={
                {
                  "--card-accent": service.accent,
                  "--card-order": index,
                } as CSSProperties
              }
              aria-label={`Explore ${service.title}`}
              tabIndex={index < 3 ? 0 : -1}
            >
              <div className="stack-card-image">
                <img
                  src={service.image}
                  alt={service.alt}
                  draggable={false}
                  onError={(event) => {
                    const image = event.currentTarget;

                    if (
                      service.fallbackImage &&
                      !image.dataset.fallbackUsed
                    ) {
                      image.dataset.fallbackUsed = "true";
                      image.src = service.fallbackImage;
                    }
                  }}
                />

                <div className="stack-card-image-overlay" />
              </div>

              <div className="stack-card-topline">
                <span className="stack-card-brand">
                  <span className="stack-brand-mark">
                    <Icon size={16} />
                  </span>

                  ONE SERVICE
                </span>

                <span className="stack-card-number">
                  {String(originalIndex + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="stack-card-main">
                <span className="stack-card-category">
                  SERVICE CATEGORY
                </span>

                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>

              <div className="stack-card-bottom">
                <div className="stack-card-tags">
                  {service.services
                    .slice(0, 2)
                    .map((item) => (
                      <span key={item}>{item}</span>
                    ))}

                  {service.services.length > 2 && (
                    <span>
                      +{service.services.length - 2}
                    </span>
                  )}
                </div>

                <span className="stack-card-arrow">
                  <ArrowRight size={19} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="service-stack-controls">
        <span className="service-stack-hint">
          Hover to pause · Select a card to explore
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   HOME PAGE
========================================================= */

function HomePage() {
  const [currentImage, setCurrentImage] = useState(0);
  const location = useLocation();

  /*
   * Scroll to the services section when navigating to /#services.
   */
  useEffect(() => {
    if (location.hash !== "#services") return;

    const timer = window.setTimeout(() => {
      document.getElementById("services")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);

    return () => {
      window.clearTimeout(timer);
    };
  }, [location]);

  /*
   * Hero image autoplay.
   */
  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentImage(
        (current) =>
          (current + 1) % heroImages.length,
      );
    }, 5000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const previousImage = () => {
    setCurrentImage(
      (current) =>
        (current - 1 + heroImages.length) %
        heroImages.length,
    );
  };

  const nextImage = () => {
    setCurrentImage(
      (current) =>
        (current + 1) % heroImages.length,
    );
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
                className={`hero-bg-image ${index === currentImage ? "active" : ""
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
                From everyday repairs to complete home
                maintenance, NEED ONE SERVICE connects you
                with trusted professionals for reliable,
                convenient and hassle-free home services.
              </p>

              <div className="hero-buttons">
                <Link
                  to="/services"
                  className="primary-button"
                >
                  Book a Service
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/#services"
                  className="contact-services-button"
                >
                  Explore Services
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          <div className="carousel-controls">
            <button
              type="button"
              onClick={previousImage}
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="carousel-dots">
              {heroImages.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setCurrentImage(index)}
                  className={
                    index === currentImage ? "active" : ""
                  }
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

        {/* SERVICES — GSAP CARD STACK */}
        <section
          className="services-section"
          id="services"
        >
          <div className="services-stack-layout">
            <div className="services-stack-copy">
              <span className="services-eyebrow">
                WHAT WE OFFER
              </span>

              <h2>
                Everything your home needs,
                <br />
                <span>in one place.</span>
              </h2>

              <p>
                From everyday repairs to personal care, home
                assistance, education and professional
                expertise — find the right service for every
                part of your life.
              </p>

              <div className="services-stack-benefits">
                <div>
                  <span className="services-stack-benefit-icon">
                    <ShieldCheck size={19} />
                  </span>

                  <span>
                    <strong>One trusted platform</strong>
                    <small>
                      Services for your everyday needs
                    </small>
                  </span>
                </div>

                <div>
                  <span className="services-stack-benefit-icon">
                    <Wrench size={19} />
                  </span>

                  <span>
                    <strong>
                      Multiple service categories
                    </strong>
                    <small>
                      Explore the right help for your needs
                    </small>
                  </span>
                </div>
              </div>

              <Link
                to="/services"
                className="view-all-services-button"
              >
                Explore All Services
                <ArrowRight size={17} />
              </Link>
            </div>

            <ServiceCardStack />
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

  const isAdminRoute =
    location.pathname.startsWith("/admin");

  return (
    <>
      {/* Hide the public navbar on admin pages */}
      {!isAdminRoute && <Navbar />}

      {/* Scroll to the top when the route changes */}
      <ScrollToTop />

      {/* APPLICATION ROUTES */}
      <Routes>
        {/* HOME */}
        <Route
          path="/"
          element={<HomePage />}
        />

        {/* SERVICES */}
        <Route
          path="/services"
          element={<ServicesPage />}
        />

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

        <Route
          path="/services/home-staff"
          element={<HomeStaffPage />}
        />

        <Route
          path="/services/edutech"
          element={<EduTechPage />}
        />

        <Route
          path="/services/professional-services"
          element={<ProfessionalServicesPage />}
        />

        <Route
          path="/services/:serviceId"
          element={<ServiceDetailPage />}
        />

        {/* AMC */}
        <Route
          path="/amc"
          element={<AMCPage />}
        />

        {/* CITY LISTINGS */}
        <Route
          path="/city-listings"
          element={<CityListingsPage />}
        />

        <Route
          path="/city-listings-explore/browse"
          element={<CityListingsBrowsePage />}
        />

        <Route path="/find-my-property" element={<FindMyPropertyPage />} />

        {/* MARKETPLACE */}
        <Route
          path="/marketplace"
          element={<AccessoriesSalesPage />}
        />

        {/* Redirect the old Marketplace URL */}
        <Route
          path="/accessories-sales"
          element={
            <Navigate
              to="/marketplace"
              replace
            />
          }
        />

        {/* PRODUCT CATEGORIES */}
        <Route
          path="/accessories"
          element={
            <Navigate
              to="/accessories/all"
              replace
            />
          }
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

        {/* PRODUCT LISTING & DETAILS */}
        <Route
          path="/accessories-sales/products"
          element={<AccessoriesProductsPage />}
        />

        <Route
          path="/accessories-sales/products/:productId"
          element={<ProductDetailsPage />}
        />

        {/* CART */}
        <Route
          path="/cart"
          element={<CartPage />}
        />

        {/* REGISTRATION */}
        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/register-professional"
          element={<ProfessionalRegisterPage />}
        />

        <Route
          path="/register-partner"
          element={<PartnerRegisterPage />}
        />

        <Route
          path="/register-vendor"
          element={<VendorRegisterPage />}
        />

        <Route
          path="/register-student"
          element={<StudentRegisterPage />}
        />

        <Route
          path="/register-tutor"
          element={<TutorRegisterPage />}
        />

        {/* CONTACT & LOGIN */}
        <Route
          path="/contact"
          element={<ContactPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        {/* ADMIN LOGIN */}
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* PROTECTED ADMIN ROUTES */}
        <Route element={<AdminProtectedRoute />}>
          <Route
            path="/admin"
            element={<AdminLayout />}
          >
            <Route
              index
              element={<AdminDashboard />}
            />

            <Route
              path="book-services"
              element={<BookServicesPage />}
            />

            <Route
              path="products"
              element={<ProductsPage />}
            />

            <Route
              path="businesses"
              element={<BusinessesPage />}
            />

            <Route
              path="subscriptions"
              element={<SubscriptionsPage />}
            />

            <Route
              path="compliance"
              element={<CompliancePage />}
            />

            <Route
              path="settings"
              element={<SettingsPage />}
            />
          </Route>
        </Route>
      </Routes>

      {/* Hide the public footer on admin pages */}
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
