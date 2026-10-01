
import { useState } from "react";
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

const categories = [
  {
    title: "AC Accessories",
    description: "Filters, remotes, stands and more",
    icon: "❄️",
  },
  {
    title: "Refrigerator",
    description: "Parts and useful accessories",
    icon: "🧊",
  },
  {
    title: "Washing Machine",
    description: "Hoses, covers and accessories",
    icon: "🫧",
  },
  {
    title: "TV Accessories",
    description: "Remotes, mounts and cables",
    icon: "📺",
  },
  {
    title: "Kitchen Appliances",
    description: "Useful appliances for your kitchen",
    icon: "🍳",
  },
  {
    title: "Electrical",
    description: "Cables, switches and essentials",
    icon: "⚡",
  },
];

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
    category: "Washing Machine",
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
    category: "Refrigerator",
    price: "₹399",
    oldPrice: "₹549",
    image: "🧊",
    badge: "New",
  },
  {
    id: 6,
    name: "HDMI Cable",
    category: "Electrical",
    price: "₹449",
    oldPrice: "₹599",
    image: "🔌",
    badge: "",
  },
];

function AccessoriesSalesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="accessories-sales-page">
      {/* HERO */}
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

          <div className="accessories-search">
            <Search size={20} />

            <input
              type="text"
              placeholder="Search for accessories or products..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            <button type="button">
              Search
            </button>
          </div>

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

        <div className="accessories-hero-card">
          <div className="hero-card-circle hero-card-circle-one" />
          <div className="hero-card-circle hero-card-circle-two" />

          <div className="hero-product-icon">🏠</div>

          <span>ONE SERVICE</span>

          <strong>
            Products +
            <br />
            Service Support
          </strong>

          <p>
            Buy what you need and get professional help when you need it.
          </p>

          <div className="hero-card-bottom">
            <span>Explore products</span>
            <ArrowRight size={18} />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="accessories-section">
        <div className="accessories-section-heading">
          <div>
            <span className="section-label">SHOP BY CATEGORY</span>

            <h2>Find what you need</h2>

            <p>
              Browse accessories and products by category.
            </p>
          </div>

          <button
            type="button"
            className="view-all-button"
            onClick={() => setSelectedCategory("All")}
          >
            View all
            <ArrowRight size={17} />
          </button>
        </div>

        <div className="category-grid">
          <button
            type="button"
            className={`category-card ${
              selectedCategory === "All" ? "active" : ""
            }`}
            onClick={() => setSelectedCategory("All")}
          >
            <div className="category-icon">✨</div>

            <div>
              <h3>All Products</h3>
              <p>Browse everything</p>
            </div>

            <ChevronRight size={18} />
          </button>

          {categories.map((category) => (
            <button
              type="button"
              key={category.title}
              className={`category-card ${
                selectedCategory === category.title ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category.title)}
            >
              <div className="category-icon">{category.icon}</div>

              <div>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
              </div>

              <ChevronRight size={18} />
            </button>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="accessories-section products-section">
        <div className="accessories-section-heading">
          <div>
            <span className="section-label">FEATURED PRODUCTS</span>

            <h2>
              {selectedCategory === "All"
                ? "Popular picks for your home"
                : selectedCategory}
            </h2>

            <p>
              Quality products selected for everyday home needs.
            </p>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image">
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
                  >
                    <ShoppingCart size={18} />
                  </button>
                </div>

                <div className="product-info">
                  <span className="product-category">
                    {product.category}
                  </span>

                  <h3>{product.name}</h3>

                  <div className="product-price">
                    <strong>{product.price}</strong>
                    <span>{product.oldPrice}</span>
                  </div>

                  <button type="button" className="product-view-button">
                    View details
                    <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="no-products">
            <div>🔎</div>
            <h3>No products found</h3>
            <p>Try another search or category.</p>

            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* SERVICE + PRODUCT */}
      <section className="service-product-section">
        <div className="service-product-content">
          <span className="section-label">MORE THAN JUST PRODUCTS</span>

          <h2>
            Need help after
            <span> buying?</span>
          </h2>

          <p>
            OneService connects products with professional service.
            If your product needs installation, maintenance or support,
            we can help with that too.
          </p>

          <button type="button" className="service-product-button">
            Explore our services
            <ArrowRight size={18} />
          </button>
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

      {/* FINAL CTA */}
      <section className="accessories-final-cta">
        <div>
          <span className="section-label">ONE SERVICE</span>

          <h2>
            Your home.
            <br />
            Taken care of.
          </h2>

          <p>
            From products to professional services, OneService
            keeps everything simple.
          </p>
        </div>

        <button type="button">
          Explore services
          <ArrowRight size={18} />
        </button>
      </section>
    </main>
  );
}

export default AccessoriesSalesPage;

