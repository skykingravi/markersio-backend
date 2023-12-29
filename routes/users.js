import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

import { UserModel } from "../models/Users.js";

dotenv.config();

const router = express.Router();
const SECRET = process.env.SECRET || "secret";

router.post("/register", async (req, res) => {
    try {
        const { userName, userEmail, userPassword } = req.body;

        const user = await UserModel.findOne({
            userEmail: userEmail,
        });

        if (user) {
            return res.json({
                message: "User already exits!",
            });
        }

        const hashedPassword = await bcrypt.hash(userPassword, 10);

        const newUser = new UserModel({
            userName: userName,
            userEmail: userEmail,
            userPassword: hashedPassword,
            createdFolders: [],
        });
        await newUser.save();

        res.json({
            message: "Registration complete! Now login.",
        });
    } catch (error) {
        res.json(error);
    }
});

router.post("/login", async (req, res) => {
    try {
        const { userEmail, userPassword, rememberCheck } = req.body;

        const user = await UserModel.findOne({
            userEmail: userEmail,
        });

        if (!user) {
            return res.json({
                message: "User doesn't exist!",
            });
        }

        const isPasswordValid = await bcrypt.compare(
            userPassword,
            user.userPassword
        );

        if (!isPasswordValid) {
            return res.json({
                message: "Username or Password is incorrect",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            SECRET,
            { expiresIn: rememberCheck ? "7d" : "1h" }
        );

        res.json({
            token,
            userId: user._id,
            message: "You are Logged in!",
        });
    } catch (error) {
        res.json(error);
    }
});

export { router as userRouter };

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, SECRET, (err) => {
            if (err) {
                return res.sendStatus(403);
            }
            next();
        });
    } else {
        res.sendStatus(401);
    }
};
