import Exif from 'exif-js';

export const getImageDpi = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                Exif.getData(img, function () {
                    const xResolution = Exif.getTag(this, 'XResolution') || [96, 1]; // Default 96 DPI if not found
                    const yResolution = Exif.getTag(this, 'YResolution') || [96, 1];
                    const dpi = Math.round(xResolution[0] / xResolution[1]); // Convert rational to integer
                    resolve(dpi);
                });
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
};

