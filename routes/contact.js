import express from "express";
import { ContactModel } from "../models/Contact.js";
import { JoinModel } from "../models/Join.js";

const router = express.Router();

router.post("/dm", async (req, res) => {
    try {
        const contact = new ContactModel(req.body);
        await contact.save();
        res.json({
            message: "Message Received!",
        });
    } catch (error) {
        res.json(error);
    }
});

router.post("/join", async (req, res) => {
    try {
        const email = JoinModel.findOne({
            joinEmail: req.body.joinEmail,
        });
        if (email) {
            res.json({
                message: "Email already exists.",
            });
        } else {
            const email = new JoinModel(req.body);
            await email.save();
            res.json({
                message: "Thanks for joining.",
            });
        }
    } catch (error) {
        res.json(error);
    }
});

export { router as contactRouter };
