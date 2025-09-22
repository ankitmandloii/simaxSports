import axios from "axios";
async function blobUrlToFile(blobUrl, filename = "canvas.png") {
    const response = await fetch(blobUrl);   // fetch blob data
    const blob = await response.blob();      // convert to blob
    return new File([blob], filename, { type: blob.type });
}
export async function uploadImagesInBatches(allImages, batchSize = 2) {
    const uploadedImageUrls = [];

    // Convert all base64 to File objects first
    const files = [];
    for (let i = 0; i < allImages.length; i++) {
        const blobUrl = allImages[i].base64CanvasImage;
        if (!blobUrl) continue;

        const file = await blobUrlToFile(blobUrl, `${allImages[i].id}.png`);
        files.push(file);
    }

    // Upload in batches of 2
    for (let i = 0; i < files.length; i += batchSize) {
        const batchFiles = files.slice(i, i + batchSize);

        const formData = new FormData();
        batchFiles.forEach((file) => formData.append("images", file));

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}imageOperation/upload`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            // Assuming your server returns an array of uploaded URLs
            const batchUrls = response.data.files;
            uploadedImageUrls.push(...batchUrls);
            console.log(`Uploaded batch ${i + 1}-${i + batchFiles.length}`, batchUrls);

        } catch (error) {
            console.error(`Error uploading batch ${i + 1}-${i + batchFiles.length}`, error);
            throw error;
        }
    }

    return uploadedImageUrls; // final array of all S3 URLs
}
