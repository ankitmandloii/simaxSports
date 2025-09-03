import mongoose from "mongoose";

const nameAndNumberPrintAreaSchma = new mongoose.Schema({
    color: { type: String, required: true },
    size: { type: String, required: true },
    name: { type: String, required: true },   // player name or custom text
    number: { type: String, required: true }, // jersey number or custom number
    fontSize: { type: Number, default: 14 },
    fontFamily: { type: String, default: "Arial" },
    printSide: {
        type: String,
        enum: ["front", "back", "leftSleeve", "rightSleeve"],
        default: "front"
    },
    id: { type: String, required: true }, // product ID or selection ID
    position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true }
    }
});

const nameAndNumberPrintArea = mongoose.model("nameAndNumberPrintAreaSchma", nameAndNumberPrintAreaSchma);

export default nameAndNumberPrintArea;
