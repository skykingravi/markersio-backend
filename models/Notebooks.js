import mongoose from "mongoose";

const NotebookSchema = new mongoose.Schema({
    notebookHeading: {
        type: String,
    },
    notebookDescription: {
        type: String,
    },
    notebookCreationDetails: {
        type: String,
    },
    notebookBackgroundColor: {
        type: String,
    },
    notebookColors: [
        {
            type: String,
        },
    ],
    notebookCurrentColor: {
        type: Number,
    },
    notebookCurrentPageNo: {
        type: Number,
    },
    notebookStrokeSize: {
        type: Number,
    },
    createdPages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "pages",
        },
    ],
});

export const NotebookModel = new mongoose.model("notebooks", NotebookSchema);
