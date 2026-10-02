import { useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  ChevronDown,
  SlidersHorizontal,
  Star,
  ArrowRight,
} from "lucide-react";

import "./AccessoriesProductsPage.css";

const categories = [
  {
    name: "All Products",
    slug: "all",
  },
  {
    name: "AC Accessories",
    slug: "ac-accessories",
  },
  {
    name: "Washing Machine Accessories",
    slug: "washing-machine-accessories",
  },
  {
    name: "Refrigerator Accessories",
    slug: "refrigerator-accessories",
  },
  {
    name: "TV Accessories",
    slug: "tv-accessories",
  },
  {
    name: "Kitchen Appliances",
    slug: "kitchen-appliances",
  },
  {
    name: "Electrical Accessories",
    slug: "electrical-accessories",
  },
  {
    name: "Other Accessories",
    slug: "other-accessories",
  },
];

const products = [
  {
    id: 1,
    name: "Universal AC Remote",
    category: "AC Accessories",
    categorySlug: "ac-accessories",
    price: 499,
    oldPrice: 699,
    image: "📱",
    rating: 4.4,
    reviews: 128,
    badge: "Popular",
  },
  {
    id: 2,
    name: "AC Dust Filter",
    category: "AC Accessories",
    categorySlug: "ac-accessories",
    price: 349,
    oldPrice: 499,
    image: "❄️",
    rating: 4.2,
    reviews: 84,
    badge: "New",
  },
  {
    id: 3,
    name: "Washing Machine Cover",
    category: "Washing Machine Accessories",
    categorySlug: "washing-machine-accessories",
    price: 599,
    oldPrice: 799,
    image: "🫧",
    rating: 4.5,
    reviews: 96,
    badge: "Popular",
  },
  {
    id: 4,
    name: "Universal TV Remote",
    category: "TV Accessories",
    categorySlug: "tv-accessories",
    price: 299,
    oldPrice: 399,
    image: "📺",
    rating: 4.1,
    reviews: 62,
    badge: "",
  },
  {
    id: 5,
    name: "Refrigerator Mat",
    category: "Refrigerator Accessories",
    categorySlug: "refrigerator-accessories",
    price: 399,
    oldPrice: 549,
    image: "🧊",
    rating: 4.3,
    reviews: 71,
    badge: "New",
  },
  {
    id: 6,
    name: "HDMI Cable",
    category: "Electrical Accessories",
    categorySlug: "electrical-accessories",
    price: 449,
    oldPrice: 599,
    image: "🔌",
    rating: 4.6,
    reviews: 143,
    badge: "",
  },
  {
    id: 7,
    name: "AC Installation Stand",
    category: "AC Accessories",
    categorySlug: "ac-accessories",
    price: 899,
    oldPrice: 1199,
    image: "🛠️",
    rating: 4.5,
    reviews: 54,
    badge: "Popular",
  },
  {
    id: 8,
    name: "Washing Machine Inlet Hose",
    category: "Washing Machine Accessories",
    categorySlug: "washing-machine-accessories",
    price: 299,
    oldPrice: 449,
    image: "〰️",
    rating: 4.2,
    reviews: 39,
    badge: "",
  },
];

function AccessoriesProductsPage() {
  const { categorySlug } = useParams();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";

  const [search, setSearch] = useState(searchQuery);
  const [sort, setSort] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  const activeCategory =
    categorySlug || "all";

  const activeCategoryName =
    categories.find(
      (category) => category.slug === activeCategory,
    )?.name || "All Products";

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        activeCategory === "all" ||
        product.categorySlug === activeCategory;

      const matchesSearch =
        !search.trim() ||
        product.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        product.category
          .toLowerCase()
          .includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    if (sort === "price-low") {
      result = [...result].sort(
        (a, b) => a.price - b.price,
      );
    }

    if (sort === "price-high") {
      result = [...result].sort(
        (a, b) => b.price - a.price,
      );
    }

    if (sort === "rating") {
      result = [...result].sort(
        (a, b) => b.rating - a.rating,
      );
    }

    return result;
  }, [activeCategory, search, sort]);

  return (
    <main className="accessories-products-page">

      {/* =====================================================
          TOP SEARCH AREA
      ===================================================== */}

      <section className="products-page-top">

        <div className="products-page-heading">

          <span>
            ACCESSORIES &amp; SALES
          </span>

          <h1>
            {activeCategoryName}
          </h1>

          <p>
            Explore products, accessories and everyday essentials
            from OneService.
          </p>

        </div>

        <div className="products-page-search">

          <Search size={19} />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
            >
              Clear
            </button>
          )}

        </div>

      </section>

      {/* =====================================================
          SHOPPING CONTENT
      ===================================================== */}

      <section className="products-marketplace">

        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <aside
          className={`products-sidebar ${
            showFilters ? "mobile-visible" : ""
          }`}
        >

          <div className="sidebar-heading">
            <strong>Categories</strong>
          </div>

          <div className="sidebar-categories">

            {categories.map((category) => (

              <Link
                key={category.slug}
                to={`/accessories/${category.slug}`}
                className={
                  activeCategory === category.slug
                    ? "active"
                    : ""
                }
              >
                {category.name}
              </Link>

            ))}

          </div>

          <div className="sidebar-divider" />

          <div className="sidebar-filter-section">

            <strong>
              Delivery
            </strong>

            <label>
              <input type="checkbox" />
              Fast delivery
            </label>

            <label>
              <input type="checkbox" />
              Installation available
            </label>

          </div>

          <div className="sidebar-filter-section">

            <strong>
              Customer rating
            </strong>

            {[4, 3, 2].map((rating) => (

              <label key={rating}>

                <input type="checkbox" />

                <span className="rating-option">
                  <Star size={13} fill="currentColor" />
                  {rating}&amp; above
                </span>

              </label>

            ))}

          </div>

        </aside>

        {/* ===================================================
            PRODUCTS AREA
        =================================================== */}

        <div className="products-results">

          <div className="products-results-toolbar">

            <button
              type="button"
              className="mobile-filter-button"
              onClick={() =>
                setShowFilters((value) => !value)
              }
            >
              <SlidersHorizontal size={17} />
              Filters
            </button>

            <div className="results-count">

              <strong>
                {filteredProducts.length}
              </strong>

              <span>
                products
              </span>

            </div>

            <div className="sort-control">

              <span>
                Sort by
              </span>

              <div className="sort-select">

                <select
                  value={sort}
                  onChange={(event) =>
                    setSort(event.target.value)
                  }
                >
                  <option value="featured">
                    Featured
                  </option>

                  <option value="price-low">
                    Price: Low to High
                  </option>

                  <option value="price-high">
                    Price: High to Low
                  </option>

                  <option value="rating">
                    Customer Rating
                  </option>
                </select>

                <ChevronDown size={15} />

              </div>

            </div>

          </div>

          {/* PRODUCT GRID */}

          {filteredProducts.length > 0 ? (

            <div className="marketplace-product-grid">

              {filteredProducts.map((product) => (

                <article
                  className="marketplace-product-card"
                  key={product.id}
                >

                  <Link
                    to={`/product/${product.id}`}
                    className="marketplace-product-image"
                  >

                    {product.badge && (
                      <span className="marketplace-badge">
                        {product.badge}
                      </span>
                    )}

                    <div>
                      {product.image}
                    </div>

                  </Link>

                  <div className="marketplace-product-content">

                    <span className="marketplace-category">
                      {product.category}
                    </span>

                    <Link
                      to={`/product/${product.id}`}
                    >
                      <h2>
                        {product.name}
                      </h2>
                    </Link>

                    {/* RATING */}

                    <div className="product-rating">

                      <span>
                        {product.rating}
                      </span>

                      <Star
                        size={13}
                        fill="currentColor"
                      />

                      <span>
                        ({product.reviews})
                      </span>

                    </div>

                    {/* PRICE */}

                    <div className="marketplace-price">

                      <strong>
                        ₹{product.price.toLocaleString("en-IN")}
                      </strong>

                      <span>
                        ₹{product.oldPrice.toLocaleString("en-IN")}
                      </span>

                      <em>
                        {Math.round(
                          ((product.oldPrice - product.price) /
                            product.oldPrice) *
                            100,
                        )}
                        % off
                      </em>

                    </div>

                    <p className="delivery-text">
                      FREE delivery available
                    </p>

                    <div className="marketplace-actions">

                      <button
                        type="button"
                        className="add-cart-button"
                      >
                        <ShoppingCart size={16} />
                        Add to cart
                      </button>

                      <Link
                        to={`/product/${product.id}`}
                        className="details-button"
                      >
                        <ArrowRight size={16} />
                      </Link>

                    </div>

                  </div>

                </article>

              ))}

            </div>

          ) : (

            <div className="products-empty">

              <div>
                🔎
              </div>

              <h2>
                No products found
              </h2>

              <p>
                Try another search or browse a different category.
              </p>

              <Link to="/accessories/all">
                View all products
              </Link>

            </div>

          )}

        </div>

      </section>

    </main>
  );
}

export default AccessoriesProductsPage;