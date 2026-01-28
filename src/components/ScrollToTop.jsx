import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/api";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    // Track page view
    // We only track public routes to get clean visitor analytics
    if (!pathname.startsWith('/admin') && pathname !== '/login') {
      api.post('/analytics/track', {
        path: pathname,
        referer: document.referrer
      }).catch(() => {}); // Silently ignore tracking errors
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
