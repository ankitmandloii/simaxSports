// models/Settings.js
const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  settingsForTextSection: {
    sideBarTextSection: { type: Boolean },
    textEditor: { type: Boolean },
    font: { type: Boolean },
    color: { type: Boolean },
    outline: { type: Boolean },
    size: { type: Boolean },
    arc: { type: Boolean },
    rotate: { type: Boolean },
    spacing: { type: Boolean },
    center: { type: Boolean },
    layering: { type: Boolean },
    flip: { type: Boolean },
    lock: { type: Boolean },
    boldItalic: { type: Boolean },
    duplicate: { type: Boolean }
  },
  settingsforAddNamesAndNumbers: {
    sideBarAddNamesAndNumbersSection: { type: Boolean },
    addNames: { type: Boolean },
    addNumbers: { type: Boolean },
    sideSelection: { type: Boolean },
    sizeSelection: { type: Boolean },
    fontSelector: { type: Boolean },
    colorPicker: { type: Boolean },
    submitButton: { type: Boolean }
  },
  settingsforAddArtSection: {
    sideBarAddArtSection: { type: Boolean },
    addArt: { type: Boolean },
    artSelection: { type: Boolean },
    sizeSelection: { type: Boolean },
    fontSelector: { type: Boolean },
    colorPicker: { type: Boolean },
    submitButton: { type: Boolean }
  },
  uploadSettings: {
    sideBarImageUploadSection: { type: Boolean },
    enableDragAndDrop: { type: Boolean },
    enableShareButton: { type: Boolean },
    enableGoogleDrive: { type: Boolean },
    enableDropbox: { type: Boolean }
  },
  artworkEditorSettings: {
    Filter: { type: Boolean },
    editColors: { type: Boolean },
    removeBackgroundAI: { type: Boolean },
    cropTrim: { type: Boolean },
    superResolution: { type: Boolean },
    replaceBackgroundAI: { type: Boolean },
    sizeSlider: { type: Boolean },
    rotateSlider: { type: Boolean },
    centerButton: { type: Boolean },
    layeringButton: { type: Boolean },
    flipButton: { type: Boolean },
    lockButton: { type: Boolean },
    duplicateButton: { type: Boolean }
  },
  otherSettings: {
    enableZoomFeature: { type: Boolean },
    enableSleevesShow: { type: Boolean },
    enableFrontSmallImageSectionShow: { type: Boolean },
    enableBackSmallImageSectionShow: { type: Boolean },
    enableMainImageSectionShow: { type: Boolean }
  }
}, { timestamps: true });

module.exports = mongoose.model('AdminSettings', SettingsSchema);
