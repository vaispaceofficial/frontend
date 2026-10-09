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
    title: "Home Appliances",
    description: "Products, Spare Parts and Accessories.",
    icon: "🏠",
    slug: "home-appliances",
  },
  {
    title: "Electronics, Mobile & Computer Accessories",
    description: "Mobiles, computers, audio and security.",
    icon: "📱",
    slug: "electronics-mobile-computer-accessories",
  },
  {
    title: "Fashion, Clothing & Apparel",
    description: "Clothing, footwear, bags and accessories.",
    icon: "👕",
    slug: "fashion-clothing-apparel",
  },
  {
    title: "Furniture, Home Decor & Lighting",
    description: "Furniture, lighting and home decor.",
    icon: "🛋️",
    slug: "furniture-home-decor-lighting",
  },
  {
    title: "Sports, Fitness & Outdoor Goods",
    description: "Fitness equipment and sports essentials.",
    icon: "🏸",
    slug: "sports-fitness-outdoor-goods",
  },
];

/* =========================================================
   PRODUCTS
========================================================= */

const products = [
  {
    id: 1,
    name: "Universal AC Remote",
    category: "Home Appliances",
    price: "₹499",
    oldPrice: "₹699",
    image: "❄️",
    badge: "Popular",
  },
  {
    id: 2,
    name: "RO Water Purifier Filter",
    category: "Home Appliances",
    price: "₹349",
    oldPrice: "₹499",
    image: "💧",
    badge: "Popular",
  },
  {
    id: 3,
    name: "USB-C Charging Cable",
    category: "Electronics, Mobile & Computer Accessories",
    price: "₹299",
    oldPrice: "₹399",
    image: "🔌",
    badge: "Popular",
  },
  {
    id: 4,
    name: "Wireless Earbuds",
    category: "Electronics, Mobile & Computer Accessories",
    price: "₹999",
    oldPrice: "₹1,299",
    image: "🎧",
    badge: "New",
  },
  {
    id: 5,
    name: "Everyday Casual T-Shirt",
    category: "Fashion, Clothing & Apparel",
    price: "₹499",
    oldPrice: "₹699",
    image: "👕",
    badge: "New",
  },
  {
    id: 6,
    name: "Decorative Table Lamp",
    category: "Furniture, Home Decor & Lighting",
    price: "₹799",
    oldPrice: "₹999",
    image: "💡",
    badge: "",
  },
  {
    id: 7,
    name: "Resistance Bands Set",
    category: "Sports, Fitness & Outdoor Goods",
    price: "₹399",
    oldPrice: "₹599",
    image: "💪",
    badge: "Popular",
  },
];

/* =========================================================
   HERO MINI CAROUSEL DATA
========================================================= */

const heroCarouselOne = [
  {
    title: "Home Appliances",
    subtitle: "Products, spare parts & accessories",
    image: "/images/accessories/home-appliances.jpg",
  },
  {
    title: "Washing Machines",
    subtitle: "Machines, hoses & spare parts",
    image: "/images/accessories/washing-machine.jpg",
  },
  {
    title: "Refrigerators & ACs",
    subtitle: "Parts, filters & accessories",
    image: "/images/accessories/refrigerator.avif",
  },
  {
    title: "RO Water Purifiers",
    subtitle: "Filters, membranes & fittings",
    image: "/images/accessories/kitchen-appliances.avif",
  },
];

const heroCarouselTwo = [
  {
    title: "Mobiles & Tablets",
    subtitle: "Screens, cases & chargers",
    image: "/images/accessories/electrical.jpg",
  },
  {
    title: "Computers & Laptops",
    subtitle: "RAM, SSDs & essentials",
    image: "/images/accessories/home-support.jpg",
  },
  {
    title: "Audio & Entertainment",
    subtitle: "Headphones, speakers & cables",
    image: "/images/accessories/tv-accessories.webp",
  },
  {
    title: "CCTV & Security",
    subtitle: "Cameras, storage & accessories",
    image: "/images/accessories/installation.webp",
  },
];

const heroCarouselThree = [
  {
    title: "Fashion & Apparel",
    subtitle: "Everyday and ethnic wear",
    image: "/images/accessories/professional-care.webp",
  },
  {
    title: "Furniture & Decor",
    subtitle: "Furniture, lighting & textiles",
    image: "/images/accessories/home-appliances.jpg",
  },
  {
    title: "Sports & Fitness",
    subtitle: "Gym gear & sports equipment",
    image: "/images/accessories/ac-accessories.jpg",
  },
  {
    title: "Products for Every Need",
    subtitle: "Explore all five categories",
    image: "/images/accessories/ac-service.avif",
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
            MARKETPLACE
          </span>

          <h1>
            Everything your home
            <span> needs.</span>
          </h1>

          <p>
            Shop appliances and spare parts, electronics, fashion,
            furniture, home decor, lighting, sports and fitness
            essentials — all in one place.
          </p>

          {/* SEARCH */}

          <div className="accessories-search">
            <Search size={20} />

            <input
              type="text"
              placeholder="Search appliances, electronics, fashion, furniture, sports..."
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

            <button type="button" onClick={handleSearch}>
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

        {/* THREE VERTICAL CAROUSELS */}

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
            <span>Explore products &amp; services</span>
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

            <h2>Find what you need</h2>

            <p>
              Explore five product categories, from appliance
              spare parts to fashion, home decor and sports equipment.
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
          <Link
            to="/accessories/all"
            className="category-card"
          >
            <div className="category-icon">✨</div>

            <div>
              <h3>All Products</h3>
              <p>Browse everything</p>
            </div>

            <ChevronRight size={18} />
          </Link>

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
                <h3>{category.title}</h3>
                <p>{category.description}</p>
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

            <h2>Popular picks across our categories</h2>

            <p>
              Explore useful products and everyday essentials
              across the OneService marketplace.
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

                <h3>{product.name}</h3>

                <div className="product-price">
                  <strong>{product.price}</strong>
                  <span>{product.oldPrice}</span>
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
          Uses the same background class as the former CTA
      ===================================================== */}

      <section className="service-product-section accessories-final-cta">
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
    </main>
  );
}

export default AccessoriesSalesPage;