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
// export const uploadBlobData = async (blobDataArray) => {
//     try {
//         const chunkSize = 4;
//         const results = [];

//         // break array into chunks of 4
//         for (let i = 0; i < blobDataArray.length; i += chunkSize) {
//             const chunk = blobDataArray.slice(i, i + chunkSize);

//             const formData = new FormData();
//             chunk.forEach((blob, index) => {
//                 formData.append(`image_${i + index}`, blob, `image_${i + index}.png`);
//             });

//             const response = await apiConnecter(
//                 "POST",
//                 "imageOperation/fileBlobDataUploadToCloudinary",
//                 formData
//             );

//             const responseData = response.data;
//             console.log(`Response from backend for chunk ${i / chunkSize + 1}:`, responseData);

//             results.push(responseData);
//         }

//         // merge all results into one object
//         const merged = {
//             files: results.flatMap((r) => r.files || []),
//         };

//         // localStorage.setItem("data", JSON.stringify(merged));
//         return merged;
//     } catch (e) {
//         console.error("Error uploading blob data in chunks:", e);
//         throw e;
//     }
// };
export const uploadBlobData = async (blobDataArray) => {
    try {
        const chunkSize = 2; // you can reduce to 2 or 1 if hitting 413 errors
        const results = [];

        // break array into chunks
        for (let i = 0; i < blobDataArray.length; i += chunkSize) {
            const chunk = blobDataArray.slice(i, i + chunkSize);

            const formData = new FormData();
            let chunkTotalSize = 0;

            chunk.forEach((blob, index) => {
                const sizeMB = (blob.size / 1024 / 1024).toFixed(2);
                // console.log(`➡️ Image ${i + index} size: ${blob.size} bytes (${sizeMB} MB)`);

                chunkTotalSize += blob.size;
                formData.append(`image_${i + index}`, blob, `image_${i + index}.png`);
            });

            // console.log(
            //     `📦 Chunk ${i / chunkSize + 1} total size: ${(chunkTotalSize / 1024 / 1024).toFixed(2)} MB`
            // );

            const response = await apiConnecter(
                "POST",
                "imageOperation/fileBlobDataUploadToCloudinary",
                formData
            );

            const responseData = response.data;
            // console.log(`✅ Response from backend for chunk ${i / chunkSize + 1}:`, responseData);

            results.push(responseData);
        }

        // merge all results into one object
        const merged = {
            files: results.flatMap((r) => r.files || []),
        };

        // console.log("🎯 Final merged upload result:", merged);
        return merged;
    } catch (e) {
        console.error("❌ Error uploading blob data in chunks:", e);
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
        console.log("Payload for updating design:", payload);
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

// normailize to check design change
export const normalizeObject = (obj) => {
    const normalized = {
        present: {
            front: {
                texts: (obj.present?.front?.texts || []).map(t => ({
                    content: t.content || '',
                    fontFamily: t.fontFamily || '',
                    fontSize: t.fontSize || 0,
                    fontStyle: t.fontStyle || 'normal',
                    fontWeight: t.fontWeight || 'normal',
                    textColor: t.textColor || '#000000',
                    position: t.position ? { x: t.position.x, y: t.position.y } : { x: 0, y: 0 },
                    angle: t.angle || 0,
                    arc: t.arc || 0,
                    center: t.center || 'center',
                    flipX: t.flipX || false,
                    flipY: t.flipY || false,
                    scaleX: t.scaleX || 1,
                    scaleY: t.scaleY || 1,
                    width: t.width || 0,
                    height: t.height || 0,
                    outline: t.outline || 'none',
                    outLineColor: t.outLineColor || '',
                    outLineSize: t.outLineSize || 0.5,
                    spacing: t.spacing || 1,
                    size: t.size || 1,
                })),
                images: (obj.present?.front?.images || []).map(i => ({
                    src: i.src || '',
                    position: i.position ? { x: i.position.x, y: i.position.y } : { x: 0, y: 0 },
                    angle: i.angle || 0,
                    scaleX: i.scaleX || 1,
                    scaleY: i.scaleY || 1,
                    width: i.width || 0,
                    height: i.height || 0,
                })),
            },
            back: {
                texts: (obj.present?.back?.texts || []).map(t => ({
                    content: t.content || '',
                    fontFamily: t.fontFamily || '',
                    fontSize: t.fontSize || 0,
                    fontStyle: t.fontStyle || 'normal',
                    fontWeight: t.fontWeight || 'normal',
                    textColor: t.textColor || '#000000',
                    position: t.position ? { x: t.position.x, y: t.position.y } : { x: 0, y: 0 },
                    angle: t.angle || 0,
                    arc: t.arc || 0,
                    center: t.center || 'center',
                    flipX: t.flipX || false,
                    flipY: t.flipY || false,
                    scaleX: t.scaleX || 1,
                    scaleY: t.scaleY || 1,
                    width: t.width || 0,
                    height: t.height || 0,
                    outline: t.outline || 'none',
                    outLineColor: t.outLineColor || '',
                    outLineSize: t.outLineSize || 0.5,
                    spacing: t.spacing || 1,
                    size: t.size || 1,
                })),
                images: (obj.present?.back?.images || []).map(i => ({
                    src: i.src || '',
                    position: i.position ? { x: i.position.x, y: i.position.y } : { x: 0, y: 0 },
                    angle: i.angle || 0,
                    scaleX: i.scaleX || 1,
                    scaleY: i.scaleY || 1,
                    width: i.width || 0,
                    height: i.height || 0,
                })),
            },
            leftSleeve: {
                texts: (obj.present?.leftSleeve?.texts || []).map(t => ({
                    content: t.content || '',
                    fontFamily: t.fontFamily || '',
                    fontSize: t.fontSize || 0,
                    fontStyle: t.fontStyle || 'normal',
                    fontWeight: t.fontWeight || 'normal',
                    textColor: t.textColor || '#000000',
                    position: t.position ? { x: t.position.x, y: t.position.y } : { x: 0, y: 0 },
                    angle: t.angle || 0,
                    arc: t.arc || 0,
                    center: t.center || 'center',
                    flipX: t.flipX || false,
                    flipY: t.flipY || false,
                    scaleX: t.scaleX || 1,
                    scaleY: t.scaleY || 1,
                    width: t.width || 0,
                    height: t.height || 0,
                    outline: t.outline || 'none',
                    outLineColor: t.outLineColor || '',
                    outLineSize: t.outLineSize || 0.5,
                    spacing: t.spacing || 1,
                    size: t.size || 1,
                })),
                images: (obj.present?.leftSleeve?.images || []).map(i => ({
                    src: i.src || '',
                    position: i.position ? { x: i.position.x, y: i.position.y } : { x: 0, y: 0 },
                    angle: i.angle || 0,
                    scaleX: i.scaleX || 1,
                    scaleY: i.scaleY || 1,
                    width: i.width || 0,
                    height: i.height || 0,
                })),
            },
            rightSleeve: {
                texts: (obj.present?.rightSleeve?.texts || []).map(t => ({
                    content: t.content || '',
                    fontFamily: t.fontFamily || '',
                    fontSize: t.fontSize || 0,
                    fontStyle: t.fontStyle || 'normal',
                    fontWeight: t.fontWeight || 'normal',
                    textColor: t.textColor || '#000000',
                    position: t.position ? { x: t.position.x, y: t.position.y } : { x: 0, y: 0 },
                    angle: t.angle || 0,
                    arc: t.arc || 0,
                    center: t.center || 'center',
                    flipX: t.flipX || false,
                    flipY: t.flipY || false,
                    scaleX: t.scaleX || 1,
                    scaleY: t.scaleY || 1,
                    width: t.width || 0,
                    height: t.height || 0,
                    outline: t.outline || 'none',
                    outLineColor: t.outLineColor || '',
                    outLineSize: t.outLineSize || 0.5,
                    spacing: t.spacing || 1,
                    size: t.size || 1,
                })),
                images: (obj.present?.rightSleeve?.images || []).map(i => ({
                    src: i.src || '',
                    position: i.position ? { x: i.position.x, y: i.position.y } : { x: 0, y: 0 },
                    angle: i.angle || 0,
                    scaleX: i.scaleX || 1,
                    scaleY: i.scaleY || 1,
                    width: i.width || 0,
                    height: i.height || 0,
                })),
            },
        },
        DesignNotes: {
            FrontDesignNotes: obj.DesignNotes?.FrontDesignNotes || '',
            BackDesignNotes: obj.DesignNotes?.BackDesignNotes || '',
            ExtraInfo: obj.DesignNotes?.ExtraInfo || '',
        },
        NamesAndNumberPrintAreas: (obj.NamesAndNumberPrintAreas || []).map(area => ({
            color: area.color || '',
            size: area.size || '',
            name: area.name || '',
            number: area.number || '',
            fontSize: area.fontSize || 0,
            fontColor: area.fontColor || '#000000',
            fontFamily: area.fontFamily || '',
            position: area.position || '',
            printSide: area.printSide || 'back',
        })),
    };
    return JSON.stringify(normalized);
};