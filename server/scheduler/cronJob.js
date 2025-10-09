const cron = require("node-cron");
const { syncStyle } = require("./triggerSync");
const { fetchAndStoreStyleIdsWhichClientWants, createSmartCollection, createSmartCollectionForSubCategory, resetDatabaseBeforeSync, deleteObsoleteShopifyProducts, updateUploadBrandSchemaForAfterDeleteWhichStyleIdHasNoData } = require("../controller/sync.controller");
const uploadBrandSchema = require("../model/uploadBrandSchema");
const StyleIdSyncJob = require("../model/StyleIdSyncJob");


exports.startScheduler = () => {
    // const scheduleTime = process.env.SYNC_CRON_TIME || "0 2 * * *";
    const scheduleTime = "59 8 * * *";
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
    cron.schedule("25 13 * * *", async () => {
        try {
            console.log("🌐 Fetching style IDs from S&S at", new Date().toLocaleString());
            // Step 1: Reset data before syncing new data
            await resetDatabaseBeforeSync();

            //will fetch category name and there id's

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

        const allowedBrands = [
            // "M&O"
            // "Under Armour",
            // "Comfort Colors",
            // "AllPro"
            // "Shaka Wear"
            // "Adidas"
            // "BELLA + CANVAS"
            // "ComfortWash by Hanes"
            "LAT"
            // "Independent Trading Co."
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


            // const subcategoryArrayOFmapWithThereID = [
            //     //T-Shirts
            //     { "T-Shirts": { "id": "21", "categoryPart": "tShirts", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "Core T-Shirts": { "id": "863", "categoryPart": "tShirts", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "Fashion T-Shirts": { "id": "864", "categoryPart": "tShirts", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "Short Sleeves": { "id": "57", "categoryPart": "tShirts", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "Sleeveless": { "id": "63", "categoryPart": "tShirts", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "Long Sleeves": { "id": "56", "categoryPart": "tShirts", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "Tagless": { "id": "182", "categoryPart": "tShirts", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "100% Cotton Face": { "id": "261", "categoryPart": "tShirts", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "Sale - Premium T-Shirts": { "id": "765", "categoryPart": "tShirts", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },

            //     //Sweatshirts & Hoodies
            //     { "Sweatshirts": { "id": "59", "categoryPart": "sweatshirtsHoodies", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "Hoodies": { "id": "1161", "categoryPart": "sweatshirtsHoodies", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "Hooded": { "id": "36", "categoryPart": "sweatshirtsHoodies", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "Sweatshirts & Fleece": { "id": "395", "categoryPart": "sweatshirtsHoodies", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "Silo Fleece - Hoody": { "id": "1170", "categoryPart": "sweatshirtsHoodies", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "Sale - Core Basic Fleece 7-8oz - Full-Zip Hooded": { "id": "744", "categoryPart": "sweatshirtsHoodies", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },

            //     //Polos
            //     { "Polos": { "id": "52", "categoryPart": "polos", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "Polos & Knits": { "id": "393", "categoryPart": "polos", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "Silo Polos - Long Sleeves": { "id": "1187", "categoryPart": "polos", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "Silo Polos - Short Sleeves": { "id": "1186", "categoryPart": "polos", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "Silo Polos - Other": { "id": "1189", "categoryPart": "polos", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },

            //     //Activewear
            //     { "Activewear": { "id": "387", "categoryPart": "activewear", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "Activewear & Loungewear": { "id": "388", "categoryPart": "activewear", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "Fitness & Wellness": { "id": "1109", "categoryPart": "activewear", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "2025 Polo Guide Activewear - Athleisure": { "id": "1008", "categoryPart": "activewear", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "Fitness & Wellness Gym & Training": { "id": "1130", "categoryPart": "activewear", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },

            //     //Zips
            //     { "Zips": { "id": "404", "categoryPart": "zips", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "Full-Zips": { "id": "38", "categoryPart": "zips", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "Quarter-Zips": { "id": "48", "categoryPart": "zips", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "Silo Knits - Quarter-Zips": { "id": "1191", "categoryPart": "zips", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "Silo Fleece - Quarter-Zips": { "id": "1174", "categoryPart": "zips", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "Silo Knits - Full-Zips": { "id": "1194", "categoryPart": "zips", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "Silo Fleece - Full-Zips": { "id": "1175", "categoryPart": "zips", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },

            //     //Promotional Products
            //     { "Office Apparel and Workwear": { "id": "616", "categoryPart": "promotionalProducts", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "USA Made": { "id": "42", "categoryPart": "promotionalProducts", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "2025 T-Shirt Guide Promos & Events": { "id": "955", "categoryPart": "promotionalProducts", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "2025 Fleece Guide Promos & Events - Hoodies": { "id": "1046", "categoryPart": "promotionalProducts", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "2025 Fleece Guide Promos & Events - Full-Zips": { "id": "1045", "categoryPart": "promotionalProducts", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "2025 Fleece Guide Promos & Events - Crewnecks": { "id": "1044", "categoryPart": "promotionalProducts", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },

            //     //New
            //     { "New": { "id": "77", "categoryPart": "new", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "2026 What's New - T-Shirts": { "id": "1142", "categoryPart": "new", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "2026 What's New - Quarter-Zips & Pullovers": { "id": "1152", "categoryPart": "new", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "2026 What's New - Polos": { "id": "1151", "categoryPart": "new", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "2026 What's New - Outerwear": { "id": "1157", "categoryPart": "new", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "2026 What's New - Athletics": { "id": "1154", "categoryPart": "new", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },

            //     //Others
            //     { "Tank Tops": { "id": "64", "categoryPart": "others", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "Crewneck": { "id": "8", "categoryPart": "others", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "Jackets": { "id": "47", "categoryPart": "others", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "Mens & Unisex": { "id": "87", "categoryPart": "others", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "Youth": { "id": "28", "categoryPart": "others", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "Womens": { "id": "13", "categoryPart": "others", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "Outerwear": { "id": "15", "categoryPart": "others", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } },
            //     { "Long Sleeves & Raglans": { "id": "695", "categoryPart": "others", "image": `https://cdn.ssactivewear.com/${brand.brandImage}` } }
            // ];

            const subcategoryArrayOFmapWithThereID = [
                //T-Shirts
                { "T-Shirts": { "id": "21", "categoryPart": "tShirts" } },
                { "Core T-Shirts": { "id": "863", "categoryPart": "tShirts" } },
                { "Fashion T-Shirts": { "id": "864", "categoryPart": "tShirts" } },
                { "Short Sleeves": { "id": "57", "categoryPart": "tShirts" } },
                { "Sleeveless": { "id": "63", "categoryPart": "tShirts" } },
                { "Long Sleeves": { "id": "56", "categoryPart": "tShirts" } },
                { "Tagless": { "id": "182", "categoryPart": "tShirts" } },
                { "100% Cotton Face": { "id": "261", "categoryPart": "tShirts" } },
                { "Sale - Premium T-Shirts": { "id": "765", "categoryPart": "tShirts" } },

                //Sweatshirts & Hoodies
                { "Sweatshirts": { "id": "59", "categoryPart": "sweatshirtsHoodies" } },
                { "Hoodies": { "id": "1161", "categoryPart": "sweatshirtsHoodies" } },
                { "Hooded": { "id": "36", "categoryPart": "sweatshirtsHoodies" } },
                { "Sweatshirts & Fleece": { "id": "395", "categoryPart": "sweatshirtsHoodies" } },
                { "Silo Fleece - Hoody": { "id": "1170", "categoryPart": "sweatshirtsHoodies" } },
                { "Sale - Core Basic Fleece 7-8oz - Full-Zip Hooded": { "id": "744", "categoryPart": "sweatshirtsHoodies" } },

                //Polos
                { "Polos": { "id": "52", "categoryPart": "polos" } },
                { "Polos & Knits": { "id": "393", "categoryPart": "polos" } },
                { "Silo Polos - Long Sleeves": { "id": "1187", "categoryPart": "polos" } },
                { "Silo Polos - Short Sleeves": { "id": "1186", "categoryPart": "polos" } },
                { "Silo Polos - Other": { "id": "1189", "categoryPart": "polos" } },

                //Tops
                { "Tank Tops": { "id": "64", "categoryPart": "tops" } },
                { "Company Store Tank Tops": { "id": "514", "categoryPart": "tops" } },
                { "Company Store Tops": { "id": "509", "categoryPart": "tops" } },
                { "Company Store Tops Active": { "id": "523", "categoryPart": "tops" } },
                { "Company Store Tops Zip": { "id": "521", "categoryPart": "tops" } },



                //Activewear
                { "Activewear": { "id": "387", "categoryPart": "activewear" } },
                { "Activewear & Loungewear": { "id": "388", "categoryPart": "activewear" } },
                { "Fitness & Wellness": { "id": "1109", "categoryPart": "activewear" } },
                { "2025 Polo Guide Activewear - Athleisure": { "id": "1008", "categoryPart": "activewear" } },
                { "Fitness & Wellness Gym & Training": { "id": "1130", "categoryPart": "activewear" } },

                //Zips
                { "Zips": { "id": "404", "categoryPart": "zips" } },
                { "Full-Zips": { "id": "38", "categoryPart": "zips" } },
                { "Quarter-Zips": { "id": "48", "categoryPart": "zips" } },
                { "Silo Knits - Quarter-Zips": { "id": "1191", "categoryPart": "zips" } },
                { "Silo Fleece - Quarter-Zips": { "id": "1174", "categoryPart": "zips" } },
                { "Silo Knits - Full-Zips": { "id": "1194", "categoryPart": "zips" } },
                { "Silo Fleece - Full-Zips": { "id": "1175", "categoryPart": "zips" } },

                //Jackets
                { "Jackets": { "id": "47", "categoryPart": "jackets" } },
                { "Company Store Jackets": { "id": "531", "categoryPart": "jackets" } },

                //USA made
                { "USA Made": { "id": "42", "categoryPart": "usaMade" } },
                { "USA Certified": { "id": "198", "categoryPart": "usaMade" } },

                //Promotional Products
                { "Office Apparel and Workwear": { "id": "616", "categoryPart": "promotionalProducts" } },
                { "2025 T-Shirt Guide Promos & Events": { "id": "955", "categoryPart": "promotionalProducts" } },
                { "2025 Fleece Guide Promos & Events - Hoodies": { "id": "1046", "categoryPart": "promotionalProducts" } },
                { "2025 Fleece Guide Promos & Events - Full-Zips": { "id": "1045", "categoryPart": "promotionalProducts" } },
                { "2025 Fleece Guide Promos & Events - Crewnecks": { "id": "1044", "categoryPart": "promotionalProducts" } },

                //New
                { "New": { "id": "77", "categoryPart": "new" } },
                { "2026 What's New - T-Shirts": { "id": "1142", "categoryPart": "new" } },
                { "2026 What's New - Quarter-Zips & Pullovers": { "id": "1152", "categoryPart": "new" } },
                { "2026 What's New - Polos": { "id": "1151", "categoryPart": "new" } },
                { "2026 What's New - Outerwear": { "id": "1157", "categoryPart": "new" } },
                { "2026 What's New - Athletics": { "id": "1154", "categoryPart": "new" } },

                //Others
                { "Crewneck": { "id": "8", "categoryPart": "others" } },
                { "Mens & Unisex": { "id": "87", "categoryPart": "others" } },
                { "Youth": { "id": "28", "categoryPart": "others" } },
                { "Womens": { "id": "13", "categoryPart": "others" } },
                { "Outerwear": { "id": "15", "categoryPart": "others" } },
                { "Long Sleeves & Raglans": { "id": "695", "categoryPart": "others" } }
            ];
            // const subCategoryImage = "/wwwe.excamlple,com";
            await createSmartCollectionForSubCategory(subcategoryArrayOFmapWithThereID);
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



