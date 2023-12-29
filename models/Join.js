import mongoose from "mongoose";

const JoinSchema = new mongoose.Schema({
    joinEmail: {
        type: String,
        required: true,
    },
});

export const JoinModel = new mongoose.model("join", JoinSchema);
