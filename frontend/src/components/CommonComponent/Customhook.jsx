// import { useEffect } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function usePersistQueryParams() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const currentParams = new URLSearchParams(location.search);

        // Get saved params from sessionStorage
        const savedParams = JSON.parse(sessionStorage.getItem("persistedParams") || "{}");

        // ✅ Save *all* query params from the URL if present
        if ([...currentParams.entries()].length > 0) {
            const paramsToSave = {};
            currentParams.forEach((value, key) => {
                paramsToSave[key] = value;
            });
            sessionStorage.setItem("persistedParams", JSON.stringify(paramsToSave));
        }

        // ✅ Always enforce saved params on navigation
        if (Object.keys(savedParams).length > 0) {
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
