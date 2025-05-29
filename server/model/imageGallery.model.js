const mongoose = require("mongoose");

const imageGallerySchema = new mongoose.Schema({
    partnerId: {
        type: mongoose.Types.ObjectId,
    },
    imgScr: {
        type: String
    },
},
    { 'timestamps': true }

);

const ImageGallery = mongoose.model("ImageGallery", imageGallerySchema);

module.exports = ImageGallery;