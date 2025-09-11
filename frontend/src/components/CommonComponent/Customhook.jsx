
import { useLayoutEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function usePersistQueryParams() {
  const location = useLocation();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const currentParams = Object.fromEntries(new URLSearchParams(location.search));

    // 1. Save current query params to sessionStorage whenever they exist
    if (Object.keys(currentParams).length > 0) {
      sessionStorage.setItem("persistedParams", JSON.stringify(currentParams));
    }

    // 2. Restore params if missing
    const savedParams = JSON.parse(sessionStorage.getItem("persistedParams") || "{}");
    if (Object.keys(savedParams).length === 0) return;

    const urlParams = new URLSearchParams(location.search);
    let updated = false;

    Object.entries(savedParams).forEach(([key, value]) => {
      if (!urlParams.has(key)) {
        urlParams.set(key, value);
        updated = true;
      }
    });

    if (updated) {
      navigate(`${location.pathname}?${urlParams.toString()}`, { replace: true });
    }
  }, [location.pathname, location.search, navigate]);
}
