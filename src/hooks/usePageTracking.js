import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initGA, trackPageView } from "./useAnalytics";

const MEASUREMENT_ID = "G-0GXDJFNCFM"; // 🔥 Thay bằng ID của bạn

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    initGA(MEASUREMENT_ID);
  }, []);

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);
};
