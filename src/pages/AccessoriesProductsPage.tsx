
import { useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  ChevronDown,
  SlidersHorizontal,
  Star,
  ArrowRight,
  ChevronRight,
  PackageSearch,
} from "lucide-react";

import {
  accessoryCategories,
  accessoryProducts,
} from "../data/accessoriesProducts";

import type { AccessoryProduct } from "../data/accessoriesProducts";

import "./AccessoriesProductsPage.css";

function AccessoriesProductsPage() {
  const { categorySlug, subcategorySlug } = useParams<{
    categorySlug?: string;
    subcategorySlug?: string;
  }>();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [search, setSearch] = useState(
    queryParams.get("search") || "",
  );
  const [sort, setSort] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [fastDelivery, setFastDelivery] = useState(false);
  const [installationAvailable, setInstallationAvailable] =
    useState(false);
  const [minimumRating, setMinimumRating] = useState(0);

  const activeCategory = categorySlug || "all";

  const activeCategoryData = accessoryCategories.find(
    (category) => category.slug === activeCategory,
  );

  const activeSubcategory = activeCategoryData?.subcategories.find(
    (subcategory) => subcategory.slug === subcategorySlug,
  );

  const activeCategoryName =
    activeCategory === "all"
      ? "All Products"
      : activeCategoryData?.name || "Products";

  const getProductUrl = (productId: number) =>
    `/accessories-sales/products/${productId}`;

  const categoryUrl = (slug: string) =>
    slug === "all" ? "/accessories/all" : `/accessories/${slug}`;

  const subcategoryUrl = (
    category: string,
    subcategory: string,
  ) => `/accessories/${category}/${subcategory}`;

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    let result: AccessoryProduct[] = accessoryProducts.filter(
      (product) => {
        const matchesCategory =
          activeCategory === "all" ||
          product.categorySlug === activeCategory;

        const matchesSubcategory =
          !subcategorySlug ||
          product.subcategorySlug === subcategorySlug;

        const matchesSearch =
          !normalizedSearch ||
          product.name.toLowerCase().includes(normalizedSearch) ||
          product.category.toLowerCase().includes(normalizedSearch) ||
          (product.subcategorySlug || "")
            .toLowerCase()
            .includes(normalizedSearch) ||
          product.description.toLowerCase().includes(normalizedSearch);

        const matchesDelivery =
          (!fastDelivery || product.fastDelivery === true) &&
          (!installationAvailable ||
            product.installationAvailable === true);

        const matchesRating =
          minimumRating === 0 ||
          product.rating >= minimumRating;

        return (
          matchesCategory &&
          matchesSubcategory &&
          matchesSearch &&
          matchesDelivery &&
          matchesRating
        );
      },
    );

    switch (sort) {
      case "price-low":
        result = [...result].sort((a, b) => a.price - b.price);
        break;

      case "price-high":
        result = [...result].sort((a, b) => b.price - a.price);
        break;

      case "rating":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;

      default:
        break;
    }

    return result;
  }, [
    activeCategory,
    subcategorySlug,
    search,
    sort,
    fastDelivery,
    installationAvailable,
    minimumRating,
  ]);

  // Show the first three products in the main grid.
  const mainProducts = filteredProducts.slice(0, 3);

  // Show every remaining product in the suggestions section.
  // This ensures no matching products are accidentally hidden.
  const suggestedProducts = filteredProducts.slice(3);

  const clearFilters = () => {
    setSearch("");
    setFastDelivery(false);
    setInstallationAvailable(false);
    setMinimumRating(0);
    setSort("featured");
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    fastDelivery ||
    installationAvailable ||
    minimumRating > 0;

  return (
    <main className="accessories-products-page">
      <section className="products-page-top">
        <div className="products-page-heading">
          <span>MARKETPLACE</span>

          <h1>
            {activeSubcategory?.name || activeCategoryName}
          </h1>

          <p>
            Explore products, spare parts and accessories from
            NeedOneService.
          </p>
        </div>

        <div className="products-page-search">
          <Search size={19} aria-hidden="true" />

          <input
            type="search"
            placeholder="Search products, spare parts..."
            aria-label="Search products"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              Clear
            </button>
          )}
        </div>
      </section>

      <section className="products-marketplace">
        <aside
          className={`products-sidebar ${
            showFilters ? "mobile-visible" : ""
          }`}
        >
          <div className="sidebar-heading">
            <strong>Categories</strong>
            <Link to="/accessories/all">View all</Link>
          </div>

          <div className="sidebar-categories">
            <Link
              to="/accessories/all"
              className={activeCategory === "all" ? "active" : ""}
              onClick={() => setShowFilters(false)}
            >
              All Products
            </Link>

            {accessoryCategories.map((category) => {
              const isActive = activeCategory === category.slug;

              return (
                <div
                  className="sidebar-category-group"
                  key={category.slug}
                >
                  <Link
                    to={categoryUrl(category.slug)}
                    className={isActive ? "active" : ""}
                    onClick={() => setShowFilters(false)}
                  >
                    <span>{category.name}</span>
                    <ChevronRight size={15} />
                  </Link>

                  {isActive && (
                    <div className="sidebar-subcategories">
                      {category.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.slug}
                          to={subcategoryUrl(
                            category.slug,
                            subcategory.slug,
                          )}
                          className={
                            subcategorySlug === subcategory.slug
                              ? "active"
                              : ""
                          }
                          onClick={() => setShowFilters(false)}
                        >
                          {subcategory.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="sidebar-divider" />

          <div className="sidebar-filter-section">
            <strong>Delivery &amp; service</strong>

            <label>
              <input
                type="checkbox"
                checked={fastDelivery}
                onChange={(event) =>
                  setFastDelivery(event.target.checked)
                }
              />
              <span>Fast delivery</span>
            </label>

            <label>
              <input
                type="checkbox"
                checked={installationAvailable}
                onChange={(event) =>
                  setInstallationAvailable(event.target.checked)
                }
              />
              <span>Installation available</span>
            </label>
          </div>

          <div className="sidebar-filter-section">
            <strong>Customer rating</strong>

            {[4, 3, 2].map((rating) => (
              <label key={rating}>
                <input
                  type="radio"
                  name="minimum-rating"
                  checked={minimumRating === rating}
                  onChange={() => setMinimumRating(rating)}
                />

                <span className="rating-option">
                  <Star size={13} fill="currentColor" />
                  {rating} &amp; above
                </span>
              </label>
            ))}

            {minimumRating > 0 && (
              <button
                type="button"
                className="clear-rating"
                onClick={() => setMinimumRating(0)}
              >
                Clear rating
              </button>
            )}
          </div>

          <button
            type="button"
            className="clear-filters-button"
            onClick={clearFilters}
          >
            Clear all filters
          </button>
        </aside>

        <div className="products-results">
          <nav
            className="products-breadcrumb"
            aria-label="Breadcrumb"
          >
            <Link to="/accessories-sales">
              Accessories &amp; Sales
            </Link>

            <ChevronRight size={14} />

            <Link to="/accessories/all">All Products</Link>

            {activeCategoryData && (
              <>
                <ChevronRight size={14} />

                <Link to={categoryUrl(activeCategory)}>
                  {activeCategoryData.name}
                </Link>
              </>
            )}

            {activeSubcategory && (
              <>
                <ChevronRight size={14} />
                <span>{activeSubcategory.name}</span>
              </>
            )}
          </nav>

          <div className="products-results-toolbar">
            <button
              type="button"
              className="mobile-filter-button"
              onClick={() => setShowFilters((value) => !value)}
              aria-expanded={showFilters}
            >
              <SlidersHorizontal size={17} />
              Filters
            </button>

            <div className="results-count">
              <strong>{filteredProducts.length}</strong>
              <span>
                {filteredProducts.length === 1
                  ? "product"
                  : "products"}
              </span>
            </div>

            <div className="sort-control">
              <span>Sort by</span>

              <div className="sort-select">
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  aria-label="Sort products"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">
                    Price: Low to High
                  </option>
                  <option value="price-high">
                    Price: High to Low
                  </option>
                  <option value="rating">Customer Rating</option>
                </select>

                <ChevronDown size={15} aria-hidden="true" />
              </div>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="products-suggestions-layout">
              <section className="main-products-section">
                <div className="main-products-grid">
                  {mainProducts.map((product) => {
                    const discount =
                      product.oldPrice > product.price &&
                      product.oldPrice > 0
                        ? Math.round(
                            ((product.oldPrice - product.price) /
                              product.oldPrice) *
                              100,
                          )
                        : 0;

                    const productUrl = getProductUrl(product.id);

                    return (
                      <article
                        className="marketplace-product-card"
                        key={product.id}
                      >
                        <Link
                          to={productUrl}
                          className="marketplace-product-image"
                          aria-label={`View ${product.name}`}
                        >
                          {product.badge && (
                            <span className="marketplace-badge">
                              {product.badge}
                            </span>
                          )}

                          <div>{product.image}</div>
                        </Link>

                        <div className="marketplace-product-content">
                          <span className="marketplace-category">
                            {product.category}
                          </span>

                          <Link to={productUrl}>
                            <h2>{product.name}</h2>
                          </Link>

                          <div className="product-rating">
                            <span>{product.rating.toFixed(1)}</span>
                            <Star
                              size={13}
                              fill="currentColor"
                              aria-hidden="true"
                            />
                            <span>({product.reviews})</span>
                          </div>

                          <div className="marketplace-price">
                            <strong>
                              ₹{product.price.toLocaleString("en-IN")}
                            </strong>

                            {discount > 0 && (
                              <>
                                <span>
                                  ₹
                                  {product.oldPrice.toLocaleString(
                                    "en-IN",
                                  )}
                                </span>
                                <em>{discount}% off</em>
                              </>
                            )}
                          </div>

                          <p className="delivery-text">
                            {product.fastDelivery
                              ? "Fast delivery available"
                              : "Delivery details at checkout"}
                          </p>

                          <div className="marketplace-actions">
                            <button
                              type="button"
                              className="add-cart-button"
                              onClick={() => {
                                // Connect this button to your cart state/API.
                                console.log("Add to cart:", product);
                              }}
                            >
                              <ShoppingCart size={15} />
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
              </section>

              {suggestedProducts.length > 0 && (
                <aside className="suggested-products">
                  <div className="suggested-products-heading">
                    <div>
                      <span>DISCOVER MORE</span>
                      <h2>Suggested Products</h2>
                    </div>

                    <PackageSearch size={21} />
                  </div>

                  <div className="suggested-products-grid">
                    {suggestedProducts.map((product) => (
                      <Link
                        to={getProductUrl(product.id)}
                        className="suggested-product-card"
                        key={product.id}
                      >
                        <div className="suggested-product-image">
                          {product.image}
                        </div>

                        <div className="suggested-product-info">
                          <span>{product.category}</span>
                          <h3>{product.name}</h3>

                          <div className="suggested-rating">
                            <Star
                              size={12}
                              fill="currentColor"
                              aria-hidden="true"
                            />
                            {product.rating.toFixed(1)}
                          </div>

                          <strong>
                            ₹{product.price.toLocaleString("en-IN")}
                          </strong>
                        </div>

                        <ArrowRight
                          className="suggested-arrow"
                          size={15}
                        />
                      </Link>
                    ))}
                  </div>
                </aside>
              )}
            </div>
          ) : (
            <div className="products-empty">
              <div className="products-empty-icon">✨</div>

              <span className="coming-soon-label">
                {hasActiveFilters
                  ? "NO MATCHES FOUND"
                  : "COMING SOON"}
              </span>

              <h2>
                {hasActiveFilters
                  ? "No matching products found"
                  : "More Products Are Yet to Come!"}
              </h2>

              <p>
                {hasActiveFilters
                  ? "Try a different search or adjust your filters."
                  : "We're working on adding products to this category. Please check back soon."}
              </p>

              <button
                type="button"
                className="coming-soon-button"
                onClick={clearFilters}
              >
                Clear filters
              </button>

              <Link
                to="/accessories/all"
                className="browse-products-link"
              >
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default AccessoriesProductsPage;

