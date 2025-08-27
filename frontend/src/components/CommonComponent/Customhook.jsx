import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function usePersistQueryParams() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentParams = new URLSearchParams(location.search);

    // Load from sessionStorage
    const savedParams = JSON.parse(
      sessionStorage.getItem("persistedParams") || "{}"
    );

    // ✅ Collect all required params
    const requiredKeys = ["pId", "variantid", "customerId", "customerEmail"];
    const optionalKeys = ["designId"];

    // If URL has required params → store them (plus designId if present)
    const hasAllRequired = requiredKeys.every((key) => currentParams.get(key));
    if (hasAllRequired) {
      const paramsToSave = {};
      [...requiredKeys, ...optionalKeys].forEach((key) => {
        const val = currentParams.get(key);
        if (val) paramsToSave[key] = val;
      });
      sessionStorage.setItem("persistedParams", JSON.stringify(paramsToSave));
    }

    // ✅ Enforce saved params on navigation
    if (savedParams && Object.keys(savedParams).length > 0) {
      const urlParams = new URLSearchParams(location.search);
      let updated = false;

      Object.entries(savedParams).forEach(([key, value]) => {
        if (!urlParams.has(key)) {
          urlParams.set(key, value);
          updated = true;
        }
      });

      if (updated) {
        navigate(`${location.pathname}?${urlParams.toString()}`, {
          replace: true,
        });
      }
    }
  }, [location.pathname, location.search, navigate]);
}
    