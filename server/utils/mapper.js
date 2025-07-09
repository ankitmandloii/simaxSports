


//one color per one product mapping old code
// exports.mapProducts = (ssProducts) => {
//   // Group by styleID + colorName
//   const grouped = {};

//   for (const item of ssProducts) {
//     const key = `${item.styleID}_${item.colorName}`;

//     if (!grouped[key]) {
//       grouped[key] = {
//         base: item,
//         variants: [],
//       };
//     }

//     grouped[key].variants.push({
//       sku: item.sku,
//       price: parseFloat(item.salePrice).toFixed(2),
//       option1: item.sizeName || "Default",
//       option2: item.colorName || "Default",
//       inventory_quantity: item.qty || 0,
//       inventory_management: "shopify",
//       fulfillment_service: "manual",
//       taxable: true,
//       weight: parseFloat(item.unitWeight),
//       weight_unit: "lb",// or "kg, g, kg, lb, or oz" — based on S&S data (S&S uses lbs by default)
//       imageSrc: item.colorFrontImage
//     ? `https://cdn.ssactivewear.com/${item.colorFrontImage}`
//     : null // only include if image exists 
//     });
//   }

//   // Build Shopify products
//   const shopifyProducts = [];

//   for (const key in grouped) {
//     const { base, variants } = grouped[key];

//     const handle = `${base.brandName}-${base.styleName}-${base.colorName}`
//       .toLowerCase()
//       .replace(/\s+/g, '-')
//       .replace(/[^\w\-]+/g, '');

//     const images = [
//       base.colorFrontImage,
//       base.colorBackImage,
//       base.colorDirectSideImage,
//       base.colorOnModelFrontImage,
//       base.colorOnModelBackImage,
//       base.colorOnModelSideImage,
//       base.colorSwatchImage
//     ]
//       .filter(Boolean)
//       .map((img) => ({
//         src: `https://cdn.ssactivewear.com/${img}`,
//         altText: `${base.colorName} ${base.styleName}`
//       }));

//     shopifyProducts.push({
//       title: `${base.brandName} ${base.styleName} - ${base.colorName}`,
//       body_html: `
//         <p><strong>Brand:</strong> ${base.brandName}</p>
//         <p><strong>Style:</strong> ${base.styleName}</p>
//         <p><strong>Color:</strong> ${base.colorName}</p>
//       `,
//       vendor: base.brandName,
//       product_type: "Apparel",
//       tags: [base.colorFamily, base.baseCategoryID, base.brandName].filter(Boolean).join(", "),
//       handle,
//       options: [
//         { name: "Size", position: 1 },
//         { name: "Color", position: 2 }
//       ],
//       variants,
//       images,
//       status: "active",
//        metafields: [
//         {
//           namespace: "ss_product",
//           key: "country_of_origin",
//           value: base.countryOfOrigin,
//           type: "single_line_text_field"
//         },
//         {
//           namespace: "ss_product",
//           key: "color_group",
//           value: base.colorGroupName,
//           type: "single_line_text_field"
//         }
//       ]
//     });
//   }

//   return shopifyProducts;
// };


//one product per varints
// exports.mapProducts = (ssProducts) => {
//   const grouped = {};

//   for (const item of ssProducts) {
//     const key = `${item.styleID}`; // Group by styleID only

//     if (!grouped[key]) {
//       grouped[key] = {
//         base: item,
//         variants: [],
//         images: new Set(),
//         colorOptions: new Set(),
//         sizeOptions: new Set(),
//       };
//     }

//     // Collect all image URLs for the variant
//     const imagePaths = [
//       item.colorFrontImage,
//       item.colorBackImage,
//       item.colorSwatchImage,
//       item.colorOnModelFrontImage,
//       item.colorOnModelBackImage,
//     ].filter(Boolean);

//     const imageUrls = imagePaths.map(img => `https://cdn.ssactivewear.com/${img}`);
//     // console.log("checkkkkkkkkkkkkk",imageUrls);
//     imageUrls.forEach(img => grouped[key].images.add(img));

//     grouped[key].variants.push({
//       sku: item.sku,
//       price: parseFloat(item.salePrice).toFixed(2),
//       option1: item.colorName || "Default",
//       option2: item.sizeName || "Default",
//       inventory_quantity: item.qty || 0,
//       inventory_management: "shopify",
//       fulfillment_service: "manual",
//       taxable: true,
//       imageSrc: imageUrls[0] || null,

//       // pick primary image per variant
//     });

//     grouped[key].colorOptions.add(item.colorName);
//     grouped[key].sizeOptions.add(item.sizeName);
//   }

//   const shopifyProducts = [];

//   for (const key in grouped) {
//     const { base, variants, images, colorOptions, sizeOptions } = grouped[key];

//     // Split into chunks if more than 250 variants
//     const variantChunks = [];
//     for (let i = 0; i < variants.length; i += 250) {
//       variantChunks.push(variants.slice(i, i + 250));
//     }

//     variantChunks.forEach((variantGroup, index) => {
//       const handle = `${base.brandName}-${base.styleName}-${index}`.toLowerCase()
//         .replace(/\s+/g, '-')
//         .replace(/[^\w\-]+/g, '');

//       shopifyProducts.push({
//         title: `${base.brandName} ${base.styleName}`,
//         body_html: `
//           <p><strong>Brand:</strong> ${base.brandName}</p>
//           <p><strong>Style:</strong> ${base.styleName}</p>
//           <p><strong>Colors:</strong> ${Array.from(colorOptions).join(", ")}</p>
//         `,
//         vendor: base.brandName,
//         product_type: "Apparel",
//         tags: [base.colorFamily, base.baseCategoryID, base.brandName].filter(Boolean).join(", "),
//         handle,
//         options: [
//           { name: "Color", position: 1 },
//           { name: "Size", position: 2 }
//         ],
//         variants: variantGroup,
//         images: Array.from(images).map(src => ({
//           src,
//           altText: `${base.styleName}`
//         })),
//         status: "active",
//         metafields: [
//           {
//             namespace: "custom",
//             key: "images",
//             value: JSON.stringify(Array.from(images).map(src => ({
//               src,
//               altText: `${base.styleName}`
//             }))),
//             type: "json"
//           }
//         ]
//       });
//     });
//   }

//   return shopifyProducts;
// };


// -----------------
// exports.mapProducts = (ssProducts) => {
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

//     // Collect all available image paths
//     const imagePaths = [
//       item.colorFrontImage,
//       item.colorBackImage,
//       item.colorDirectSideImage,
//       item.colorSwatchImage,
//       item.colorOnModelFrontImage,
//       item.colorOnModelBackImage,
//       item.colorOnModelSideImage
//     ].filter(Boolean);

//     const imageUrls = imagePaths.map(
//       (img) => `https://cdn.ssactivewear.com/${img}`
//     );

//     console.log(`[📦 SKU ${item.sku}] Image URLs:`, imageUrls);

//     // Add all unique image URLs to the Set
//     imageUrls.forEach((img) => grouped[key].images.add(img));

//     // Add variant data
//     grouped[key].variants.push({
//       sku: item.sku,
//       price: parseFloat(item.salePrice).toFixed(2),
//       option1: item.colorName || "Default",
//       option2: item.sizeName || "Default",
//       inventory_quantity: item.qty || 0,
//       inventory_management: "shopify",
//       fulfillment_service: "manual",
//       taxable: true,
//       imageSrc: imageUrls[0] || null,
//       weight: parseFloat(item.unitWeight || item.caseWeight / item.caseQty || 0),
//       weight_unit: "POUNDS",
//       variantImages: imageUrls.map((src) => ({
//         src,
//         altText: `${item.colorName} ${item.sizeName}`,
//       })),
//     });

//     // Track available options
//     grouped[key].colorOptions.add(item.colorName);
//     grouped[key].sizeOptions.add(item.sizeName);
//   }

//   const shopifyProducts = [];

//   for (const key in grouped) {
//     const { base, variants, images, colorOptions, sizeOptions } = grouped[key];

//     // Chunk variants if needed (Shopify max 250 per product)
//     const variantChunks = [];
//     for (let i = 0; i < variants.length; i += 250) {
//       variantChunks.push(variants.slice(i, i + 250));
//     }

//     variantChunks.forEach((variantGroup, index) => {
//       const handle = `${base.brandName}-${base.styleName}-${index}`
//         .toLowerCase()
//         .replace(/\s+/g, "-")
//         .replace(/[^\w\-]+/g, "");

//       const allImages = Array.from(images).map((src) => ({
//         src,
//         altText: `${base.styleName}`,
//       }));

//       shopifyProducts.push({
//         title: `${base.brandName} ${base.styleName}`,
//         body_html: `
// <p><strong>Brand:</strong> ${base.brandName}</p>
// <p><strong>Style:</strong> ${base.styleName}</p>
// <p><strong>Colors:</strong> ${Array.from(colorOptions).join(", ")}</p>
//         `,
//         vendor: base.brandName,
//         product_type: "Apparel",
//         tags: [base.colorFamily, base.baseCategoryID, base.brandName]
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
//         ],
//       });

//       console.log(
//         `[✅ Product Created] ${base.brandName} ${base.styleName} (chunk ${index + 1})`
//       );
//       console.log(`[🖼 Total Images Included] ${allImages.length}`);
//     });
//   }

//   return shopifyProducts;
// };



exports.mapProducts = (ssProducts, specs = []) => {
  const grouped = {};

  for (const item of ssProducts) {
    const key = `${item.styleID}`; // Group by styleID

    if (!grouped[key]) {
      grouped[key] = {
        base: item,
        variants: [],
        images: new Set(),
        colorOptions: new Set(),
        sizeOptions: new Set(),
      };
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

    const imageUrls = imagePaths.map(
      (img) => `https://cdn.ssactivewear.com/${img}`
    );

    imageUrls.forEach((img) => grouped[key].images.add(img));

    // Match specs for this variant
    const matchingSpecs = specs.filter(
      (s) => s.styleID === item.styleID && s.sizeName === item.sizeName
    );

    const specMap = {};
    for (const spec of matchingSpecs) {
      const formattedKey = spec.specName.toLowerCase().replace(/\s+/g, "_");
      // Assuming these are numeric measurements, wrap in a JSON object
      specMap[formattedKey] = {
        value: isNaN(spec.value) ? spec.value : parseFloat(spec.value),
        unit: "in" // or change based on real units
      };
    }

    const variantMetafields = Object.keys(specMap).map((key) => ({
      namespace: "specs",
      key,
      value: JSON.stringify(specMap[key]),
      type: "json",
    }));

    // Add variant object
    grouped[key].variants.push({
      sku: item.sku,
      price: parseFloat(item.salePrice).toFixed(2),
      option1: item.colorName || "Default",
      option2: item.sizeName || "Default",
      inventory_quantity: item.qty || 0,
      inventory_management: "shopify",
      fulfillment_service: "manual",
      taxable: true,
      imageSrc: imageUrls[0] || null,
      weight: parseFloat(item.unitWeight || item.caseWeight / item.caseQty || 0),
      weight_unit: "POUNDS",
      variantImages: imageUrls.map((src) => ({
        src,
        altText: `${item.colorName} ${item.sizeName}`,
      })),
      metafields: variantMetafields,
    });

    grouped[key].colorOptions.add(item.colorName);
    grouped[key].sizeOptions.add(item.sizeName);
  }

  const shopifyProducts = [];

  for (const key in grouped) {
    const { base, variants, images, colorOptions } = grouped[key];

    const variantChunks = [];
    for (let i = 0; i < variants.length; i += 250) {
      variantChunks.push(variants.slice(i, i + 250));
    }

    variantChunks.forEach((variantGroup, index) => {
      const handle = `${base.brandName}-${base.styleName}-${index}`
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "");

      const allImages = Array.from(images).map((src) => ({
        src,
        altText: `${base.styleName}`,
      }));

      shopifyProducts.push({
        title: `${base.brandName} ${base.styleName}`,
        body_html: `
<p><strong>Brand:</strong> ${base.brandName}</p>
<p><strong>Style:</strong> ${base.styleName}</p>
<p><strong>Colors:</strong> ${Array.from(colorOptions).join(", ")}</p>
        `,
        vendor: base.brandName,
        product_type: "Apparel",
        tags: [base.colorFamily, base.baseCategoryID, base.brandName]
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
        ],
      });

      console.log(`[✅ Product Created] ${base.brandName} ${base.styleName} (chunk ${index + 1})`);
      console.log(`[🖼 Total Images Included] ${allImages.length}`);
    });
  }

  return shopifyProducts;
};

