const cron = require("node-cron");
const { syncStyle } = require("./triggerSync");
const { fetchAndStoreStyleIdsWhichClientWants, createSmartCollection, resetDatabaseBeforeSync, deleteObsoleteShopifyProducts, updateUploadBrandSchemaForAfterDeleteWhichStyleIdHasNoData } = require("../controller/sync.controller");
const uploadBrandSchema = require("../model/uploadBrandSchema");
const StyleIdSyncJob = require("../model/StyleIdSyncJob");


exports.startScheduler = () => {
    // const scheduleTime = process.env.SYNC_CRON_TIME || "0 2 * * *";
    const scheduleTime = "01 21 * * *";
    // Default to 2:00 AM


    async function deleteFromStyleIdSyncJob(toDelete) {
        // allow single id or array
        const ids = Array.isArray(toDelete) ? toDelete : [toDelete];

        // normalize + dedupe
        const styleIds = [...new Set(ids.filter(Boolean).map(String))];

        if (styleIds.length === 0) {
            console.log('✅ Nothing to delete from StyleIdSyncJob.');
            return { deletedCount: 0 };
        }

        const res = await StyleIdSyncJob.deleteMany({ styleId: { $in: styleIds } });
        console.log(`🗑️ Deleted ${res.deletedCount} doc(s) from StyleIdSyncJob for styleIds:`, styleIds);
        return { deletedCount: res.deletedCount };
    }


    // 🔁 CRON JOB 1: Fetch all style IDs from S&S and store to DB (every day at 1 AM)
    cron.schedule("37 15 * * *", async () => {
        try {
            console.log("🌐 Fetching style IDs from S&S at", new Date().toLocaleString());
            // Step 1: Reset data before syncing new data
            await resetDatabaseBeforeSync();
            // Step 2: Fetch new style IDs and store them in the database
            const toDelete = await fetchAndStoreStyleIdsWhichClientWants();
            console.log("toDelete StyleIds length-", toDelete.length);
            const { deletedCount } = await deleteFromStyleIdSyncJob(toDelete);
            if (deletedCount > 0) {
                await updateUploadBrandSchemaForAfterDeleteWhichStyleIdHasNoData();  // <- do this right after deletes
            }
            console.log("END FIRST CRON");
            //for delete product witch is not on S&S
            // await deleteObsoleteShopifyProducts(currentStyleIds);
        } catch (err) {
            console.error("❌ Error in first cron job:", err.message);
            return;
        }
    });







    cron.schedule(scheduleTime, async () => {

        const allowedBrands =[
        "Badger"
      ];
        try {
            console.log("🌐 Syncing styles for each brand at", new Date().toLocaleString());
            const brandJobs = await uploadBrandSchema.find({}).populate("styleIds").exec();
            const bulkOps = [];

            for (const brand of brandJobs) {
                if (allowedBrands.includes(brand.BrandName)) {
                    await syncBrandStyles(brand, bulkOps);
                } else {
                    continue;
                }
            }

            // Execute the bulk update for all brands at once
            if (bulkOps.length > 0) {
                await uploadBrandSchema.bulkWrite(bulkOps);
            }
            console.log("✅ Syncing completed successfully.");
        } catch (err) {
            console.error("[SYNC ERROR]", err.message);
        }
    });

    async function syncBrandStyles(brand, bulkOps) {
        try {
            let allStylesSynced = true;  // Assume success unless we find an issue
            const failedStyleIds = [];

            // Loop through each style and sync
            for (const style of brand.styleIds) {


                // Log for debugging
                console.log(`⏰ Sync started for styleId ${style.styleId} of ${brand.BrandName} at ${new Date().toLocaleString()}`);

                // Sync the style (this is where the actual sync logic happens)
                const resOfStyleId = await syncStyle(style.styleId);

                // If sync failed, mark it and add it to failedStyleIds
                if (!resOfStyleId) {
                    allStylesSynced = false;
                    failedStyleIds.push(style._id);  // Collect failed style IDs
                }
            }

            // Prepare the update data for the brand
            const updateData = {
                $set: {
                    lastAttempedBrandSync: new Date().toLocaleString()  // Always update the timestamp
                    // lastAttempedBrandSync:  new Date(createdAt).toLocaleString("en-GB", { timeZone: "UTC" }) // Always update the timestamp
                }
            };

            if (allStylesSynced) {
                updateData.$set.BrandSyncStatus = "success";
                updateData.$set.error = ""; // All styles synced successfully
            } else {
                updateData.$set.BrandSyncStatus = "failed";  // Some styles failed to sync
                updateData.$set.error = "Some styles failed to sync.";  // Add error message
                updateData.$addToSet = {
                    pendingStyleIds: { $each: failedStyleIds }  // Add failed styles to pendingStyleIds
                };
            }

            // Add the brand update operation to the bulkOps array
            bulkOps.push({
                updateOne: {
                    filter: { _id: brand._id },
                    update: updateData
                }
            });


            await createSmartCollection(brand.BrandName, brand.BrandName, brand.brandImage);
            console.log(`✅ Completed sync for brand: ${brand.BrandName}`);

        } catch (err) {
            console.error(`❌ Failed to sync styles for brand: ${brand.BrandName}`, err.message);

            // Handle failure for the brand
            bulkOps.push({
                updateOne: {
                    filter: { _id: brand._id },
                    update: {
                        $set: {
                            BrandSyncStatus: "failed",
                            error: err.message,
                             lastAttempedBrandSync: new Date().toLocaleString()
                            // lastAttempedBrandSync:  new Date(createdAt).toLocaleString("en-GB", { timeZone: "UTC" })
                        }
                    }
                }
            });
        }
    }



};



