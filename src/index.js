import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { userRouter } from "../routes/users.js";
import { editorRouter } from "../routes/editor.js";
import { contactRouter } from "../routes/contact.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use("/auth", userRouter);
app.use("/editor", editorRouter);
app.use("/contact", contactRouter);

mongoose
    .connect(process.env.URL)
    .then(() => console.log("DB Connected !"))
    .catch((err) => console.error(err));

app.listen(PORT, () => {
    console.log(`SERVER STARTED AT PORT - ${PORT}`);
});
