import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
    contactName: {
        type: String,
        required: true,
    },
    contactEmail: {
        type: String,
        required: true,
    },
    contactMessage: {
        type: String,
        required: true,
    },
});

export const ContactModel = new mongoose.model("contact", ContactSchema);
