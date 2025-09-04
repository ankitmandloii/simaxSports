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
        const formData = new FormData();
        // blobDataArray = blobDataArray.slice(0, 6);
        blobDataArray.forEach((blob, index) => {
            formData.append(`image_${index}`, blob, `image_${index}.png`);
        });

        const response = await apiConnecter(
            "POST",
            "imageOperation/fileBlobDataUploadToCloudinary",
            formData
        );

        const responseData = response.data;
        console.log("Response from backend:", responseData);
        localStorage.setItem("data", JSON.stringify(responseData));
        return responseData;
    } catch (e) {
        console.error("Error uploading blob data:", e);
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