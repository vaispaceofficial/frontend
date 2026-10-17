import "./CityListingAd.css";

type CityListingAdProps = {
  title?: string;
  description?: string;
  image?: string;
  label?: string;
  onClick?: () => void;
};

export default function CityListingAd({
  title = "Promote your business on OneService",
  description = "Reach more local customers with a featured advertisement.",
  image,
  label = "Sponsored",
  onClick,
}: CityListingAdProps) {
  return (
    <article className="city-listing-ad">
      <div className="city-listing-ad-top">
        <span className="city-listing-ad-label">{label}</span>
        <span className="city-listing-ad-mark">ADVERTISEMENT</span>
      </div>

      {image && (
        <div className="city-listing-ad-image">
          <img src={image} alt="" loading="lazy" />
        </div>
      )}

      <div className="city-listing-ad-content">
        <h3>{title}</h3>
        <p>{description}</p>

        <button type="button" onClick={onClick}>
          Know more
        </button>
      </div>
    </article>
  );
}