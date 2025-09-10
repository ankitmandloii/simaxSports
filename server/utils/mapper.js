

//old code
// exports.mapProducts = (ssProducts, specs = [], title, description, baseCategoryName) => {

//   const slugify = (str) =>
//     str
//       .toLowerCase()
//       .replace(/\s+/g, "-")        // Replace spaces with -
//       .replace(/[^\w\-]+/g, "")    // Remove non-word characters
//       .replace(/\-\-+/g, "-")      // Collapse multiple hyphens
//       .replace(/^-+|-+$/g, "");


//   const grouped = {};

//   for (const item of ssProducts) {
//     const key = `${item.styleID}`; // Group by styleID

//     if (!grouped[key]) {
//       grouped[key] = {
//         base: item,
//         variants: [],
//         images: new Set(),
//         colorOptions: new Set(),
//         sizeOptions: new Set(),
//       };
//     }

//     const blockedSizes = ["4XL", "5XL", "6XL", "7XL", "8XL"];
//     if (blockedSizes.includes(item.sizeName?.toUpperCase())) {
//       console.log(`[🚫 Skipped Variant] Size ${item.sizeName} in style ${item.styleID}`);
//       continue;
//     }

//     // Collect image URLs
//     const imagePaths = [
//       item.colorFrontImage,
//       item.colorBackImage,
//       item.colorDirectSideImage,
//       item.colorSwatchImage,
//       item.colorOnModelFrontImage,
//       item.colorOnModelBackImage,
//       item.colorOnModelSideImage,
//     ].filter(Boolean);

//     const imageUrls = imagePaths.map(
//       (img) => `https://cdn.ssactivewear.com/${img}`
//     );

//     imageUrls.forEach((img) => grouped[key].images.add(img));

//     // Match specs for this variantst
//     const matchingSpecs = specs.filter(
//       (s) => s.styleID === item.styleID && s.sizeName === item.sizeName
//     );

//     const specMap = {};
//     for (const spec of matchingSpecs) {
//       const formattedKey = spec.specName.toLowerCase().replace(/\s+/g, "_");
//       // Assuming these are numeric measurements, wrap in a JSON object
//       specMap[formattedKey] = {
//         value: isNaN(spec.value) ? spec.value : parseFloat(spec.value),
//         unit: "in" // or change based on real units
//       };
//     }

//     const variantMetafields = Object.keys(specMap).map((key) => ({
//       namespace: "specs",
//       key,
//       value: JSON.stringify(specMap[key]),
//       type: "json",
//     }));

//     variantMetafields.push({
//       namespace: "custom",
//       key: "category_info",
//       value: baseCategoryName || "",
//       type: "single_line_text_field",
//     });
//     // Add variant object
//     grouped[key].variants.push({
//       sku: item.sku,
//       price: parseFloat(item.salePrice).toFixed(2),
//       compareAtPrice: parseFloat(item.piecePrice),
//       option1: item.colorName || "Default",
//       option2: item.sizeName || "Default",
//       inventory_quantity: item.qty || 0,
//       inventory_management: "shopify",
//       fulfillment_service: "manual",
//       taxable: true,
//       imageSrc: imageUrls[0] || null,
//       weight: parseFloat(item.unitWeight || 0),
//       weight_unit: "POUNDS",
//       variantImages: imageUrls.map((src) => ({
//         src,
//         altText: src
//       })),
//       barcode: item.gtin,
//       metafields: variantMetafields,
//     });
//     //  altText: `${item.colorName} ${item.sizeName}`,
//     //testing  barcode: item.gtin,
//     grouped[key].colorOptions.add(item.colorName);
//     grouped[key].sizeOptions.add(item.sizeName);
//   }

//   const shopifyProducts = [];

//   for (const key in grouped) {
//     const { base, variants, images, colorOptions } = grouped[key];

//     const variantChunks = [];
//     for (let i = 0; i < variants.length; i += 140) {
//       variantChunks.push(variants.slice(i, i + 140));
//     }
//     //will be 250 after limit
//     variantChunks.forEach((variantGroup, index) => {
//       // const handle = `${base.brandName}-${base.styleName}-${index}`
//       //   .toLowerCase()
//       //   .replace(/\s+/g, "-")
//       //   .replace(/[^\w\-]+/g, "");
//       const handle = `${slugify(base.brandName)}-${slugify(base.styleName)}-${base.styleID}-${index}`;

//       // const allImages = Array.from(images).map((src) => ({
//       //   src,
//       //   altText: src,
//       // }));
//       // Collect only images used in this chunk's variants

//       const chunkImages = new Set();
//       for (const variant of variantGroup) {
//         (variant.variantImages || []).forEach(img => {
//           chunkImages.add(img.src);
//         });
//       }

//       const allImages = Array.from(chunkImages).map((src) => ({
//         src,
//         altText: src,
//       }));


//       shopifyProducts.push({
//         title: title || `${base.brandName} ${base.styleName}`,
//         body_html: description || `
// <p><strong>Brand:</strong> ${base.brandName}</p>
// <p><strong>Style:</strong> ${base.styleName}</p>
// <p><strong>Colors:</strong> ${Array.from(colorOptions).join(", ")}</p>
//         `,
//         vendor: base.brandName,
//         product_type: "Apparel",
//         tags: [base.colorFamily, base.baseCategoryID, base.brandName, base.baseCategory]
//           .filter(Boolean)
//           .join(", "),
//         handle,
//         options: [
//           { name: "Color", position: 1 },
//           { name: "Size", position: 2 },
//         ],
//         variants: variantGroup,
//         images: allImages,
//         status: "active",
//         metafields: [
//           {
//             namespace: "custom",
//             key: "images",
//             value: JSON.stringify(allImages),
//             type: "json",
//           },
//           {
//             namespace: "custom",
//             key: "category_name",
//             value: JSON.stringify(baseCategoryName) || "", // use the argument you passed in
//             type: "single_line_text_field",
//           },
//         ],
//       });

//       console.log(`[✅ Product Created in mapper] ${base.brandName} ${base.styleName} (chunk ${index + 1})`);
//       console.log(`[🖼 Total Images Included] ${allImages.length}`);
//     });
//   }

//   return shopifyProducts;
// };


//running code


exports.mapProducts = (ssProducts, specs = [], title, description, baseCategoryName) => {

  const slugify = (str) =>
    (str || "")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+|-+$/g, "");

  const grouped = {};

  for (const item of ssProducts) {
    const key = `${item.styleID}`;
    if (!grouped[key]) {
      grouped[key] = {
        base: item,
        variants: [],
        images: new Set(),
        colorOptions: new Set(),
        sizeOptions: new Set(),
        // NEW: map each image src to the first colorName we saw for it
        srcToColor: new Map(),
      };
    }

    const blockedSizes = ["4XL", "5XL", "6XL", "7XL", "8XL"];
    if (blockedSizes.includes(item.sizeName?.toUpperCase())) {
      console.log(`[🚫 Skipped Variant] Size ${item.sizeName} in style ${item.styleID}`);
      continue;
    }

    // Collect image URLs
    const imagePaths = [
      item.colorFrontImage,
      item.colorBackImage,
      item.colorDirectSideImage,
      item.colorSwatchImage,
      item.colorOnModelFrontImage,
      item.colorOnModelBackImage,
      item.colorOnModelSideImage,
    ].filter(Boolean);

    const imageUrls = imagePaths.map((img) => `https://cdn.ssactivewear.com/${img}`);

    imageUrls.forEach((src) => grouped[key].images.add(src));

    // Match specs for this variant
    const matchingSpecs = specs.filter(
      (s) => s.styleID === item.styleID && s.sizeName === item.sizeName
    );

    const specMap = {};
    for (const spec of matchingSpecs) {
      const formattedKey = spec.specName.toLowerCase().replace(/\s+/g, "_");
      specMap[formattedKey] = {
        value: isNaN(spec.value) ? spec.value : parseFloat(spec.value),
        unit: "in",
      };
    }

    const variantMetafields = Object.keys(specMap).map((key) => ({
      namespace: "specs",
      key,
      value: JSON.stringify(specMap[key]),
      type: "json",
    }));

    variantMetafields.push({
      namespace: "custom",
      key: "category_info",
      value: baseCategoryName || "",
      type: "single_line_text_field",
    });

    // Build variant images with altText = `${src}_${colorName}_${src}`
    const colorSlug = slugify(item.colorName || "unknown");
    const variantImages = imageUrls.map((src) => {
      // remember which color we saw for this src (for top-level images later)
      if (!grouped[key].srcToColor.has(src)) {
        grouped[key].srcToColor.set(src, colorSlug);
      }
      return {
        src,
        altText: `${colorSlug}_${src}`,
      };
    });



   
    // Add variant object
    grouped[key].variants.push({
      sku: item.sku,
      price: parseFloat(item.salePrice),
      compareAtPrice: parseFloat(item.piecePrice),
      option1: item.colorName || "Default",
      option2: item.sizeName || "Default",
      inventory_quantity: item.qty || 0,
      inventory_management: "shopify",
      fulfillment_service: "manual",
      taxable: true,
      imageSrc: imageUrls[0] || null,
      weight: parseFloat(item.unitWeight || 0),
      weight_unit: "POUNDS",
      variantImages,
      barcode: item.gtin,
      metafields: variantMetafields,
    });

    grouped[key].colorOptions.add(item.colorName);
    grouped[key].sizeOptions.add(item.sizeName);
  }

  const shopifyProducts = [];

  for (const key in grouped) {
    const { base, variants, images, colorOptions, srcToColor } = grouped[key];

    const variantChunks = [];
    for (let i = 0; i < variants.length; i += 140) {
      variantChunks.push(variants.slice(i, i + 140));
    }

    variantChunks.forEach((variantGroup, index) => {
      const handle = `${slugify(base.brandName)}-${slugify(base.styleName)}-${base.styleID}-${index}`;

      // Only include images used in this chunk's variants
      const chunkImages = new Set();
      for (const variant of variantGroup) {
        (variant.variantImages || []).forEach((img) => {
          chunkImages.add(img.src);
        });
      }

      // Build top-level images with the same altText pattern `${src}_${colorName}_${src}`
      const allImages = Array.from(chunkImages).map((src) => {
        const colorSlug = srcToColor.get(src) || "unknown";
        return {
          src,
          altText: `${colorSlug}_${src}`,
        };
      });

      shopifyProducts.push({
        title: title || `${base.brandName} ${base.styleName}`,
        body_html:
          description ||
          `
<p><strong>Brand:</strong> ${base.brandName}</p>
<p><strong>Style:</strong> ${base.styleName}</p>
<p><strong>Colors:</strong> ${Array.from(colorOptions).join(", ")}</p>
        `,
        vendor: base.brandName,
        product_type: "Apparel",
        tags: [base.colorFamily, base.baseCategoryID, base.brandName, base.baseCategory]
          .filter(Boolean)
          .join(", "),
        handle,
        options: [
          { name: "Color", position: 1 },
          { name: "Size", position: 2 },
        ],
        variants: variantGroup,
        images: allImages,
        status: "active",
        metafields: [
          {
            namespace: "custom",
            key: "images",
            value: JSON.stringify(allImages),
            type: "json",
          },
          {
            namespace: "custom",
            key: "category_name",
            value: JSON.stringify(baseCategoryName) || "",
            type: "single_line_text_field",
          },
        ],
      });

      console.log(`[✅ Product Created in mapper] ${base.brandName} ${base.styleName} (chunk ${index + 1})`);
      console.log(`[🖼️ Total Images Included] ${allImages.length}`);
    });
  }

  return shopifyProducts;
};






