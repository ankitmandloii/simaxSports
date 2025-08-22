import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function usePersistQueryParams() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Parse current params
        const currentParams = new URLSearchParams(location.search);

        // Get stored params from sessionStorage (to persist across pages)
        const savedParams = JSON.parse(sessionStorage.getItem("persistedParams") || "{}");

        // If there are new params in the URL, save them
        if (currentParams.get("id") && currentParams.get("customerId") && currentParams.get("customerEmail")) {
            const paramsToSave = {
                id: currentParams.get("id"),
                customerId: currentParams.get("customerId"),
                customerEmail: currentParams.get("customerEmail"),
            };
            sessionStorage.setItem("persistedParams", JSON.stringify(paramsToSave));
        }

        // Always enforce params on navigation
        if (savedParams.id && savedParams.customerId && savedParams.customerEmail) {
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
        }
    }, [location.pathname, location.search, navigate]);
}
