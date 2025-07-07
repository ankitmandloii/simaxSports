const cron = require("node-cron");
const { fetchSSProducts } = require("../services/ssApi.service");
const { uploadToShopify } = require("../services/shopify.service");
const { mapProducts } = require("../utils/mapper");

exports.startScheduler = () => {
    const scheduleTime = process.env.SYNC_CRON_TIME || "0 2 * * *"; 
    // Default to 2:00 AM

    cron.schedule(scheduleTime, async () => {
        try {
            console.log("[SYNC START] Running scheduled product sync...");
            const ssProducts = await fetchSSProducts();
            console.log("Fetched S&S products:", ssProducts.length);

            const shopifyFormatted = mapProducts(ssProducts);
            console.log("Mapped products for Shopify:", shopifyFormatted.length);

            const uploaded = await uploadToShopify(shopifyFormatted);
            console.log(`[SYNC DONE] ${uploaded} products synced.`);
        } catch (err) {
            console.error("[SYNC ERROR]", err.message);
        }
    });
};