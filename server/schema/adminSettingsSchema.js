// models/Settings.js
const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  settingsForTextSection: {
    sideBarTextSection: { type: Boolean },
    // textEditor: { type: Boolean },
    // font: { type: Boolean },
    // color: { type: Boolean },
    // outline: { type: Boolean },
    // size: { type: Boolean },
    // arc: { type: Boolean },
    // rotate: { type: Boolean },
    // spacing: { type: Boolean },
    // center: { type: Boolean },
    // layering: { type: Boolean },
    // flip: { type: Boolean },
    // lock: { type: Boolean },
    // boldItalic: { type: Boolean },
    // duplicate: { type: Boolean }
  },
  settingsforAddNamesAndNumbers: {
    sideBarAddNamesAndNumbersSection: { type: Boolean },
    // addNames: { type: Boolean },
    // addNumbers: { type: Boolean },
    // sideSelection: { type: Boolean },
    // sizeSelection: { type: Boolean },
    // fontSelector: { type: Boolean },
    // colorPicker: { type: Boolean },
    // submitButton: { type: Boolean }
  },
  settingsforAddArtSection: {
    sideBarAddArtSection: { type: Boolean },
    // addArt: { type: Boolean },
    // artSelection: { type: Boolean },
    // sizeSelection: { type: Boolean },
    // fontSelector: { type: Boolean },
    // colorPicker: { type: Boolean },
    // submitButton: { type: Boolean }
  },
  uploadSettings: {
    sideBarImageUploadSection: { type: Boolean },
    // enableDragAndDrop: { type: Boolean },
    // enableShareButton: { type: Boolean },
    enableGoogleDrive: { type: Boolean },
    enableDropbox: { type: Boolean }
  },
  artworkEditorSettings: {
    // Filter: { type: Boolean },
    // editColors: { type: Boolean },
    removeBackgroundAI: { type: Boolean },
    // cropTrim: { type: Boolean },
    // superResolution: { type: Boolean },
    replaceBackgroundAI: { type: Boolean },
    // sizeSlider: { type: Boolean },
    // rotateSlider: { type: Boolean },
    // centerButton: { type: Boolean },
    // layeringButton: { type: Boolean },
    // flipButton: { type: Boolean },
    // lockButton: { type: Boolean },
    // duplicateButton: { type: Boolean }
  },
  otherSettings: {
    enableZoomFeature: { type: Boolean },
    enableSleevesShow: { type: Boolean },
    // enableFrontSmallImageSectionShow: { type: Boolean },
    enableBackSmallImageSectionShow: { type: Boolean },
    // enableMainImageSectionShow: { type: Boolean }
  }
}, { timestamps: true });


const AdminSettings = mongoose.model('AdminSettings', SettingsSchema);
module.exports = AdminSettings;


/*

{
    "settingsForTextSection": {
        "sideBarTextSection": true,
        "textEditor": true,
        "font": true,
        "color": true,
        "outline": true,
        "size": true,
        "arc": true,
        "rotate": true,
        "spacing": true,
        "center": true,
        "layering": true,
        "flip": true,
        "lock": true,
        "boldItalic": true,
        "duplicate": true
    },
    "settingsforAddNamesAndNumbers": {
        "sideBarAddNamesAndNumbersSection": true,
        "addNames": true,
        "addNumbers": true,
        "sideSelection": true,
        "sizeSelection": true,
        "fontSelector": true,
        "colorPicker": true,
        "submitButton": true
    },
    "settingsforAddArtSection": {
        "sideBarAddArtSection": true,
        "addArt": true,
        "artSelection": true,
        "sizeSelection": true,
        "fontSelector": true,
        "colorPicker": true,
        "submitButton": true
    },
    "uploadSettings": {
        "sideBarImageUploadSection": true,
        "enableDragAndDrop": true,
        "enableShareButton": true,
        "enableGoogleDrive": true,
        "enableDropbox": true
    },
    "artworkEditorSettings": {
        "Filter": true,
        "editColors": true,
        "removeBackgroundAI": true,
        "cropTrim": true,
        "superResolution": true,
        "replaceBackgroundAI": true,
        "sizeSlider": true,
        "rotateSlider": true,
        "centerButton": true,
        "layeringButton": true,
        "flipButton": true,
        "lockButton": true,
        "duplicateButton": false
    },
    "otherSettings": {
        "enableZoomFeature": true,
        "enableSleevesShow": true,
        "enableFrontSmallImageSectionShow": true,
        "enableBackSmallImageSectionShow": true,
        "enableMainImageSectionShow": true
    }
}

*/