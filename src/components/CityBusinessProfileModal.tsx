import { useEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import {
  X,
  Star,
  MapPin,
  Phone,
  PhoneCall,
  Clock3,
  BadgeCheck,
  IdCard,
  Images,
  BriefcaseBusiness,
  ShoppingBag,
  MapPinned,
  MessageCircle,
  Check,
  Share2,
  Navigation,
  Building2,
  Globe,
  ExternalLink,
  Send,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import "./CityBusinessProfileModal.css";

export type CustomerReview = {
  id: number;
  name: string;
  date: string;
  rating: number;
  comment: string;
  avatar?: string;
};

export type BusinessProfile = {
  id: number;
  name: string;
  category: string;
  label: string;
  description: string;
  rating: number;
  location: string;
  phone: string;
  image: string;
  verified?: boolean;
  openNow?: boolean;
  reviewCount?: number;
  address?: string;
  email?: string;
  website?: string;
  coverImage?: string;
  avatar?: string;
  about?: string;
  hours?: { day: string; time: string }[];
  amenities?: string[];
  services?: string[];
  gallery?: string[];
  reviews?: CustomerReview[];
  ratingBreakdown?: { 1: number; 2: number; 3: number; 4: number; 5: number };
};

type Props = { listing: BusinessProfile; onClose: () => void };
type ProfileTab = "overview" | "media" | "services" | "products" | "location" | "reviews";

const tabs: { id: ProfileTab; label: string; icon: typeof IdCard }[] = [
  { id: "overview", label: "Overview", icon: IdCard },
  { id: "media", label: "Media & Gallery", icon: Images },
  { id: "services", label: "Services Offered", icon: BriefcaseBusiness },
  { id: "products", label: "Products / Catalogue", icon: ShoppingBag },
  { id: "location", label: "Location & Map", icon: MapPinned },
  { id: "reviews", label: "Customer Reviews", icon: MessageCircle },
];

// Presentation fallback only; replace with real customer reviews when connected to a review backend.
const sampleReviews: CustomerReview[] = [
  { id: 1, name: "Ananya Verma", date: "3 weeks ago", rating: 5, comment: "Empathetic doctors and very clean infrastructure!" },
];
const defaultRatingBreakdown = { 5: 85, 4: 10, 3: 3, 2: 1, 1: 1 };

function CityBusinessProfileModal({ listing, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [callbackName, setCallbackName] = useState("");
  const [callbackPhone, setCallbackPhone] = useState("");
  const [callbackMessage, setCallbackMessage] = useState("");
  const [reviewName, setReviewName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submittedReviews, setSubmittedReviews] = useState<CustomerReview[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imageZoom, setImageZoom] = useState(1);

  const onCloseRef = useRef(onClose);
  const showReviewFormRef = useRef(showReviewForm);
  const showCallbackFormRef = useRef(showCallbackForm);
  const lightboxOpenRef = useRef(lightboxOpen);
  const previousImageRef = useRef<() => void>(() => {});
  const nextImageRef = useRef<() => void>(() => {});
  onCloseRef.current = onClose;
  showReviewFormRef.current = showReviewForm;
  showCallbackFormRef.current = showCallbackForm;
  lightboxOpenRef.current = lightboxOpen;

  const address = listing.address || (listing.location.toLowerCase().includes("add business")
    ? "Business address will be updated soon"
    : listing.location);
  const hours = listing.hours ?? [
    { day: "Mon – Sat", time: "09:00 AM – 08:30 PM" },
    { day: "Sunday", time: "10:00 AM – 01:30 PM" },
  ];
  const amenities = listing.amenities ?? [
    "Professional Consultation", "Experienced Staff", "Modern Facilities", "Customer Support", "Appointment Available",
  ];
  const services = listing.services ?? [listing.label, "Professional Consultation", "Customer Assistance"];
  const gallery = listing.gallery?.length
    ? listing.gallery.filter(Boolean)
    : [listing.coverImage || listing.image, listing.image].filter(Boolean);
  const activeImage = gallery[activeImageIndex] || gallery[0];
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(`${listing.name}, ${address}`)}&z=15&output=embed`;
  const websiteUrl = listing.website?.trim()
    ? (/^https?:\/\//i.test(listing.website.trim()) ? listing.website.trim() : `https://${listing.website.trim()}`)
    : "";
  const formatWebsite = (website: string) => website.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
  const reviews = [...submittedReviews, ...(listing.reviews ?? sampleReviews)];
  const reviewCount = (listing.reviewCount ?? 98) + submittedReviews.length;
  const ratingBreakdown = listing.ratingBreakdown ?? defaultRatingBreakdown;

  const openImageViewer = (index: number) => {
    setActiveImageIndex(index);
    setImageZoom(1);
    setLightboxOpen(true);
  };
  const closeImageViewer = () => {
    setLightboxOpen(false);
    setImageZoom(1);
  };
  const showPreviousImage = () => {
    if (gallery.length < 2) return;
    setActiveImageIndex((current) => (current <= 0 ? gallery.length - 1 : current - 1));
    setImageZoom(1);
  };
  const showNextImage = () => {
    if (gallery.length < 2) return;
    setActiveImageIndex((current) => (current >= gallery.length - 1 ? 0 : current + 1));
    setImageZoom(1);
  };
  previousImageRef.current = showPreviousImage;
  nextImageRef.current = showNextImage;

  useEffect(() => {
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const body = document.body;
    const html = document.documentElement;
    const previousBodyStyles = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    const previousHtmlOverflow = html.style.overflow;
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = `-${scrollX}px`;
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    html.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (lightboxOpenRef.current) {
        if (event.key === "Escape") {
          event.stopPropagation();
          closeImageViewer();
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          previousImageRef.current();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          nextImageRef.current();
        }
        return;
      }
      if (event.key === "Escape") {
        if (showCallbackFormRef.current) setShowCallbackForm(false);
        else if (showReviewFormRef.current) setShowReviewForm(false);
        else onCloseRef.current();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      body.style.position = previousBodyStyles.position;
      body.style.top = previousBodyStyles.top;
      body.style.left = previousBodyStyles.left;
      body.style.right = previousBodyStyles.right;
      body.style.width = previousBodyStyles.width;
      body.style.overflow = previousBodyStyles.overflow;
      html.style.overflow = previousHtmlOverflow;
      window.scrollTo(scrollX, scrollY);
    };
  }, []);

  const callBusiness = () => {
    if (listing.phone) window.location.href = `tel:${listing.phone}`;
  };
  const getWhatsAppNumber = () => {
    const digits = (listing.phone || "").replace(/\D/g, "");
    if (!digits) return "";
    return digits.length === 10 ? `91${digits}` : digits;
  };
  const openWhatsApp = (message?: string) => {
    const phone = getWhatsAppNumber();
    if (!phone) {
      window.alert("WhatsApp contact number is not available for this listing.");
      return;
    }
    const text = message || `Hi, I'm interested in ${listing.name}.\nLocation: ${address}\nPlease share more details about this business listing.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };
  const submitCallbackRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = callbackName.trim();
    const phone = callbackPhone.trim();
    if (!name || !phone) return;
    const message = `Hello, I would like to request a callback regarding this business listing.\n\nBusiness: ${listing.name}\nLocation: ${address}\nCustomer name: ${name}\nCustomer phone: ${phone}\nMessage: ${callbackMessage.trim() || "Please contact me."}`;
    openWhatsApp(message);
    setShowCallbackForm(false);
  };
  const shareBusiness = async () => {
    const shareData = { title: listing.name, text: `${listing.name} — ${address}`, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${listing.name}\n${address}\n${window.location.href}`);
        window.alert("Business details copied to clipboard.");
      } else window.alert(`${listing.name}\n${address}`);
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") console.error("Unable to share business:", error);
    }
  };
  const submitReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = reviewName.trim();
    const comment = reviewComment.trim();
    if (!name || !comment) return;
    const newReview: CustomerReview = { id: Date.now(), name, date: "Just now", rating: reviewRating, comment };
    setSubmittedReviews((previous) => [newReview, ...previous]);
    setReviewName("");
    setReviewComment("");
    setReviewRating(5);
    setShowReviewForm(false);
    setActiveTab("reviews");
  };

  const coverStyle: CSSProperties = {
    backgroundImage: `linear-gradient(90deg, rgba(8, 18, 38, 0.88) 0%, rgba(8, 18, 38, 0.54) 54%, rgba(8, 18, 38, 0.12) 100%), linear-gradient(0deg, rgba(8, 18, 38, 0.82) 0%, transparent 75%), url("${listing.coverImage || listing.image}")`,
  };

  return (
    <div className="business-profile-backdrop" onClick={(event) => {
      if (event.target === event.currentTarget) {
        if (lightboxOpen) closeImageViewer();
        else if (showCallbackForm) setShowCallbackForm(false);
        else if (showReviewForm) setShowReviewForm(false);
        else onCloseRef.current();
      }
    }}>
      <section className="business-profile-modal" role="dialog" aria-modal="true" aria-label={`${listing.name} business profile`}>
        <button type="button" className="business-profile-close" onClick={() => onCloseRef.current()} aria-label="Close business profile"><X size={20} /></button>
        <header className="business-profile-cover" style={coverStyle}>
          <div className="business-profile-identity">
            <img className="business-profile-avatar" src={listing.avatar || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=180&q=80"} alt={`${listing.name} profile`} />
            <div className="business-profile-heading">
              <div className="business-profile-badges">
                <span className="business-profile-category-badge"><Building2 size={13} />{listing.category}</span>
                {listing.verified && <span className="business-profile-verified"><BadgeCheck size={14} />Verified</span>}
                {listing.openNow !== undefined && <span className={`business-profile-open-status ${listing.openNow ? "is-open" : "is-closed"}`}><span className="business-profile-status-dot" />{listing.openNow ? "Open now" : "Closed"}</span>}
              </div>
              <h1>{listing.name}</h1>
              <p className="business-profile-tagline">{listing.description}</p>
              <div className="business-profile-meta">
                <span className="business-profile-rating"><Star size={15} fill="currentColor" />{listing.rating.toFixed(1)}<span>({listing.reviewCount ?? 142} reviews)</span></span>
                <span className="business-profile-meta-divider">•</span>
                <span className="business-profile-location-meta"><MapPin size={14} /><span>{address}</span></span>
              </div>
            </div>
          </div>
          <div className="business-profile-actions">
            <button type="button" className="business-profile-whatsapp" onClick={() => openWhatsApp()} aria-label="Contact business on WhatsApp" title="Chat on WhatsApp"><MessageCircle size={17} /><span>WhatsApp</span></button>
            <button type="button" className="business-profile-call" onClick={callBusiness} disabled={!listing.phone} title={listing.phone ? "Call this business" : "Phone number not available yet"}><Phone size={15} /><span>Call Now</span></button>
            <button type="button" className="business-profile-callback" onClick={() => setShowCallbackForm(true)}><PhoneCall size={16} /><span>Request a Call Back</span></button>
            <a className="business-profile-directions" href={directionsUrl} target="_blank" rel="noopener noreferrer"><Navigation size={15} /><span>Directions</span></a>
            <button type="button" className="business-profile-share" onClick={shareBusiness} aria-label="Share business profile" title="Share business profile"><Share2 size={17} /></button>
          </div>
        </header>

        <nav className="business-profile-tabs" aria-label="Business profile sections">
          {tabs.map((tab) => { const Icon = tab.icon; const active = activeTab === tab.id; return <button type="button" key={tab.id} className={`business-profile-tab ${active ? "active" : ""}`} onClick={() => setActiveTab(tab.id)} aria-pressed={active}><Icon size={15} /><span>{tab.label}</span></button>; })}
        </nav>

        <div className="business-profile-body">
          {activeTab === "overview" && <div className="business-profile-overview">
            <div className="business-profile-main-column">
              <section className="business-profile-panel"><h2>About Business</h2><p>{listing.about || `${listing.description} ${listing.name} provides professional services with a focus on quality, customer care, and reliable support.`}</p></section>
              <section className="business-profile-panel"><h2>Key Highlights & Amenities</h2><div className="business-profile-amenities">{amenities.map((amenity) => <div className="business-profile-amenity" key={amenity}><Check size={14} /><span>{amenity}</span></div>)}</div></section>
            </div>
            <aside className="business-profile-side-column">
              <section className="business-profile-panel"><h2><Clock3 size={17} />Operating Hours</h2><div className="business-profile-hours">{hours.map((item) => <div key={item.day}><strong>{item.day}</strong><span>{item.time}</span></div>)}</div></section>
              <section className="business-profile-panel"><h2><IdCard size={17} />Contact Details</h2><div className="business-profile-contact">
                <p><MapPin size={14} /><span>{address}</span></p>
                <p><Phone size={14} /><span>{listing.phone ? <a href={`tel:${listing.phone}`}>{listing.phone}</a> : "Phone number not provided"}</span></p>
                <p><MessageCircle size={14} /><span>{listing.email ? <a href={`mailto:${listing.email}`}>{listing.email}</a> : "Email not provided"}</span></p>
                <p className="business-profile-website"><Globe size={14} /><span>{websiteUrl ? <a href={websiteUrl} target="_blank" rel="noopener noreferrer">{formatWebsite(listing.website ?? "")}</a> : <span className="business-profile-missing-value">Website not provided</span>}</span>{websiteUrl && <ExternalLink size={12} />}</p>
              </div></section>
            </aside>
          </div>}

          {activeTab === "media" && <section className="business-profile-panel business-profile-full-panel">
            <h2>Media & Gallery</h2><p className="business-profile-section-description">Photos provided for this business. Select an image to view it full screen.</p>
            <div className="business-profile-gallery">
              {gallery.map((image, index) => <button type="button" className="business-profile-gallery-item" key={`${image}-${index}`} onClick={() => openImageViewer(index)} aria-label={`View image ${index + 1} of ${gallery.length}`}>
                <img src={image} alt={`${listing.name} gallery ${index + 1}`} loading="lazy" />
                <span className="business-profile-gallery-view"><Images size={18} />View image</span>
              </button>)}
            </div>
          </section>}

          {activeTab === "services" && <section className="business-profile-panel business-profile-full-panel"><h2>Services Offered</h2><div className="business-profile-services">{services.map((service, index) => <div className="business-profile-service" key={`${service}-${index}`}><Check size={16} /><span>{service}</span></div>)}</div></section>}
          {activeTab === "products" && <section className="business-profile-panel business-profile-full-panel"><h2>Products / Catalogue</h2><div className="business-profile-empty-tab"><ShoppingBag size={30} /><h3>Catalogue coming soon</h3><p>Product and catalogue information will appear here when it is added for this business.</p></div></section>}

          {activeTab === "location" && <section className="business-profile-panel business-profile-full-panel business-profile-location-panel">
            <h2>Location & Map View</h2><p className="business-profile-map-address"><MapPin size={15} />{address}</p>
            <div className="business-profile-map-frame"><iframe title={`Map showing ${listing.name}`} src={mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /><div className="business-profile-map-label"><span className="business-profile-map-pin"><MapPin size={20} fill="currentColor" /></span><div><strong>{listing.name}</strong><span>Business location</span></div></div><a className="business-profile-map-directions" href={directionsUrl} target="_blank" rel="noopener noreferrer"><Navigation size={15} />Get Directions</a></div>
            <div className="business-profile-location-details"><MapPin size={18} /><div><strong>Business Address</strong><p>{address}</p></div><a href={directionsUrl} target="_blank" rel="noopener noreferrer">Open in Maps <ExternalLink size={13} /></a></div>
          </section>}

          {activeTab === "reviews" && <div className="business-profile-reviews-layout">
            <aside className="business-profile-panel business-profile-rating-summary"><h2>User Ratings Summary</h2><div className="business-profile-rating-number"><strong>{listing.rating.toFixed(1)}</strong><span>out of 5.0</span></div>
              <div className="business-profile-rating-stars" aria-label={`${listing.rating.toFixed(1)} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={19} fill={index < Math.round(listing.rating) ? "currentColor" : "none"} />)}</div>
              <p className="business-profile-rating-count">Based on {reviewCount} customer reviews</p>
              <div className="business-profile-rating-breakdown">{([5, 4, 3, 2, 1] as const).map((star) => { const percentage = ratingBreakdown[star]; return <div className="business-profile-rating-row" key={star}><span className="business-profile-rating-label">{star} ★</span><div className="business-profile-rating-track" role="progressbar" aria-label={`${star} star reviews`} aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }} /></div><span className="business-profile-rating-percentage">{percentage}%</span></div>; })}</div>
              <button type="button" className="business-profile-write-review" onClick={() => setShowReviewForm(true)}>Write a Review</button>
            </aside>
            <div className="business-profile-review-list">{reviews.length ? reviews.map((review) => <article className="business-profile-review-card" key={review.id}><div className="business-profile-review-avatar">{review.avatar ? <img src={review.avatar} alt={review.name} /> : review.name.charAt(0).toUpperCase()}</div><div className="business-profile-review-content"><div className="business-profile-review-header"><div><h3>{review.name}</h3><span>{review.date}</span></div><div className="business-profile-review-stars" aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={15} fill={index < review.rating ? "currentColor" : "none"} />)}</div></div><p>{review.comment}</p></div></article>) : <div className="business-profile-no-reviews"><MessageCircle size={28} /><h3>No reviews yet</h3><p>Be the first to share your experience with this business.</p></div>}</div>
          </div>}
        </div>
      </section>

      {/* Full-screen media gallery viewer */}
      {lightboxOpen && activeImage && <div className="business-profile-lightbox" role="dialog" aria-modal="true" aria-label="Image gallery viewer" onClick={(event) => { if (event.target === event.currentTarget) closeImageViewer(); }} onWheel={(event) => { event.preventDefault(); setImageZoom((current) => Math.min(4, Math.max(1, current + (event.deltaY < 0 ? 0.25 : -0.25)))); }}>
        <button type="button" className="business-profile-lightbox-close" onClick={closeImageViewer} aria-label="Close image viewer"><X size={24} /></button>
        <div className="business-profile-lightbox-counter">{activeImageIndex + 1} / {gallery.length}</div>
        {gallery.length > 1 && <button type="button" className="business-profile-lightbox-nav previous" onClick={showPreviousImage} aria-label="Previous image">‹</button>}
        <div className="business-profile-lightbox-image-wrap"><img key={`${activeImage}-${activeImageIndex}`} src={activeImage} alt={`${listing.name} image ${activeImageIndex + 1}`} className="business-profile-lightbox-image" style={{ transform: `scale(${imageZoom})`, cursor: imageZoom > 1 ? "zoom-out" : "zoom-in" }} onClick={() => setImageZoom((current) => current > 1 ? 1 : 2)} draggable={false} /></div>
        {gallery.length > 1 && <button type="button" className="business-profile-lightbox-nav next" onClick={showNextImage} aria-label="Next image">›</button>}
        <div className="business-profile-lightbox-controls"><button type="button" onClick={() => setImageZoom((current) => Math.max(1, current - 0.25))} disabled={imageZoom <= 1} aria-label="Zoom out"><ZoomOut size={18} /></button><button type="button" onClick={() => setImageZoom(1)} aria-label="Reset zoom">{Math.round(imageZoom * 100)}%</button><button type="button" onClick={() => setImageZoom((current) => Math.min(4, current + 0.25))} disabled={imageZoom >= 4} aria-label="Zoom in"><ZoomIn size={18} /></button></div>
      </div>}

      {/* Request a callback popup */}
      {showCallbackForm && <div className="business-profile-review-backdrop" onClick={(event) => { if (event.target === event.currentTarget) setShowCallbackForm(false); }}>
        <section className="business-profile-review-modal business-profile-callback-modal" role="dialog" aria-modal="true" aria-labelledby="callback-title">
          <button type="button" className="business-profile-review-close" onClick={() => setShowCallbackForm(false)} aria-label="Close callback form"><X size={18} /></button>
          <h2 id="callback-title">Request a Call Back</h2><p>Leave your contact details and send a callback request to <strong>{listing.name}</strong>.</p>
          <form onSubmit={submitCallbackRequest}><label htmlFor="callback-name">Your Name</label><input id="callback-name" value={callbackName} onChange={(event) => setCallbackName(event.target.value)} placeholder="Enter your name" autoComplete="name" maxLength={80} required />
            <label htmlFor="callback-phone">Phone Number</label><input id="callback-phone" type="tel" value={callbackPhone} onChange={(event) => setCallbackPhone(event.target.value)} placeholder="Enter your phone number" autoComplete="tel" pattern="[+]?[0-9 ()-]{10,20}" maxLength={20} required />
            <label htmlFor="callback-message">Message (Optional)</label><textarea id="callback-message" value={callbackMessage} onChange={(event) => setCallbackMessage(event.target.value)} placeholder="What would you like to know?" rows={3} maxLength={500} />
            <button type="submit" className="business-profile-submit-review"><PhoneCall size={16} />Send Callback Request</button>
          </form>
        </section>
      </div>}

      {/* Write a review popup */}
      {showReviewForm && <div className="business-profile-review-backdrop" onClick={(event) => { if (event.target === event.currentTarget) setShowReviewForm(false); }}>
        <section className="business-profile-review-modal" role="dialog" aria-modal="true" aria-labelledby="business-review-title">
          <button type="button" className="business-profile-review-close" onClick={() => setShowReviewForm(false)} aria-label="Close review form"><X size={18} /></button>
          <h2 id="business-review-title">Write a Review</h2><p>Share your experience with {listing.name}.</p>
          <form onSubmit={submitReview}><label htmlFor="business-review-name">Your Name</label><input id="business-review-name" value={reviewName} onChange={(event) => setReviewName(event.target.value)} placeholder="Enter your name" required maxLength={80} />
            <span className="business-profile-form-label">Your Rating</span><div className="business-profile-review-rating-picker">{Array.from({ length: 5 }, (_, index) => { const rating = index + 1; return <button type="button" key={rating} aria-label={`Rate ${rating} out of 5`} aria-pressed={reviewRating === rating} onClick={() => setReviewRating(rating)} className={rating <= reviewRating ? "selected" : ""}><Star size={24} fill={rating <= reviewRating ? "currentColor" : "none"} /></button>; })}</div>
            <label htmlFor="business-review-comment">Your Review</label><textarea id="business-review-comment" value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} placeholder="Tell others about your experience..." rows={4} required maxLength={1500} />
            <button type="submit" className="business-profile-submit-review"><Send size={15} />Submit Review</button>
          </form>
        </section>
      </div>}
    </div>
  );
}

export default CityBusinessProfileModal;
