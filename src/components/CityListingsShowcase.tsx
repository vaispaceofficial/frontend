
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import "./CityListingsShowcase.css";

const showcaseItems = [
  {
    title: "Health & Medical",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=85",
  },
  {
    title: "Education",
    image:
      "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=85",
  },
  {
    title: "Interiors",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=85",
  },
  {
    title: "Car Showrooms",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=85",
  },
  {
    title: "Car Services",
    image:
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=85",
  },
  {
    title: "Car Interiors",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=85",
  },
];

export default function CityListingsShowcase() {
  const showcaseRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = showcaseRef.current;

    if (!root) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const tiles = gsap.utils.toArray<HTMLElement>(
        ".city-showcase-tile"
      );

      if (tiles.length === 0) return;

      // Respect the visitor's reduced-motion preference.
      if (reduceMotion) {
        gsap.set(tiles, {
          autoAlpha: 1,
          scale: 1,
          clearProps: "transform",
        });

        return;
      }

      // Keep every tile in its original grid position.
      gsap.set(tiles, {
        scale: 1,
        autoAlpha: 0.72,
        zIndex: 1,
        transformOrigin: "center center",
        force3D: true,
      });

      // Start with the first image in front.
      gsap.set(tiles[0], {
        scale: 1.28,
        autoAlpha: 1,
        zIndex: 10,
      });

      const timeline = gsap.timeline({
        repeat: -1,
        repeatDelay: 0.25,
      });

      tiles.forEach((tile, index) => {
        const nextIndex = (index + 1) % tiles.length;
        const nextTile = tiles[nextIndex];

        timeline
          // Bring the current tile above its neighbors.
          .set(tile, {
            zIndex: 10,
            autoAlpha: 1,
          })

          // Enlarge the image smoothly.
          .to(tile, {
            scale: 1.28,
            duration: 0.7,
            ease: "power3.out",
          })

          // Keep the enlarged image in focus.
          .to({}, {
            duration: 0.85,
          })

          // Return the tile to its original size.
          .to(tile, {
            scale: 1,
            autoAlpha: 0.72,
            duration: 0.65,
            ease: "power3.inOut",
          })

          // Send it behind the other tiles.
          .set(tile, {
            zIndex: 1,
          })

          // Prepare the next tile to come forward.
          .set(nextTile, {
            zIndex: 10,
            autoAlpha: 1,
          });
      });
    }, root);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      className="city-showcase"
      ref={showcaseRef}
      aria-label="Explore local business categories"
    >
      <div className="city-showcase-heading">
        <span className="city-showcase-eyebrow">
          EXPLORE LOCAL
        </span>

        <h2>Discover what's around you.</h2>

        <p>
          Explore services, businesses, and professionals
          in your city.
        </p>
      </div>

      <div className="city-showcase-grid">
        {showcaseItems.map((item) => (
          <article
            className="city-showcase-tile"
            key={item.title}
          >
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
            />

            <div className="city-showcase-tile-overlay">
              <span className="city-showcase-tile-title">
                {item.title}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

