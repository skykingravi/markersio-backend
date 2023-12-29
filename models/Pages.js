import mongoose from "mongoose";

const PageSchema = new mongoose.Schema({
    pageContent: {
        type: String,
    },
});

export const PageModel = new mongoose.model("pages", PageSchema);
