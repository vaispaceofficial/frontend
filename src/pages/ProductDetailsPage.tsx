import { useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  WalletCards,
  RotateCcw,
  MapPin,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  accessoryProducts,
} from "../data/accessoriesProducts";

import "./ProductDetailsPage.css";


function ProductDetailsPage() {
  const { productId } = useParams();

  /* =====================================================
     FIND PRODUCT
  ===================================================== */

  const product = accessoryProducts.find(
    (item) =>
      String(item.id) === String(productId),
  );


  /* =====================================================
     STATE
  ===================================================== */

  const [selectedImage, setSelectedImage] =
    useState(0);

  const [quantity, setQuantity] =
    useState(1);

  const [showMoreDescription, setShowMoreDescription] =
    useState(false);


  /* =====================================================
     PRODUCT NOT FOUND
  ===================================================== */

  if (!product) {
    return (
      <main className="product-details-page">

        <section className="product-not-found">

          <div className="product-not-found-icon">
            🛍️
          </div>

          <h1>
            Product not found
          </h1>

          <p>
            The product you are looking for is
            no longer available.
          </p>

          <Link to="/accessories-sales/products">
            Browse all products
          </Link>

        </section>

      </main>
    );
  }


  /* =====================================================
     PRICE CALCULATION
  ===================================================== */

  const discount = Math.round(
    ((product.oldPrice - product.price) /
      product.oldPrice) *
      100,
  );


  /* =====================================================
     PRODUCT IMAGES
  ===================================================== */

  const productImages =
    product.images?.length
      ? product.images
      : [product.image];


  const currentImage =
    productImages[selectedImage] ||
    productImages[0] ||
    product.image;


  /* =====================================================
     IMAGE NAVIGATION
  ===================================================== */

  const previousImage = () => {
    setSelectedImage((current) =>
      current === 0
        ? productImages.length - 1
        : current - 1,
    );
  };


  const nextImage = () => {
    setSelectedImage((current) =>
      current === productImages.length - 1
        ? 0
        : current + 1,
    );
  };


  /* =====================================================
     QUANTITY
  ===================================================== */

  const increaseQuantity = () => {
    setQuantity((value) => value + 1);
  };


  const decreaseQuantity = () => {
    setQuantity((value) =>
      value > 1
        ? value - 1
        : 1,
    );
  };


  /* =====================================================
     RELATED PRODUCTS
  ===================================================== */

  const relatedProducts =
    accessoryProducts
      .filter(
        (item) =>
          item.id !== product.id &&
          item.categorySlug ===
            product.categorySlug,
      )
      .slice(0, 4);


  return (
    <main className="product-details-page">

      {/* =====================================================
          BREADCRUMB
      ===================================================== */}

      <div className="product-breadcrumb">

        <Link to="/">
          Home
        </Link>

        <span>/</span>

        <Link to="/accessories-sales">
          Accessories &amp; Sales
        </Link>

        <span>/</span>

        <Link to="/accessories-sales/products">
          Products
        </Link>

        <span>/</span>

        <Link
          to={`/accessories/${product.categorySlug}`}
        >
          {product.category}
        </Link>

        <span>/</span>

        <strong>
          {product.name}
        </strong>

      </div>


      {/* =====================================================
          MAIN PRODUCT AREA
      ===================================================== */}

      <section className="amazon-product-layout">


        {/* ===================================================
            PRODUCT IMAGE GALLERY
        =================================================== */}

        <div className="product-gallery">

          <div className="product-thumbnail-column">

            {productImages.map(
              (image, index) => (

                <button
                  key={`${product.id}-${index}`}
                  type="button"
                  className={
                    `product-thumbnail ${
                      selectedImage === index
                        ? "active"
                        : ""
                    }`
                  }
                  onClick={() =>
                    setSelectedImage(index)
                  }
                  aria-label={
                    `View product image ${
                      index + 1
                    }`
                  }
                >
                  {image}
                </button>

              ),
            )}

          </div>


          <div className="product-main-image">

            {/* BADGE */}

            {product.badge && (
              <span className="product-image-badge">
                {product.badge}
              </span>
            )}


            {/* PREVIOUS */}

            {productImages.length > 1 && (
              <button
                type="button"
                className={
                  "gallery-arrow gallery-arrow-left"
                }
                onClick={previousImage}
                aria-label="Previous image"
              >
                <ChevronLeft size={22} />
              </button>
            )}


            {/* IMAGE */}

            <div className="product-image-display">
              {currentImage}
            </div>


            {/* NEXT */}

            {productImages.length > 1 && (
              <button
                type="button"
                className={
                  "gallery-arrow gallery-arrow-right"
                }
                onClick={nextImage}
                aria-label="Next image"
              >
                <ChevronRight size={22} />
              </button>
            )}


            {/* IMAGE COUNT */}

            <div className="image-count">
              {selectedImage + 1}
              {" / "}
              {productImages.length}
            </div>

          </div>

        </div>


        {/* ===================================================
            PRODUCT INFORMATION
        =================================================== */}

        <div className="product-main-information">

          <span className="product-brand">
            ONESERVICE
          </span>


          <h1>
            {product.name}
          </h1>


          <p className="product-short-line">
            {product.description}
          </p>


          {/* =================================================
              RATING
          ================================================= */}

          <div className="amazon-rating-row">

            <span className="rating-number">
              {product.rating.toFixed(1)}
            </span>


            <div className="rating-stars">

              {[1, 2, 3, 4, 5].map(
                (star) => (

                  <Star
                    key={star}
                    size={16}
                    strokeWidth={1.8}
                    fill={
                      star <=
                      Math.round(
                        product.rating,
                      )
                        ? "currentColor"
                        : "none"
                    }
                  />

                ),
              )}

            </div>


            <span className="review-link">
              {product.reviews.toLocaleString(
                "en-IN",
              )}{" "}
              ratings
            </span>


            <span className="rating-divider">
              |
            </span>


            <span className="review-link">
              Customer reviews
            </span>

          </div>


          <div className="amazon-horizontal-line" />


          {/* =================================================
              PRICE
          ================================================= */}

          <div className="product-price-block">

            <div className="deal-label">
              Limited time deal
            </div>


            <div className="price-line">

              <span className="discount-percentage">
                -{discount}%
              </span>

              <span className="product-large-price">
                ₹
                {product.price.toLocaleString(
                  "en-IN",
                )}
              </span>

            </div>


            <div className="mrp-line">

              <span>
                M.R.P.:
              </span>

              <span className="old-price">
                ₹
                {product.oldPrice.toLocaleString(
                  "en-IN",
                )}
              </span>

            </div>


            <p className="tax-note">
              Inclusive of applicable taxes
            </p>

          </div>


          <div className="amazon-horizontal-line" />


          {/* =================================================
              ABOUT THIS ITEM
          ================================================= */}

          <section className="product-highlights">

            <h2>
              About this item
            </h2>


            <ul>

              {product.highlights
                .slice(
                  0,
                  showMoreDescription
                    ? product.highlights.length
                    : 5,
                )
                .map(
                  (
                    highlight,
                    index,
                  ) => (

                    <li key={index}>

                      <span>
                        •
                      </span>

                      <p>
                        {highlight}
                      </p>

                    </li>

                  ),
                )}

            </ul>


            {product.highlights.length > 5 && (

              <button
                type="button"
                className="show-more-button"
                onClick={() =>
                  setShowMoreDescription(
                    (value) => !value,
                  )
                }
              >

                {showMoreDescription
                  ? "Show less"
                  : "See more"}

                <ChevronDown
                  size={15}
                  className={
                    showMoreDescription
                      ? "rotate"
                      : ""
                  }
                />

              </button>

            )}

          </section>


          <div className="amazon-horizontal-line" />


          {/* =================================================
              CATEGORY
          ================================================= */}

          <div className="product-category-row">

            <span>
              Category
            </span>

            <Link
              to={
                `/accessories/${
                  product.categorySlug
                }`
              }
            >
              {product.category}
            </Link>

          </div>

        </div>


        {/* ===================================================
            BUY BOX
        =================================================== */}

        <aside className="amazon-buy-box">

          <div className="buy-box-price">
            ₹
            {product.price.toLocaleString(
              "en-IN",
            )}
          </div>


          <p className="buy-box-delivery">
            FREE delivery available
          </p>


          <div className="buy-box-location">

            <MapPin size={16} />

            <span>
              Deliver to your location
            </span>

          </div>


          <div className="buy-box-stock">

            <Check size={17} />

            {product.inStock
              ? "In stock"
              : "Currently unavailable"}

          </div>


          <p className="delivery-timing">
            Order now for convenient home
            delivery.
          </p>


          {/* =================================================
              QUANTITY
          ================================================= */}

          <div className="quantity-section">

            <span>
              Quantity:
            </span>


            <div className="quantity-control">

              <button
                type="button"
                onClick={
                  decreaseQuantity
                }
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>


              <span>
                {quantity}
              </span>


              <button
                type="button"
                onClick={
                  increaseQuantity
                }
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>

            </div>

          </div>


          {/* =================================================
              CART
          ================================================= */}

          <button
            type="button"
            className="buy-box-cart"
          >
            <ShoppingCart size={18} />

            <span>
              Add to Cart
            </span>
          </button>


          {/* =================================================
              BUY NOW
          ================================================= */}

          <button
            type="button"
            className="buy-box-buy"
          >
            <span>
              Buy Now
            </span>

            <ArrowRight size={17} />
          </button>


          {/* =================================================
              SECURE TRANSACTION
          ================================================= */}

          <div className="secure-payment">

            <ShieldCheck size={17} />

            <span>
              Secure transaction
            </span>

          </div>


          {/* =================================================
              BUY BOX SERVICES
          ================================================= */}

          <div className="buy-box-services">

            <div>

              <Truck size={18} />

              <span>
                Convenient delivery
              </span>

            </div>


            <div>

              <RotateCcw size={18} />

              <span>
                Service support
              </span>

            </div>


            <div>

              <WalletCards size={18} />

              <span>
                Secure payment
              </span>

            </div>

          </div>

        </aside>

      </section>


      {/* =====================================================
          SERVICE BENEFITS
      ===================================================== */}

      <section className="product-benefits-bar">


        {/* DELIVERY */}

        <div className="benefit-item">

          <span
            className="benefit-icon"
            aria-hidden="true"
          >
            <Truck
              size={21}
              strokeWidth={2}
            />
          </span>


          <div className="benefit-content">

            <strong>
              Convenient Delivery
            </strong>

            <span>
              Get your product delivered to
              your doorstep.
            </span>

          </div>

        </div>


        {/* QUALITY */}

        <div className="benefit-item">

          <span
            className="benefit-icon"
            aria-hidden="true"
          >
            <ShieldCheck
              size={21}
              strokeWidth={2}
            />
          </span>


          <div className="benefit-content">

            <strong>
              Quality Support
            </strong>

            <span>
              Product and service assistance
              when required.
            </span>

          </div>

        </div>


        {/* PAYMENT */}

        <div className="benefit-item">

          <span
            className="benefit-icon"
            aria-hidden="true"
          >
            <WalletCards
              size={21}
              strokeWidth={2}
            />
          </span>


          <div className="benefit-content">

            <strong>
              Secure Payments
            </strong>

            <span>
              Safe and convenient payment
              experience.
            </span>

          </div>

        </div>


        {/* SERVICE */}

        <div className="benefit-item">

          <span
            className="benefit-icon"
            aria-hidden="true"
          >
            <RotateCcw
              size={21}
              strokeWidth={2}
            />
          </span>


          <div className="benefit-content">

            <strong>
              Service Assistance
            </strong>

            <span>
              Professional help when needed.
            </span>

          </div>

        </div>

      </section>


      {/* =====================================================
          PRODUCT DESCRIPTION
      ===================================================== */}

      <section className="product-information-section">

        <div className="information-heading">

          <span>
            PRODUCT INFORMATION
          </span>

          <h2>
            About this product
          </h2>

        </div>


        <div className="product-description-content">

          <p>
            {product.description}
          </p>


          <p>
            This product is designed for
            convenient everyday use and is
            suitable for customers looking for
            a practical accessory for their home
            appliances or electronic equipment.
            Please check compatibility and
            specifications before purchase.
          </p>

        </div>

      </section>


      {/* =====================================================
          PRODUCT HIGHLIGHTS
      ===================================================== */}

      <section className="product-highlights-section">

        <div className="information-heading">

          <span>
            KEY FEATURES
          </span>

          <h2>
            Product highlights
          </h2>

        </div>


        <div className="large-highlights-grid">

          {product.highlights.map(
            (
              highlight,
              index,
            ) => (

              <div
                className="large-highlight"
                key={index}
              >

                <div className="highlight-check">

                  <Check
                    size={16}
                  />

                </div>


                <p>
                  {highlight}
                </p>

              </div>

            ),
          )}

        </div>

      </section>


      {/* =====================================================
          SPECIFICATIONS
      ===================================================== */}

      <section className="product-specifications-section">

        <div className="information-heading">

          <span>
            PRODUCT DETAILS
          </span>

          <h2>
            Technical specifications
          </h2>

        </div>


        <div className="specifications-table">

          {product.specifications.map(
            (
              specification,
              index,
            ) => (

              <div
                className="specification-row"
                key={index}
              >

                <div className="specification-label">
                  {specification.label}
                </div>


                <div className="specification-value">
                  {specification.value}
                </div>

              </div>

            ),
          )}

        </div>

      </section>


      {/* =====================================================
          RELATED PRODUCTS
      ===================================================== */}

      <section className="related-products-section">

        <div className="related-heading">

          <div>

            <span>
              YOU MAY ALSO LIKE
            </span>

            <h2>
              Related products
            </h2>

          </div>


          <Link to="/accessories-sales/products">

            <span>
              View all products
            </span>

            <ArrowRight size={16} />

          </Link>

        </div>


        <div className="related-products-grid">

          {relatedProducts.map(
            (relatedProduct) => (

              <Link
                key={relatedProduct.id}
                to={
                  `/accessories-sales/products/${
                    relatedProduct.id
                  }`
                }
                className="related-product-card"
              >

                <div className="related-product-image">

                  {relatedProduct.image}

                </div>


                <span>
                  {relatedProduct.category}
                </span>


                <h3>
                  {relatedProduct.name}
                </h3>


                <div className="related-rating">

                  <span>
                    {relatedProduct.rating}
                  </span>


                  <Star
                    size={13}
                    fill="currentColor"
                  />


                  <small>
                    ({relatedProduct.reviews})
                  </small>

                </div>


                <strong>
                  ₹
                  {relatedProduct.price.toLocaleString(
                    "en-IN",
                  )}
                </strong>

              </Link>

            ),
          )}

        </div>

      </section>


      {/* =====================================================
          BACK TO PRODUCTS
      ===================================================== */}

      <Link
        to="/accessories-sales/products"
        className="product-details-back"
      >

        <ArrowLeft size={16} />

        <span>
          Continue shopping
        </span>

      </Link>

    </main>
  );
}


export default ProductDetailsPage;