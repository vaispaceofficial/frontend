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

import {
  accessoryCategories,
  accessoryProducts,
} from "../data/accessoriesProducts";

import "./AccessoriesProductsPage.css";

function AccessoriesProductsPage() {
  const { categorySlug } = useParams();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";

  const [search, setSearch] = useState(searchQuery);
  const [sort, setSort] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  /*
   * ============================================================
   * ACTIVE CATEGORY
   * ============================================================
   */

  const activeCategory = categorySlug || "all";

  const activeCategoryName =
    accessoryCategories.find(
      (category) => category.slug === activeCategory,
    )?.name || "All Products";

  /*
   * ============================================================
   * FILTER + SORT PRODUCTS
   * ============================================================
   */

  const filteredProducts = useMemo(() => {
    let result = accessoryProducts.filter((product) => {
      const matchesCategory =
        activeCategory === "all" ||
        product.categorySlug === activeCategory;

      const normalizedSearch = search.trim().toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch);

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

  /*
   * ============================================================
   * PRODUCT DETAILS URL
   * ============================================================
   *
   * IMPORTANT:
   * App.tsx uses:
   *
   * /accessories-sales/products/:productId
   *
   * So every product link must use the same structure.
   */

  const getProductUrl = (productId: number) =>
    `/accessories-sales/products/${productId}`;

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <main className="accessories-products-page">

      {/* ========================================================
          TOP SEARCH AREA
      ======================================================== */}

      <section className="products-page-top">

        <div className="products-page-heading">
          <span>ACCESSORIES &amp; SALES</span>

          <h1>{activeCategoryName}</h1>

          <p>
            Explore products, accessories and everyday
            essentials from OneService.
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

      {/* ========================================================
          SHOPPING CONTENT
      ======================================================== */}

      <section className="products-marketplace">

        {/* ======================================================
            SIDEBAR
        ====================================================== */}

        <aside
          className={`products-sidebar ${
            showFilters ? "mobile-visible" : ""
          }`}
        >

          <div className="sidebar-heading">
            <strong>Categories</strong>
          </div>

          <div className="sidebar-categories">

            {accessoryCategories.map((category) => (

              <Link
                key={category.slug}
                to={`/accessories/${category.slug}`}
                className={
                  activeCategory === category.slug
                    ? "active"
                    : ""
                }
                onClick={() => setShowFilters(false)}
              >
                {category.name}
              </Link>

            ))}

          </div>

          <div className="sidebar-divider" />

          {/* DELIVERY */}

          <div className="sidebar-filter-section">

            <strong>Delivery</strong>

            <label>
              <input type="checkbox" />
              <span>Fast delivery</span>
            </label>

            <label>
              <input type="checkbox" />
              <span>Installation available</span>
            </label>

          </div>

          {/* CUSTOMER RATING */}

          <div className="sidebar-filter-section">

            <strong>Customer rating</strong>

            {[4, 3, 2].map((rating) => (

              <label key={rating}>

                <input type="checkbox" />

                <span className="rating-option">

                  <Star
                    size={13}
                    fill="currentColor"
                  />

                  {rating}&amp; above

                </span>

              </label>

            ))}

          </div>

        </aside>

        {/* ======================================================
            PRODUCTS AREA
        ====================================================== */}

        <div className="products-results">

          {/* TOOLBAR */}

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

              <span>products</span>

            </div>

            <div className="sort-control">

              <span>Sort by</span>

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

          {/* ====================================================
              PRODUCT GRID
          ==================================================== */}

          {filteredProducts.length > 0 ? (

            <div className="marketplace-product-grid">

              {filteredProducts.map((product) => {

                const discount = Math.round(
                  ((product.oldPrice - product.price) /
                    product.oldPrice) *
                    100,
                );

                const productUrl =
                  getProductUrl(product.id);

                return (
                  <article
                    className="marketplace-product-card"
                    key={product.id}
                  >

                    {/* PRODUCT IMAGE */}

                    <Link
                      to={productUrl}
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

                    {/* PRODUCT CONTENT */}

                    <div className="marketplace-product-content">

                      <span className="marketplace-category">
                        {product.category}
                      </span>

                      {/* PRODUCT TITLE */}

                      <Link to={productUrl}>

                        <h2>
                          {product.name}
                        </h2>

                      </Link>

                      {/* RATING */}

                      <div className="product-rating">

                        <span>
                          {product.rating.toFixed(1)}
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
                          ₹
                          {product.price.toLocaleString(
                            "en-IN",
                          )}
                        </strong>

                        <span>
                          ₹
                          {product.oldPrice.toLocaleString(
                            "en-IN",
                          )}
                        </span>

                        <em>
                          {discount}% off
                        </em>

                      </div>

                      {/* DELIVERY */}

                      <p className="delivery-text">
                        FREE delivery available
                      </p>

                      {/* ACTIONS */}

                      <div className="marketplace-actions">

                        <button
                          type="button"
                          className="add-cart-button"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();

                            console.log(
                              "Add to cart:",
                              product,
                            );
                          }}
                        >
                          <ShoppingCart size={16} />
                          Add to cart
                        </button>

                        <Link
                          to={productUrl}
                          className="details-button"
                          aria-label={`View ${product.name}`}
                        >
                          <ArrowRight size={16} />
                        </Link>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>

          ) : (

            /* ==================================================
               EMPTY STATE
            ================================================== */

<div className="products-empty">

  <div className="products-empty-icon">
    ✨
  </div>

  <span className="coming-soon-label">
    COMING SOON
  </span>

  <h2>
    More Products Are Yet to Come!!
  </h2>

  <p>
    We're working on adding more products to this
    category. Please check back soon.
  </p>

  <Link
    to="/accessories/all"
    className="coming-soon-button"
  >
    Browse Available Products
  </Link>

</div>

          )}

        </div>

      </section>

    </main>
  );
}

export default AccessoriesProductsPage;