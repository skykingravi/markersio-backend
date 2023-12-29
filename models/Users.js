import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    userPassword: {
        type: String,
        required: true,
    },
    createdNotebooks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "notebooks",
        },
    ],
});

export const UserModel = new mongoose.model("users", UserSchema);
