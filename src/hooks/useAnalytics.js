import ReactGA from "react-ga4";

export const initGA = (measurementId) => {
  ReactGA.initialize(measurementId);
  console.log("✅ Google Analytics initialized:", measurementId);
};

export const trackPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
  console.log("📄 Page viewed:", path);
};

export const trackEvent = (category, action, label) => {
  ReactGA.event({
    category,
    action,
    label,
  });
  console.log("🎯 Event tracked:", { category, action, label });
};
