import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  ArrowRight,
  Wrench,
  ShieldCheck,
  Truck,
  ChevronRight,
} from "lucide-react";

import "./AccessoriesSalesPage.css";

/* =========================================================
   CATEGORIES
========================================================= */

const categories = [
  {
    title: "AC Accessories",
    description: "Filters, remotes, stands and more",
    icon: "❄️",
    slug: "ac-accessories",
  },
  {
    title: "Washing Machine Accessories",
    description: "Hoses, covers and useful accessories",
    icon: "🫧",
    slug: "washing-machine-accessories",
  },
  {
    title: "Refrigerator Accessories",
    description: "Parts and useful accessories",
    icon: "🧊",
    slug: "refrigerator-accessories",
  },
  {
    title: "TV Accessories",
    description: "Remotes, mounts and cables",
    icon: "📺",
    slug: "tv-accessories",
  },
  {
    title: "Kitchen Appliances",
    description: "Useful appliances for your kitchen",
    icon: "🍳",
    slug: "kitchen-appliances",
  },
  {
    title: "Electrical Accessories",
    description: "Cables, switches and essentials",
    icon: "⚡",
    slug: "electrical-accessories",
  },
  {
    title: "Other Accessories",
    description: "Useful products for everyday needs",
    icon: "✨",
    slug: "other-accessories",
  },
];

/* =========================================================
   PRODUCTS
========================================================= */

const products = [
  {
    id: 1,
    name: "Universal AC Remote",
    category: "AC Accessories",
    price: "₹499",
    oldPrice: "₹699",
    image: "📱",
    badge: "Popular",
  },
  {
    id: 2,
    name: "AC Dust Filter",
    category: "AC Accessories",
    price: "₹349",
    oldPrice: "₹499",
    image: "❄️",
    badge: "New",
  },
  {
    id: 3,
    name: "Washing Machine Cover",
    category: "Washing Machine Accessories",
    price: "₹599",
    oldPrice: "₹799",
    image: "🫧",
    badge: "Popular",
  },
  {
    id: 4,
    name: "Universal TV Remote",
    category: "TV Accessories",
    price: "₹299",
    oldPrice: "₹399",
    image: "📺",
    badge: "",
  },
  {
    id: 5,
    name: "Refrigerator Mat",
    category: "Refrigerator Accessories",
    price: "₹399",
    oldPrice: "₹549",
    image: "🧊",
    badge: "New",
  },
  {
    id: 6,
    name: "HDMI Cable",
    category: "Electrical Accessories",
    price: "₹449",
    oldPrice: "₹599",
    image: "🔌",
    badge: "",
  },
];

/* =========================================================
   HERO MINI CAROUSEL DATA
========================================================= */

const heroCarouselOne = [
  {
    title: "AC Service",
    subtitle: "Cooling & maintenance",
    image: "/images/accessories/ac-service.avif",
  },
  {
    title: "AC Accessories",
    subtitle: "Filters & remotes",
    image: "/images/accessories/ac-accessories.jpg",
  },
  {
    title: "Professional Care",
    subtitle: "Service at home",
    image: "/images/accessories/professional-care.webp",
  },
  {
    title: "AC Installation",
    subtitle: "Expert installation",
    image: "/images/accessories/ac-installation.jpeg",
  },
];

const heroCarouselTwo = [
  {
    title: "Refrigerator",
    subtitle: "Parts & accessories",
    image: "/images/accessories/refrigerator.avif",
  },
  {
    title: "Washing Machine",
    subtitle: "Covers & hoses",
    image: "/images/accessories/washing-machine.jpg",
  },
  {
    title: "Kitchen Appliances",
    subtitle: "Everyday essentials",
    image: "/images/accessories/kitchen-appliances.avif",
  },
  {
    title: "Home Appliances",
    subtitle: "Products & support",
    image: "/images/accessories/home-appliances.jpg",
  },
];

const heroCarouselThree = [
  {
    title: "TV Accessories",
    subtitle: "Remotes & mounts",
    image: "/images/accessories/tv-accessories.webp",
  },
  {
    title: "Electrical",
    subtitle: "Cables & essentials",
    image: "/images/accessories/electrical.jpg",
  },
  {
    title: "Installation",
    subtitle: "Professional support",
    image: "/images/accessories/installation.webp",
  },
  {
    title: "Home Support",
    subtitle: "OneService care",
    image: "/images/accessories/home-support.jpg",
  },
];

/* =========================================================
   TYPES
========================================================= */

type HeroCarouselItem = {
  title: string;
  subtitle: string;
  image: string;
};

/* =========================================================
   MINI VERTICAL CAROUSEL
========================================================= */

function MiniVerticalCarousel({
  items,
  direction,
  className = "",
}: {
  items: HeroCarouselItem[];
  direction: "up" | "down";
  className?: string;
}) {
  const duplicatedItems = [...items, ...items];

  return (
    <div className={`hero-mini-carousel ${className}`}>
      <div
        className={`hero-mini-track ${
          direction === "down" ? "move-down" : "move-up"
        }`}
      >
        {duplicatedItems.map((item, index) => (
          <div
            className="hero-mini-card"
            key={`${item.title}-${index}`}
          >
            <div className="hero-mini-image">
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
              />
            </div>

            <div className="hero-mini-content">
              <strong>{item.title}</strong>
              <span>{item.subtitle}</span>
            </div>

            <ChevronRight
              size={15}
              className="hero-mini-arrow"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

function AccessoriesSalesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    const query = searchTerm.trim();

    if (!query) {
      return;
    }

    window.location.href = `/accessories/all?search=${encodeURIComponent(
      query,
    )}`;
  };

  return (
    <main className="accessories-sales-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="accessories-hero">

        <div className="accessories-hero-content">

          <span className="accessories-eyebrow">
            ACCESSORIES &amp; SALES
          </span>

          <h1>
            Everything your home
            <span> needs.</span>
          </h1>

          <p>
            Find reliable accessories, useful products and everyday
            essentials for your home — all in one place.
          </p>

          {/* SEARCH */}

          <div className="accessories-search">

            <Search size={20} />

            <input
              type="text"
              placeholder="Search for accessories or products..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSearch();
                }
              }}
            />

            <button
              type="button"
              onClick={handleSearch}
            >
              Search
            </button>

          </div>

          {/* FEATURES */}

          <div className="accessories-hero-features">

            <div>
              <ShieldCheck size={18} />
              <span>Reliable products</span>
            </div>

            <div>
              <Truck size={18} />
              <span>Convenient delivery</span>
            </div>

            <div>
              <Wrench size={18} />
              <span>Installation support</span>
            </div>

          </div>

        </div>

        {/* ===================================================
            THREE VERTICAL CAROUSELS
        =================================================== */}

        <div className="accessories-hero-carousel">

          <div className="hero-carousel-heading">
            <span>ONE SERVICE</span>
            <strong>Products + Support</strong>
          </div>

          <div className="hero-carousel-columns">

            <MiniVerticalCarousel
              items={heroCarouselOne}
              direction="up"
              className="carousel-column-left"
            />

            <MiniVerticalCarousel
              items={heroCarouselTwo}
              direction="down"
              className="carousel-column-center"
            />

            <MiniVerticalCarousel
              items={heroCarouselThree}
              direction="up"
              className="carousel-column-right"
            />

          </div>

          <Link
            to="/accessories/all"
            className="hero-carousel-footer"
          >
            <span>
              Explore products &amp; services
            </span>

            <ArrowRight size={18} />
          </Link>

        </div>

      </section>

      {/* =====================================================
          SHOP BY CATEGORY
      ===================================================== */}

      <section className="accessories-section">

        <div className="accessories-section-heading">

          <div>

            <span className="section-label">
              SHOP BY CATEGORY
            </span>

            <h2>
              Find what you need
            </h2>

            <p>
              Browse accessories and products by category.
            </p>

          </div>

          <Link
            to="/accessories/all"
            className="view-all-button"
          >
            View all
            <ArrowRight size={17} />
          </Link>

        </div>

        {/* CATEGORY GRID */}

        <div className="category-grid">

          {/* ALL PRODUCTS */}

          <Link
            to="/accessories/all"
            className="category-card"
          >

            <div className="category-icon">
              ✨
            </div>

            <div>
              <h3>All Products</h3>

              <p>
                Browse everything
              </p>
            </div>

            <ChevronRight size={18} />

          </Link>

          {/* INDIVIDUAL CATEGORIES */}

          {categories.map((category) => (

            <Link
              to={`/accessories/${category.slug}`}
              className="category-card"
              key={category.slug}
            >

              <div className="category-icon">
                {category.icon}
              </div>

              <div>

                <h3>
                  {category.title}
                </h3>

                <p>
                  {category.description}
                </p>

              </div>

              <ChevronRight size={18} />

            </Link>

          ))}

        </div>

      </section>

      {/* =====================================================
          TOP PICKS
      ===================================================== */}

      <section className="accessories-section products-section">

        <div className="accessories-section-heading">

          <div>

            <span className="section-label">
              TOP PICKS
            </span>

            <h2>
              Popular picks for your home
            </h2>

            <p>
              Quality products selected for everyday home needs.
            </p>

          </div>

          <Link
            to="/accessories/all"
            className="view-all-button"
          >
            View all products
            <ArrowRight size={17} />
          </Link>

        </div>

        <div className="products-grid">

          {products.map((product) => (

            <article
              className="product-card"
              key={product.id}
            >

              <Link
                to={`/product/${product.id}`}
                className="product-image"
              >

                {product.badge && (
                  <span className="product-badge">
                    {product.badge}
                  </span>
                )}

                <div className="product-placeholder">
                  {product.image}
                </div>

                <button
                  type="button"
                  className="product-cart-button"
                  aria-label={`Add ${product.name} to cart`}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                >
                  <ShoppingCart size={18} />
                </button>

              </Link>

              <div className="product-info">

                <span className="product-category">
                  {product.category}
                </span>

                <h3>
                  {product.name}
                </h3>

                <div className="product-price">

                  <strong>
                    {product.price}
                  </strong>

                  <span>
                    {product.oldPrice}
                  </span>

                </div>

                <Link
                  to={`/product/${product.id}`}
                  className="product-view-button"
                >
                  View details
                  <ArrowRight size={16} />
                </Link>

              </div>

            </article>

          ))}

        </div>

      </section>

      {/* =====================================================
          SERVICE + PRODUCT
      ===================================================== */}

      <section className="service-product-section">

        <div className="service-product-content">

          <span className="section-label">
            MORE THAN JUST PRODUCTS
          </span>

          <h2>
            Need help after
            <span> buying?</span>
          </h2>

          <p>
            OneService connects products with professional service.
            If your product needs installation, maintenance or support,
            we can help with that too.
          </p>

          <Link
            to="/services"
            className="service-product-button"
          >
            Explore our services
            <ArrowRight size={18} />
          </Link>

        </div>

        <div className="service-product-card">

          <div className="service-step">
            <span>01</span>

            <div>
              <strong>Choose your product</strong>
              <p>Find the accessory you need.</p>
            </div>
          </div>

          <div className="service-step">
            <span>02</span>

            <div>
              <strong>Get it delivered</strong>
              <p>Receive it conveniently at home.</p>
            </div>
          </div>

          <div className="service-step">
            <span>03</span>

            <div>
              <strong>Book support</strong>
              <p>Get professional installation or service.</p>
            </div>
          </div>

        </div>

      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="accessories-final-cta">

        <div>

          <span className="section-label">
            NEED ONE SERVICE
          </span>

          <h2>
            Your home.
            <br />
            Taken care of.
          </h2>

          <p>
            From products to professional services, Need One Service
            keeps everything simple.
          </p>

        </div>

        <Link
          to="/services"
          className="service-product-button"
        >
          Explore services
          <ArrowRight size={18} />
        </Link>

      </section>

    </main>
  );
}

export default AccessoriesSalesPage;