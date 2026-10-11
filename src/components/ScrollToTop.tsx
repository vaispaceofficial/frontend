import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Preserve intentional navigation to an in-page section.
    if (hash) {
      const targetId = decodeURIComponent(hash.slice(1));

      requestAnimationFrame(() => {
        document.getElementById(targetId)?.scrollIntoView({
          behavior: "auto",
          block: "start",
        });
      });

      return;
    }

    // Scroll to the top whenever the route or query changes.
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname, search, hash]);

  return null;
}

export default ScrollToTop;