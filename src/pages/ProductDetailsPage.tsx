import {
  ArrowLeft,
  ArrowRight,
  Check,
  ShoppingCart,
  Star,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";

import {
  accessoryProducts,
} from "../data/accessoriesProducts";

import "./ProductDetailsPage.css";

function ProductDetailsPage() {
  const { productId } = useParams();

  const product = accessoryProducts.find(
    (item) => item.id === Number(productId),
  );

  if (!product) {
    return (
      <main className="product-details-page">
        <section className="product-not-found">
          <h1>Product not found</h1>

          <p>
            The product you are looking for is no longer available.
          </p>

          <Link to="/accessories-sales/products">
            Browse all products
          </Link>
        </section>
      </main>
    );
  }

  const discount = Math.round(
    ((product.oldPrice - product.price) / product.oldPrice) * 100,
  );

  return (
    <main className="product-details-page">
      {/* =====================================================
          BREADCRUMB
      ===================================================== */}

      <div className="product-details-breadcrumb">
        <Link to="/accessories-sales/products">
          Accessories &amp; Sales
        </Link>

        <span>/</span>

        <Link
          to={`/accessories-sales/category/${product.categorySlug}`}
        >
          {product.category}
        </Link>

        <span>/</span>

        <strong>{product.name}</strong>
      </div>

      {/* =====================================================
          PRODUCT
      ===================================================== */}

      <section className="product-details-container">
        {/* IMAGE */}

        <div className="product-details-image">
          {product.badge && (
            <span>{product.badge}</span>
          )}

          <img
            src={product.image}
            alt={product.name}
          />
        </div>

        {/* INFORMATION */}

        <div className="product-details-info">
          <span className="product-details-category">
            {product.category}
          </span>

          <h1>{product.name}</h1>

          <div className="product-details-rating">
            <span>{product.rating.toFixed(1)}</span>

            <Star size={15} fill="currentColor" />

            <span>
              {product.reviews} customer reviews
            </span>
          </div>

          <div className="product-details-divider" />

          <div className="product-details-price">
            <strong>
              ₹{product.price.toLocaleString("en-IN")}
            </strong>

            <span>
              ₹{product.oldPrice.toLocaleString("en-IN")}
            </span>

            <em>{discount}% OFF</em>
          </div>

          <p className="product-details-description">
            {product.description}
          </p>

          <div className="product-details-stock">
            <Check size={17} />

            {product.inStock
              ? "In stock"
              : "Currently unavailable"}
          </div>

          <div className="product-details-actions">
            <button type="button">
              <ShoppingCart size={18} />
              Add to Cart
            </button>

            <button type="button">
              Buy Now
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="product-details-benefits">
            <div>
              <strong>Reliable product</strong>
              <span>Quality checked products</span>
            </div>

            <div>
              <strong>Home delivery</strong>
              <span>Convenient delivery support</span>
            </div>

            <div>
              <strong>Service support</strong>
              <span>Professional help when needed</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          BACK
      ===================================================== */}

      <Link
        to="/accessories-sales/products"
        className="product-details-back"
      >
        <ArrowLeft size={16} />
        Continue shopping
      </Link>
    </main>
  );
}

export default ProductDetailsPage;