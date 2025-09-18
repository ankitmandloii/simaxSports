import { applyFilterAndGetUrl, invertColorsAndGetUrl, processAndReplaceColors, getBase64CanvasImage, replaceColorAndGetBase64 } from "../ImageOperation/CanvasImageOperations";

async function handleImage(imageSrc, color = "#ffffff", selectedFilter, invertColor, editColor, extractedColors) {
    try {

        console.log("handle image function called with src", imageSrc, color, selectedFilter, invertColor, editColor);

        let currentBase64Image;
        let normalColorImage, singleColorImage, blackWhiteColorImage;
        const baseUrl = imageSrc.split("?")[0] || "";
        const params = imageSrc.split("?")[1] || ""
        const filteredParams = params.replace("sat=-100", "");
        console.log("params", params, "filteredParams", filteredParams)

        const normalSrc = baseUrl + "?" + filteredParams
        const singleSrc = baseUrl + "?" + filteredParams
        const blackAndWhiteSrc = baseUrl + "?" + params + (!params.includes("sat=-100") ? "&sat=-100" : "")
        const allTransformImage = [normalSrc, singleSrc, blackAndWhiteSrc];


        // for normal color image
        if (editColor) {
            normalColorImage = await processAndReplaceColors(allTransformImage[0], color, editColor, extractedColors);
        }
        else {
            normalColorImage = await getBase64CanvasImage(allTransformImage[0], color)
        }

        //for single color image
        if (invertColor) {
            const applyFilterURL = await applyFilterAndGetUrl(allTransformImage[1], color);
            singleColorImage = await invertColorsAndGetUrl(applyFilterURL || allTransformImage[1]);
        }
        else {
            singleColorImage = await applyFilterAndGetUrl(allTransformImage[1], color);
        }

        // for black and white image
        blackWhiteColorImage = await getBase64CanvasImage(allTransformImage[2], color)

        if (selectedFilter == "Single Color") {
            currentBase64Image = singleColorImage;
        }
        else if (selectedFilter == "Normal") {
            currentBase64Image = normalColorImage;
        }
        else {
            currentBase64Image = blackWhiteColorImage;
        }

        return [currentBase64Image, normalColorImage, singleColorImage, blackWhiteColorImage]


    } catch (error) {
        console.error("Error:", error); // Log any errors that occur
    }
}
async function transformReduxState(state) {
    try {
        if (!state?.TextFrontendDesignSlice) {
            return state;
        }

        const sides = ["front", "back", "leftSleeve", "rightSleeve"];

        const newState = JSON.parse(JSON.stringify(state));
        const slice = newState.TextFrontendDesignSlice;

        const transformImagesArray = async (images = []) =>
            Array.isArray(images)
                ? await Promise.all(
                    images.map(async (img) => {
                        if (img && typeof img === "object" && img.src) {
                            const AllDesignImage = await handleImage(
                                img.src,
                                img.Singlecolor,
                                img.selectedFilter,
                                img.invertColor,
                                img.editColor,
                                img.extractedColors
                            );
                            img.base64CanvasImage = AllDesignImage[0]
                            img.base64CanvasImageForNormalColor = AllDesignImage[1]
                            img.base64CanvasImageForSinglelColor = AllDesignImage[2]
                            img.base64CanvasImageForBlackAndWhitelColor = AllDesignImage[3]
                        }
                        return img;
                    })
                )
                : [];

        // Process only present state
        for (const side of sides) {
            if (slice.present?.[side]?.images) {
                slice.present[side].images = await transformImagesArray(
                    slice.present[side].images
                );
            }
        }

        // 🔹 Reset past and future correctly (object with side arrays)
        slice.past = sides.reduce((acc, side) => {
            acc[side] = [];
            return acc;
        }, {});

        slice.future = sides.reduce((acc, side) => {
            acc[side] = [];
            return acc;
        }, {});

        return newState;
    } catch (err) {
        console.error("Error during Redux state transformation:", err);
        return state;
    }
}



export default transformReduxState