
import { useEffect, useState, type MouseEvent, type FormEvent } from "react";
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
import { Link, useParams } from "react-router-dom";
import { accessoryProducts } from "../data/accessoriesProducts";
import "./ProductDetailsPage.css";

type CustomerReview = {
  id: number;
  name: string;
  title: string;
  comment: string;
  rating: number;
  date: string;
};

function ProductDetailsPage() {
  const { productId } = useParams();

  const product = accessoryProducts.find(
    (item) => String(item.id) === String(productId)
  );

  /* PRODUCT GALLERY STATE */
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [quantity, setQuantity] = useState(1);
  const [showMoreDescription, setShowMoreDescription] = useState(false);

  /* CUSTOMER REVIEW STATE */
  const [customerReviews, setCustomerReviews] = useState<CustomerReview[]>([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewMessage, setReviewMessage] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);

  /* PRODUCT IMAGES */
  const productImages = product
    ? (product.images?.length ? product.images : [product.image]).filter(
        (image): image is string =>
          typeof image === "string" && image.trim() !== ""
      )
    : [];

  const currentImage =
    productImages[selectedImage] || productImages[0] || "";

  /* AUTOMATIC IMAGE SLIDESHOW */
  useEffect(() => {
    if (productImages.length <= 1) return;

    const interval = window.setInterval(() => {
      setSelectedImage(
        (previous) => (previous + 1) % productImages.length
      );
    }, 4000);

    return () => window.clearInterval(interval);
  }, [productImages.length]);

  /* IMAGE NAVIGATION */
  const previousImage = () => {
    if (productImages.length <= 1) return;

    setSelectedImage(
      (previous) =>
        (previous - 1 + productImages.length) % productImages.length
    );
  };

  const nextImage = () => {
    if (productImages.length <= 1) return;

    setSelectedImage(
      (previous) => (previous + 1) % productImages.length
    );
  };

  /* IMAGE ZOOM */
  const handleZoomMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    setZoomPosition({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  /* QUANTITY */
  const increaseQuantity = () => {
    setQuantity((value) => value + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((value) => (value > 1 ? value - 1 : 1));
  };

  /* OPEN REVIEW POPUP */
  const openReviewModal = () => {
    setReviewMessage("");
    setShowReviewModal(true);
  };

  /* CLOSE REVIEW POPUP */
  const closeReviewModal = () => {
    setShowReviewModal(false);
    setReviewMessage("");
  };

  /* CUSTOMER REVIEW SUBMISSION */
  const handleReviewSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = reviewName.trim();
    const title = reviewTitle.trim();
    const comment = reviewComment.trim();

    if (!name || !title || !comment) {
      setReviewMessage("Please complete all review fields.");
      return;
    }

    const newReview: CustomerReview = {
      id: Date.now(),
      name,
      title,
      comment,
      rating: reviewRating,
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    setCustomerReviews((previous) => [newReview, ...previous]);

    setReviewName("");
    setReviewTitle("");
    setReviewComment("");
    setReviewRating(5);
    setReviewMessage("");
    setShowReviewModal(false);
  };

  /* CLOSE POPUP WITH ESCAPE */
  useEffect(() => {
    if (!showReviewModal) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeReviewModal();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showReviewModal]);

  /* PRODUCT NOT FOUND */
  if (!product) {
    return (
      <main className="product-details-page">
        <section className="product-not-found">
          <h1>Product not found</h1>
          <p>The product you are looking for is not available.</p>
          <Link to="/accessories-sales/products">
            Browse all products
          </Link>
        </section>
      </main>
    );
  }

  /* PRICE AND RELATED PRODUCTS */
  const discount =
    product.oldPrice > 0
      ? Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100
        )
      : 0;

  const relatedProducts = accessoryProducts
    .filter(
      (item) =>
        item.id !== product.id &&
        item.categorySlug === product.categorySlug
    )
    .slice(0, 4);

  return (
    <main className="product-details-page">
      {/* BREADCRUMB */}
      <div className="product-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/accessories-sales">Accessories &amp; Sales</Link>
        <span>/</span>
        <Link to="/accessories-sales/products">Products</Link>
        <span>/</span>
        <Link to={`/accessories/${product.categorySlug}`}>
          {product.category}
        </Link>
        <span>/</span>
        <strong>{product.name}</strong>
      </div>

      {/* MAIN PRODUCT LAYOUT */}
      <section className="amazon-product-layout">
        {/* IMAGE GALLERY */}
        <div className="product-gallery">
          <div className="product-thumbnail-column">
            {productImages.map((image, index) => (
              <button
                key={`${product.id}-${index}`}
                type="button"
                className={`product-thumbnail ${
                  selectedImage === index ? "active" : ""
                }`}
                onClick={() => setSelectedImage(index)}
                aria-label={`View product image ${index + 1}`}
              >
                <img src={image} alt="" />
              </button>
            ))}
          </div>

          <div className="product-main-image">
            {product.badge && (
              <span className="product-image-badge">
                {product.badge}
              </span>
            )}

            {productImages.length > 1 && (
              <button
                type="button"
                className="gallery-arrow gallery-arrow-left"
                onClick={previousImage}
                aria-label="Previous image"
              >
                <ChevronLeft size={22} />
              </button>
            )}

            <div
              className="product-image-display"
              onMouseMove={handleZoomMove}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
            >
              {currentImage && (
                <img
                  key={currentImage}
                  src={currentImage}
                  alt={product.name}
                  className="product-zoom-image"
                />
              )}

              {currentImage && (
                <div
                  className={`product-zoom-preview ${
                    isZoomed ? "visible" : ""
                  }`}
                  style={{
                    backgroundImage: `url("${currentImage}")`,
                    backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }}
                  aria-hidden="true"
                />
              )}
            </div>

            {productImages.length > 1 && (
              <button
                type="button"
                className="gallery-arrow gallery-arrow-right"
                onClick={nextImage}
                aria-label="Next image"
              >
                <ChevronRight size={22} />
              </button>
            )}

            <div className="image-count">
              {productImages.length ? selectedImage + 1 : 0}
              {" / "}
              {productImages.length}
            </div>
          </div>
        </div>

        {/* PRODUCT INFORMATION */}
        <div className="product-main-information">
          <span className="product-brand">NEEDONESERVICE</span>

          <h1>{product.name}</h1>

          <p className="product-short-line">{product.description}</p>

          {/* PRODUCT RATING */}
          <div className="amazon-rating-row">
            <span className="rating-number">
              {product.rating.toFixed(1)}
            </span>

            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  strokeWidth={1.8}
                  fill={
                    star <= Math.round(product.rating)
                      ? "currentColor"
                      : "none"
                  }
                />
              ))}
            </div>

            <a
              href="#customer-reviews"
              className="review-link customer-reviews-link"
            >
              {product.reviews.toLocaleString("en-IN")} ratings
            </a>

            <span className="rating-divider">|</span>

            <a
              href="#customer-reviews"
              className="review-link customer-reviews-link"
            >
              Customer reviews
            </a>
          </div>

          <div className="amazon-horizontal-line" />

          {/* PRICE */}
          <div className="product-price-block">
            <div className="deal-label">Limited time deal</div>

            <div className="price-line">
              <span className="discount-percentage">
                -{discount}%
              </span>

              <span className="product-large-price">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="mrp-line">
              <span>M.R.P.:</span>
              <span className="old-price">
                ₹{product.oldPrice.toLocaleString("en-IN")}
              </span>
            </div>

            <p className="tax-note">Inclusive of applicable taxes</p>
          </div>

          <div className="amazon-horizontal-line" />

          {/* ABOUT THIS ITEM */}
          <section className="product-highlights">
            <h2>About this item</h2>

            <ul>
              {product.highlights
                .slice(
                  0,
                  showMoreDescription
                    ? product.highlights.length
                    : 5
                )
                .map((highlight, index) => (
                  <li key={index}>
                    <span>•</span>
                    <p>{highlight}</p>
                  </li>
                ))}
            </ul>

            {product.highlights.length > 5 && (
              <button
                type="button"
                className="show-more-button"
                onClick={() =>
                  setShowMoreDescription((value) => !value)
                }
              >
                {showMoreDescription ? "Show less" : "See more"}
                <ChevronDown
                  size={15}
                  className={showMoreDescription ? "rotate" : ""}
                />
              </button>
            )}
          </section>

          <div className="amazon-horizontal-line" />

          {/* CATEGORY */}
          <div className="product-category-row">
            <span>Category</span>
            <Link to={`/accessories/${product.categorySlug}`}>
              {product.category}
            </Link>
          </div>
        </div>

        {/* BUY BOX */}
        <aside className="amazon-buy-box">
          <div className="buy-box-price">
            ₹{product.price.toLocaleString("en-IN")}
          </div>

          <p className="buy-box-delivery">
            FREE delivery available
          </p>

          <div className="buy-box-location">
            <MapPin size={16} />
            <span>Deliver to your location</span>
          </div>

          <div className="buy-box-stock">
            <Check size={17} />
            {product.inStock ? "In stock" : "Currently unavailable"}
          </div>

          <p className="delivery-timing">
            Order now for convenient home delivery.
          </p>

          {/* QUANTITY SELECTOR */}
          <div className="quantity-section">
            <span>Quantity:</span>

            <div className="quantity-control">
              <button
                type="button"
                onClick={decreaseQuantity}
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                onClick={increaseQuantity}
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <button
            type="button"
            className="buy-box-cart"
            disabled={!product.inStock}
          >
            <ShoppingCart size={18} />
            <span>Add to Cart</span>
          </button>

          <button
            type="button"
            className="buy-box-buy"
            disabled={!product.inStock}
          >
            <span>Buy Now</span>
            <ArrowRight size={17} />
          </button>

          <div className="secure-payment">
            <ShieldCheck size={17} />
            <span>Secure transaction</span>
          </div>

          {/* BUY BOX SERVICES */}
          <div className="buy-box-services">
            <div>
              <Truck size={18} />
              <span>Convenient delivery</span>
            </div>

            <div>
              <RotateCcw size={18} />
              <span>Service support</span>
            </div>

            <div>
              <WalletCards size={18} />
              <span>Secure payment</span>
            </div>
          </div>
        </aside>
      </section>

      {/* BENEFITS BAR */}
      <section className="product-benefits-bar">
        <div className="benefit-item">
          <span className="benefit-icon">
            <Truck size={21} />
          </span>
          <div className="benefit-content">
            <strong>Convenient Delivery</strong>
            <span>Get your product delivered to your doorstep.</span>
          </div>
        </div>

        <div className="benefit-item">
          <span className="benefit-icon">
            <ShieldCheck size={21} />
          </span>
          <div className="benefit-content">
            <strong>Quality Support</strong>
            <span>Product and service assistance when required.</span>
          </div>
        </div>

        <div className="benefit-item">
          <span className="benefit-icon">
            <WalletCards size={21} />
          </span>
          <div className="benefit-content">
            <strong>Secure Payments</strong>
            <span>Safe and convenient payment experience.</span>
          </div>
        </div>

        <div className="benefit-item">
          <span className="benefit-icon">
            <RotateCcw size={21} />
          </span>
          <div className="benefit-content">
            <strong>Service Assistance</strong>
            <span>Professional help when needed.</span>
          </div>
        </div>
      </section>

      {/* THREE PRODUCT INFORMATION PANELS */}
      <div className="product-info-panels">
        <section className="product-information-section">
          <div className="information-heading">
            <span>PRODUCT INFORMATION</span>
            <h2>About this product</h2>
          </div>

          <div className="product-description-content">
            <p>{product.description}</p>
            <p>
              This product is designed for convenient everyday use.
              Please check compatibility and specifications before
              purchase to ensure it meets your requirements.
            </p>
          </div>
        </section>

        <section className="product-highlights-section">
          <div className="information-heading">
            <span>KEY FEATURES</span>
            <h2>Product highlights</h2>
          </div>

          <div className="large-highlights-grid">
            {product.highlights.map((highlight, index) => (
              <div className="large-highlight" key={index}>
                <div className="highlight-check">
                  <Check size={14} />
                </div>
                <p>{highlight}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="product-specifications-section">
          <div className="information-heading">
            <span>PRODUCT DETAILS</span>
            <h2>Technical specifications</h2>
          </div>

          <div className="specifications-table">
            {product.specifications.map((specification, index) => (
              <div className="specification-row" key={index}>
                <div className="specification-label">
                  {specification.label}
                </div>
                <div className="specification-value">
                  {specification.value}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* CUSTOMER REVIEWS */}
      <section
        id="customer-reviews"
        className="customer-reviews-section"
      >
        <div className="customer-reviews-header">
          <div>
            <span className="reviews-eyebrow">
              CUSTOMER FEEDBACK
            </span>
            <h2>Customer Reviews</h2>
            <p>
              Share your experience and help other customers
              make an informed decision.
            </p>
          </div>

          <button
            type="button"
            className="write-review-top-link"
            onClick={openReviewModal}
          >
            Write a review
          </button>
        </div>

        {/* REVIEW SUMMARY */}
        <div className="reviews-summary">
          <div className="reviews-average">
            <strong>{product.rating.toFixed(1)}</strong>

            <div className="reviews-summary-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={19}
                  fill={
                    star <= Math.round(product.rating)
                      ? "currentColor"
                      : "none"
                  }
                />
              ))}
            </div>

            <span>Product rating</span>
          </div>

          <div className="reviews-summary-divider" />

          <div className="reviews-total">
            <strong>
              {product.reviews.toLocaleString("en-IN")}
            </strong>
            <span>Existing ratings</span>
          </div>

          <div className="reviews-summary-divider" />

          <div className="reviews-total">
            <strong>{customerReviews.length}</strong>
            <span>Written reviews added this session</span>
          </div>
        </div>

        {/* CUSTOMER REVIEW LIST */}
        <div
          id="customer-reviews-list"
          className="customer-reviews-list"
        >
          <div className="reviews-list-heading">
            <h3>What customers say</h3>
            <span>
              {customerReviews.length} written{" "}
              {customerReviews.length === 1 ? "review" : "reviews"}
            </span>
          </div>

          {customerReviews.length === 0 ? (
            <div className="reviews-empty-state">
              <div className="reviews-empty-icon">
                <Star size={25} />
              </div>

              <h3>Be the first to write a review</h3>

              <p>
                Have you used this product? Share your thoughts
                with other OneService customers.
              </p>

              <button
                type="button"
                className="empty-review-write-button"
                onClick={openReviewModal}
              >
                Write the first review
              </button>
            </div>
          ) : (
            <div className="customer-review-items">
              {customerReviews.map((review) => (
                <article
                  className="customer-review-card"
                  key={review.id}
                >
                  <div className="customer-review-person">
                    <div className="review-avatar">
                      {review.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <strong>{review.name}</strong>
                      <span>
                        Customer review · {review.date}
                      </span>
                    </div>
                  </div>

                  <div className="customer-review-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        fill={
                          star <= review.rating
                            ? "currentColor"
                            : "none"
                        }
                      />
                    ))}
                  </div>

                  <h4>{review.title}</h4>
                  <p>{review.comment}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WRITE REVIEW POPUP */}
      {showReviewModal && (
        <div
          className="review-modal-overlay"
          onClick={closeReviewModal}
        >
          <section
            className="review-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="review-modal-header">
              <div>
                <span className="reviews-eyebrow">
                  CUSTOMER FEEDBACK
                </span>
                <h3 id="review-modal-title">Write a review</h3>
                <p>Share your experience with {product.name}.</p>
              </div>

              <button
                type="button"
                className="review-modal-close"
                onClick={closeReviewModal}
                aria-label="Close review form"
              >
                &times;
              </button>
            </div>

            <form
              className="customer-review-form"
              onSubmit={handleReviewSubmit}
            >
              {/* STAR RATING */}
              <div className="review-form-group">
                <label>Overall rating</label>

                <div
                  className="review-rating-selector"
                  role="group"
                  aria-label="Select your rating"
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={
                        star <= reviewRating
                          ? "rating-star-button selected"
                          : "rating-star-button"
                      }
                      onClick={() => setReviewRating(star)}
                      aria-label={`${star} star${star === 1 ? "" : "s"}`}
                      aria-pressed={reviewRating === star}
                    >
                      <Star
                        size={27}
                        fill={
                          star <= reviewRating
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>
                  ))}

                  <span>{reviewRating} out of 5</span>
                </div>
              </div>

              {/* CUSTOMER NAME */}
              <div className="review-form-group">
                <label htmlFor="review-name">Your name</label>
                <input
                  id="review-name"
                  type="text"
                  value={reviewName}
                  onChange={(event) => setReviewName(event.target.value)}
                  placeholder="Enter your name"
                  maxLength={80}
                  autoComplete="name"
                  required
                />
              </div>

              {/* REVIEW TITLE */}
              <div className="review-form-group">
                <label htmlFor="review-title">Review title</label>
                <input
                  id="review-title"
                  type="text"
                  value={reviewTitle}
                  onChange={(event) => setReviewTitle(event.target.value)}
                  placeholder="Summarize your experience"
                  maxLength={120}
                  required
                />
              </div>

              {/* REVIEW COMMENT */}
              <div className="review-form-group">
                <label htmlFor="review-comment">Your review</label>
                <textarea
                  id="review-comment"
                  value={reviewComment}
                  onChange={(event) => setReviewComment(event.target.value)}
                  placeholder="What did you like or dislike about this product?"
                  rows={5}
                  maxLength={2000}
                  required
                />

                <span className="review-character-count">
                  {reviewComment.length}/2000 characters
                </span>
              </div>

              {reviewMessage && (
                <p className="review-form-message" role="alert">
                  {reviewMessage}
                </p>
              )}

              {/* POPUP ACTIONS */}
              <div className="review-modal-actions">
                <button
                  type="button"
                  className="review-modal-cancel"
                  onClick={closeReviewModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="submit-customer-review"
                >
                  <Star size={17} />
                  Submit review
                </button>
              </div>

              <p className="review-form-note">
                Please keep your feedback respectful and relevant to
                the product.
              </p>
            </form>
          </section>
        </div>
      )}

      {/* RELATED PRODUCTS */}
      <section className="related-products-section">
        <div className="related-heading">
          <div>
            <span>YOU MAY ALSO LIKE</span>
            <h2>Related products</h2>
          </div>

          <Link to="/accessories-sales/products">
            <span>View all products</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="related-products-grid">
          {relatedProducts.map((relatedProduct) => (
            <Link
              key={relatedProduct.id}
              to={`/accessories-sales/products/${relatedProduct.id}`}
              className="related-product-card"
            >
              <div className="related-product-image">
                <img
                  src={relatedProduct.image}
                  alt={relatedProduct.name}
                />
              </div>

              <span>{relatedProduct.category}</span>
              <h3>{relatedProduct.name}</h3>

              <div className="related-rating">
                <span>{relatedProduct.rating}</span>
                <Star size={13} fill="currentColor" />
                <small>({relatedProduct.reviews})</small>
              </div>

              <strong>
                ₹{relatedProduct.price.toLocaleString("en-IN")}
              </strong>
            </Link>
          ))}
        </div>
      </section>

      {/* CONTINUE SHOPPING */}
      <Link
        to="/accessories-sales/products"
        className="product-details-back"
      >
        <ArrowLeft size={16} />
        <span>Continue shopping</span>
      </Link>
    </main>
  );
}

export default ProductDetailsPage;