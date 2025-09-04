import { toast } from "react-toastify";
import { apiConnecter } from "./apiConnector";

export const fetchDesign = async (customerEmail) => {
    try {
        // setIsFetchingDesign(true);
        const response = await apiConnecter(
            "GET",
            "design/get-designfrontEnd",
            null,
            null,
            { ownerEmail: customerEmail }
        );

        const data = response.data;
        console.log("Fetched designs:", data);
        return data;

        // Check if the design with the given designId exists
        // const designFound = data.userDesigns?.designs?.some(
        //     (design) => design._id === designId
        // );
        // setDesignExists(designFound);
    } catch (error) {
        console.error("Error fetching design:", error);
        toast.error("Failed to fetch design.");
        // setDesignExists(false);
    } finally {
        // setIsFetchingDesign(false);
    }
};

// Upload blob data to Cloudinary
export const uploadBlobData = async (blobDataArray) => {
    try {
        const chunkSize = 4;
        const results = [];

        // break array into chunks of 4
        for (let i = 0; i < blobDataArray.length; i += chunkSize) {
            const chunk = blobDataArray.slice(i, i + chunkSize);

            const formData = new FormData();
            chunk.forEach((blob, index) => {
                formData.append(`image_${i + index}`, blob, `image_${i + index}.png`);
            });

            const response = await apiConnecter(
                "POST",
                "imageOperation/fileBlobDataUploadToCloudinary",
                formData
            );

            const responseData = response.data;
            console.log(`Response from backend for chunk ${i / chunkSize + 1}:`, responseData);

            results.push(responseData);
        }

        // merge all results into one object
        const merged = {
            files: results.flatMap((r) => r.files || []),
        };

        // localStorage.setItem("data", JSON.stringify(merged));
        return merged;
    } catch (e) {
        console.error("Error uploading blob data in chunks:", e);
        throw e;
    }
};


// Save design to the backend
export const saveDesignFunction = async (payload) => {
    try {
        const response = await apiConnecter(
            "POST",
            "design/save-designfrontEnd",
            payload
        );

        const responseData = response.data;
        console.log("Design saved successfully:", responseData);
        return responseData;
    } catch (error) {
        console.error("Error saving design:", error);
        throw error;
    }
};
// Send Email
export const sendEmailDesign = async (payload) => {
    try {
        const response = await apiConnecter(
            "POST",
            "design/send-email-design",
            payload
        );
        console.log("Email sent successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending email:", error);
        toast.error("Failed to send email.");
        throw error;
    }
}

// update design payload
export const updateDesignFunction = async (payload) => {
    try {
        // const response = await fetch('https://simax-sports-x93p.vercel.app/api/design/updateDesignFromFrontEnd', {
        //     method: 'PATCH',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(payload),
        // });
        const response = await apiConnecter(
            "PATCH",
            "design/updateDesignFromFrontEnd",
            payload
        );

        const responseData = response.data;
        console.log("Design updated successfully:", responseData);
        return responseData;
    } catch (error) {
        throw new Error(`Failed to update design: ${error.message}`);
    }
};