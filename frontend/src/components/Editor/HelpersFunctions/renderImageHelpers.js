import { store } from "../../../redux/store"
import { processAndReplaceColors, applyFilterAndGetUrl, invertColorsAndGetUrl, getBase64CanvasImage, replaceColorAndGetBase64 } from "../../ImageOperation/CanvasImageOperations";

function createRemoveBackgroundToggle(fabricImage, canvasId, removeBg, handleImage, globalDispatch) {
    // console.log("button data ", fabricImage, canvasId, callback, removeBg);
    const id = fabricImage.id;
    const buttonId = `canvas-${id}`;
    const canvasElement = document.getElementById(canvasId);
    if (!canvasElement) return;

    // Check if toggle already exists
    let container = document.getElementById(buttonId);
    if (container) {
        // console.log("container already exist so updating them");
        const center = fabricImage.getCenterPoint();
        const imageBottom = center.y + (fabricImage.getScaledHeight() / 2);
        const imageLeft = center.x;
        const OFFSET = 40;

        container.style.top = `${imageBottom + OFFSET}px`;
        container.style.left = `${imageLeft}px`;
        container.style.display = "none";

        const checkbox = container.querySelector('input[type="checkbox"]');
        const slider = container.querySelector(".slider");
        const circle = container.querySelector(".circle");

        if (checkbox) checkbox.checked = removeBg;


        if (slider && circle) {
            slider.style.backgroundColor = removeBg ? "#3b82f6" : "#ccc";
            circle.style.transform = removeBg ? "translateX(16px)" : "translateX(0)";
        }

        return;
    }

    // Create the toggle
    container = document.createElement("div");
    container.id = buttonId;
    Object.assign(container.style, {
        position: "absolute",
        zIndex: "99",
        transform: "translate(-50%, 0)",
        display: "none",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        borderRadius: "9999px",
        backgroundColor: "white",
        boxShadow: "0 0 4px rgba(0,0,0,0.1)",
        fontFamily: "sans-serif",
        fontSize: "10px",
        maxWidth: "95vw",
        // flexWrap: "wrap",
    });

    const textSpan1 = document.createElement("span");
    textSpan1.textContent = "Remove";
    textSpan1.style.fontWeight = "500";

    const aiBadge = document.createElement("span");
    aiBadge.textContent = "AI";
    Object.assign(aiBadge.style, {
        fontSize: "10px",
        padding: "1px 5px",
        borderRadius: "4px",
        backgroundImage: "linear-gradient(to right, #6C6CFF, #9CF8F8)",
        color: "white",
        fontWeight: "600",
    });

    const textSpan2 = document.createElement("span");
    textSpan2.textContent = "Background";
    textSpan2.style.fontWeight = "500";

    const label = document.createElement("div");
    label.style.display = "flex";
    label.style.alignItems = "center";
    label.style.gap = "3px";
    label.appendChild(textSpan1);
    label.appendChild(aiBadge);
    label.appendChild(textSpan2);

    const toggleWrapper = document.createElement("label");
    Object.assign(toggleWrapper.style, {
        position: "relative",
        display: "inline-block",
        width: "34px",
        height: "18px",
        cursor: "pointer",
        flexShrink: "0",
    });

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.style.opacity = "0";
    checkbox.style.width = "0";
    checkbox.style.height = "0";

    const slider = document.createElement("span");
    Object.assign(slider.style, {
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        backgroundColor: "#ccc",
        borderRadius: "9999px",
        transition: "0.2s",
    });

    const circle = document.createElement("span");
    Object.assign(circle.style, {
        position: "absolute",
        left: "2px",
        top: "2px",
        width: "14px",
        height: "14px",
        backgroundColor: "white",
        borderRadius: "50%",
        transition: "0.2s",
        boxShadow: "0 0 1px rgba(0,0,0,0.2)",
    });

    if (removeBg) {
        slider.style.backgroundColor = "#3b82f6";
        circle.style.transform = "translateX(16px)";
        checkbox.checked = true;
    } else {
        slider.style.backgroundColor = "#ccc";
        circle.style.transform = "translateX(0)";
        checkbox.checked = false;
    }

    checkbox.addEventListener("change", async (event) => {
        // console.log("Checkbox changed for image:", id);
        const state = store.getState();
        const activeSide = state.TextFrontendDesignSlice.activeSide;
        const images = state.TextFrontendDesignSlice.present[activeSide].images;
        const selectedImageId = state.TextFrontendDesignSlice.present[activeSide].selectedImageId;

        const currentImageObject = images.find((img) => img.id === selectedImageId);
        if (currentImageObject.loading) {
            return;
        }
        const addImageToolbarBgBtn = document.querySelector("#removeBackgroundInput");
        const currentSrc = fabricImage.src;

        const baseSrc = currentSrc.split('?')[0];
        let params = currentSrc.split('?')[1] ? currentSrc.split('?')[1].split('&') : [];

        const checked = event.target.checked; // ✅ use actual checkbox state
        // console.log("checked or not ", checked)

        // Update toggle UI
        slider.style.backgroundColor = checked ? "#3b82f6" : "#ccc";
        circle.style.transform = checked ? "translateX(16px)" : "translateX(0)";

        // Remove old bg-remove params
        params = params.filter(param => !param.startsWith("bg-remove="));

        // Add new param based on state
        params.push(`bg-remove=${checked}`);

        // Construct new URL
        const newTransform = params.length > 0 ? `?${params.join('&')}` : '';
        const newSrc = `${baseSrc}${newTransform}`;
        // console.log("New image src:", newSrc);

        // if (window.innerWidth <= 1200) {
        //   globalDispatch("loading", true, id);
        globalDispatch("src", newSrc, id);
        globalDispatch("removeBg", checked, id);
        console.log("currentImageObject before calling handleimage ", currentImageObject)
        await handleImage(newSrc, currentImageObject.singleColor, currentImageObject, currentImageObject.invertColor, currentImageObject.editColor, currentImageObject.extractedColors, globalDispatch, id)
        //   globalDispatch("base64CanvasImage", newSrc, id);

        //   globalDispatch("selectedFilter", "Normal", id);
        //   globalDispatch("loading", false, id);
        // }
        // else {
        //   globalDispatch("removeBgImagebtn", Math.random(), id);
        // }
        // Show loading state
        // globalDispatch("loading", true, id);
        // globalDispatch("loadingSrc", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdaMPJEC39w7gkdk_8CDYdbujh2-GcycSXeQ&s", id);

        // Update image source

        // fabricImage.setSrc(newSrc, () => {

        //   console.log("Image updated with new src:", newSrc);
        //   globalDispatch("removeBgImagebtn", checked, id);
        //   globalDispatch("loading", false, id);
        //   // globalDispatch("loadingSrc", null, id);
        //   // globalDispatch("src", newSrc, id);
        //   // globalDispatch("base64CanvasImage", newSrc, id);
        //   // globalDispatch("selectedFilter", "Normal", id);
        //   // globalDispatch("removeBg", checked, id);
        //   console.log("calling removeBgImagebtn", checked, id);
        //   canvas.renderAll();
        //   // globalDispatch("removeBgParamValue", checked ? "bg-remove=true" : "", id);
        //   if (callback) callback(checked, fabricImage);
        // }, { crossOrigin: "anonymous" });

        // Sync with toolbar checkbox
        const toolbarCheckbox = document.querySelector(`#addImageToolbarBgBtn`);
        console.log(toolbarCheckbox, "toolbarCheckbox");
        if (toolbarCheckbox) {
            toolbarCheckbox.checked = checked;
            const event = new Event('change');
            toolbarCheckbox.dispatchEvent(event);
        }
    });

    slider.classList.add("slider");
    circle.classList.add("circle");

    toggleWrapper.appendChild(checkbox);
    toggleWrapper.appendChild(slider);
    toggleWrapper.appendChild(circle);

    container.appendChild(label);
    container.appendChild(toggleWrapper);
    canvasElement.parentElement.appendChild(container);

    // Initial position below image
    const center = fabricImage.getCenterPoint();
    const imageBottom = center.y + fabricImage.getScaledHeight() / 2;
    const imageLeft = center.x;
    const OFFSET = 40;

    container.style.top = `${imageBottom + OFFSET}px`;
    container.style.left = `${imageLeft}px`;

    // console.warn("button created and done");
}
function createAiEditorButton(fabricImage, canvasId, removeBg, setOpenAieditorPopup, openAieditorPopup, handleImage, globalDispatch) {
    // console.log("button data ", fabricImage, canvasId, callback, removeBg);
    const id = fabricImage.id;
    const buttonId = `canvas-${id}-ai`;
    const canvasElement = document.getElementById(canvasId);
    if (!canvasElement) return;

    // Check if toggle already exists
    let container = document.getElementById(buttonId);
    if (container) {
        // console.log("container already exist so updating them");
        const center = fabricImage.getCenterPoint();
        const imageBottom = center.y + (fabricImage.getScaledHeight() / 2);
        const imageLeft = center.x;
        const OFFSET = 70;
        container.style.top = `${imageBottom + OFFSET}px`;
        container.style.left = `${imageLeft}px`;
        container.style.display = "none";
        // container.removeEventListener("click", () => { });

        container.addEventListener("click", (event) => {
            event.stopPropagation();

            if (!openAieditorPopup) {
                setOpenAieditorPopup(true);

            }
            // console.log("clicked ai btn",openAieditorPopup);
        }, false)
        return;
    }

    // Create the toggle
    container = document.createElement("div");
    container.id = buttonId;
    Object.assign(container.style, {
        position: "absolute",
        zIndex: "99",
        transform: "translate(-50%, 0)",
        // display: "none",
        alignItems: "center",
        gap: "6px",
        cursor: "pointer",
        padding: "4px 10px",
        borderRadius: "9999px",
        backgroundColor: "white",
        boxShadow: "0 0 4px rgba(0,0,0,0.1)",
        fontFamily: "sans-serif",
        fontSize: "10px",
        maxWidth: "95vw",
        pointerEvents: "auto"
        // flexWrap: "wrap",
    });

    const textSpan1 = document.createElement("span");
    textSpan1.textContent = "Image";
    textSpan1.style.fontWeight = "500";

    const aiBadge = document.createElement("span");
    aiBadge.textContent = "AI";
    Object.assign(aiBadge.style, {
        fontSize: "10px",
        padding: "1px 5px",
        borderRadius: "4px",
        backgroundImage: "linear-gradient(to right, #6C6CFF, #9CF8F8)",
        color: "white",
        fontWeight: "600",
    });

    const textSpan2 = document.createElement("span");
    textSpan2.textContent = "Editor";
    textSpan2.style.fontWeight = "500";

    const label = document.createElement("div");
    label.style.display = "flex";
    label.style.alignItems = "center";
    label.style.gap = "3px";
    label.appendChild(aiBadge);
    label.appendChild(textSpan1);
    label.appendChild(textSpan2);


    container.appendChild(label);

    container.addEventListener("click", (event) => {
        event.stopPropagation();

        if (!openAieditorPopup) {
            setOpenAieditorPopup(true);

        }
        // console.log("clicked ai btn",openAieditorPopup);
    }, false)
    canvasElement.parentElement.appendChild(container);

    // Initial position below image
    const center = fabricImage.getCenterPoint();
    const imageBottom = center.y + fabricImage.getScaledHeight() / 2;
    const imageLeft = center.x;
    const OFFSET = 40;

    container.style.top = `${imageBottom + OFFSET}px`;
    container.style.left = `${imageLeft}px`;

    // console.warn("button created and done");
}
function createLoaderOverlay(fabricImage, canvasId) {
    const id = fabricImage.id;
    const loaderId = `loader-${id}`;
    const canvasElement = document.getElementById(canvasId);
    if (!canvasElement) return;

    let loader = document.getElementById(loaderId);

    // Compute scaled size (adjust multiplier as needed)
    const scaledWidth = fabricImage.getScaledWidth();
    const scaledHeight = fabricImage.getScaledHeight();
    const loaderSize = Math.min(scaledWidth, scaledHeight) * 0.3; // 30% of smaller dimension

    if (!loader) {
        loader = document.createElement("div");
        loader.id = loaderId;

        Object.assign(loader.style, {
            position: "absolute",
            zIndex: "1000",
            border: "4px solid #e0e0e0",
            borderTop: "4px solid #3b82f6",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            pointerEvents: "none",
        });

        if (!document.getElementById("loader-style")) {
            const style = document.createElement("style");
            style.id = "loader-style";
            style.innerHTML = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
            document.head.appendChild(style);
        }

        canvasElement.parentElement.appendChild(loader);
    }

    // Apply dynamic size
    loader.style.width = `${loaderSize}px`;
    loader.style.height = `${loaderSize}px`;
    loader.style.borderWidth = `${Math.max(loaderSize * 0.1, 2)}px`;

    // Center of image on screen
    const center = fabricImage.getCenterPoint();
    const zoom = fabricImage.canvas.getZoom();
    const viewportTransform = fabricImage.canvas.viewportTransform;

    const left = center.x * zoom + viewportTransform[4] - loaderSize / 2;
    const top = center.y * zoom + viewportTransform[5] - loaderSize / 2;

    loader.style.left = `${left}px`;
    loader.style.top = `${top}px`;
    loader.style.display = "block";
}
async function handleImage(imageSrc, color = "#ffffff", currentImageObject, invertColor, editColor, extractedColors, globalDispatch, id) {
    try {
        const selectedFilter = currentImageObject.selectedFilter;
        globalDispatch("loading", true, id);
        globalDispatch("editColor", false, id)
        // console.log("handle image function called with src", imageSrc, color, selectedFilter, invertColor, editColor, globalDispatch, id);

        let currentBase64Image;

        let normalColorImage, singleColorImage, blackWhiteColorImage;
        // const newfilters = updateFilter();

        const baseUrl = imageSrc.split("?")[0] || "";
        const params = imageSrc.split("?")[1] || ""
        const filteredParams = params.replace("sat=-100", "");
        // console.log("params", params, "filteredParams", filteredParams)

        const normalSrc = baseUrl + "?" + filteredParams
        const singleSrc = baseUrl + "?" + filteredParams
        const blackAndWhiteSrc = baseUrl + "?" + params + (!params.includes("sat=-100") ? "&sat=-100" : "")
        const allTransformImage = [normalSrc, singleSrc, blackAndWhiteSrc];

        console.log("curent seleteced filter is ", selectedFilter)
        // console.log("stored seletected filter is ", img.selectedFilter)

        // for normal color image
        // if (editColor) {
        //   normalColorImage = await processAndReplaceColors(allTransformImage[0], color, editColor, extractedColors);
        // }
        // else {
        // }
        normalColorImage = await getBase64CanvasImage(allTransformImage[0], color)

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

        if (currentImageObject.selectedFilter == "Single Color") {
            currentBase64Image = singleColorImage;
        }
        else if (currentImageObject.selectedFilter == "Normal") {
            currentBase64Image = normalColorImage;
        }
        else {
            currentBase64Image = blackWhiteColorImage;
        }

        // Dispatch the base64 string to your global state (no need to convert it to a string again)
        globalDispatch("base64CanvasImage", currentBase64Image, id);
        globalDispatch("base64CanvasImageForNormalColor", String(normalColorImage), id);
        globalDispatch("base64CanvasImageForSinglelColor", String(singleColorImage), id);
        globalDispatch("base64CanvasImageForBlackAndWhitelColor", String(blackWhiteColorImage), id);
        // Set loading to false after the process is done
        globalDispatch("loading", false, id); // Corrected the typo here
    } catch (error) {
        globalDispatch("loading", false, id); // Ensure loading is stopped even in case of error
        console.error("Error:", error); // Log any errors that occur
    }
}
function removeAllHtmlControls(canvas) {

    canvas.getObjects().forEach((obj) => {
        if (obj._htmlControls) {
            for (const key in obj._htmlControls) {
                const el = obj._htmlControls[key];
                if (el?.parentNode) el.parentNode.removeChild(el);
            }
            obj._htmlControls = null;
        }
    });

    document.querySelectorAll('[data-fabric-control]').forEach(el => el.remove());
}
function updateButtonPosition(existingObj, id) {
    const button = document.getElementById(`canvas-${id}`);
    const aibutton = document.getElementById(`canvas-${id}-ai`);
    if (button) {
        const center = existingObj.getCenterPoint();
        const imageBottom = center.y + (existingObj.getScaledHeight() / 2);
        const imageLeft = center.x;
        const OFFSET = 40;
        button.style.top = `${imageBottom + OFFSET}px`;
        button.style.left = `${imageLeft}px`;
    }
    if (aibutton) {
        const center = existingObj.getCenterPoint();
        const imageBottom = center.y + (existingObj.getScaledHeight() / 2);
        const imageLeft = center.x;
        const OFFSET = 70;
        aibutton.style.top = `${imageBottom + OFFSET}px`;
        aibutton.style.left = `${imageLeft}px`;
    }
}
export { createAiEditorButton, createRemoveBackgroundToggle, createLoaderOverlay, handleImage, removeAllHtmlControls, updateButtonPosition }