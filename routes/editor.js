import express from "express";
import { UserModel } from "../models/Users.js";
import { NotebookModel } from "../models/Notebooks.js";
import { PageModel } from "../models/Pages.js";
import { verifyToken } from "./users.js";

const router = express.Router();

const NOTEBOOKS_LIMIT = 50,
    PAGES_LIMIT = 20;

router.get("/notebooks/:userId", verifyToken, async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userId);
        const Notebooks = await NotebookModel.find({
            _id: {
                $in: user.createdNotebooks,
            },
        });
        res.json(Notebooks);
    } catch (error) {
        res.json(error);
    }
});

router.post("/notebooks", verifyToken, async (req, res) => {
    try {
        const Notebook = new NotebookModel(req.body.data);
        const user = await UserModel.findById(req.body.userId);
        if (user.createdNotebooks.length === NOTEBOOKS_LIMIT) {
            return res.json({
                message: "Limit Exceeded!",
            });
        }
        const newNotebook = await Notebook.save();
        user.createdNotebooks.push(newNotebook._id);
        await user.save();
        res.json({
            message: "Notebook Created!",
            notebookId: newNotebook._id,
        });
    } catch (error) {
        res.json(error);
    }
});

router.put("/notebooks", verifyToken, async (req, res) => {
    try {
        const Notebook = await NotebookModel.findById(req.body._id);
        Object.assign(Notebook, req.body);
        await Notebook.save();
        res.json({
            message: "Notebook Updated!",
        });
    } catch (error) {
        res.json(error);
    }
});

router.delete(
    "/notebooks/:userId/:notebookId",
    verifyToken,
    async (req, res) => {
        try {
            const Notebook = await NotebookModel.findById(
                req.params.notebookId
            );
            const user = await UserModel.findById(req.params.userId);
            await PageModel.deleteMany({
                _id: {
                    $in: Notebook.createdPages,
                },
            });
            await NotebookModel.deleteOne({
                _id: req.params.notebookId,
            });
            const newArray = user.createdNotebooks.filter(
                (element) => element != req.params.notebookId
            );
            user.createdNotebooks = newArray;
            await user.save();
            res.json({
                message: "Notebook Deleted!",
            });
        } catch (error) {
            res.json(error);
        }
    }
);

router.get("/pages/:notebookId", async (req, res) => {
    try {
        const notebook = await NotebookModel.findById(req.params.notebookId);
        if (!notebook) return res.json([]);
        const Pages = await PageModel.find({
            _id: {
                $in: notebook.createdPages,
            },
        });
        res.json(Pages);
    } catch (error) {
        res.json(error);
    }
});

router.post("/pages", verifyToken, async (req, res) => {
    try {
        const Notebook = await NotebookModel.findById(req.body.notebookId);
        if (Notebook.createdPages.length === PAGES_LIMIT) {
            return res.json({
                message: "Limit Exceeded!",
            });
        }
        const page = new PageModel({
            pageContent: req.body.pageContent,
        });
        const newPage = await page.save();
        Notebook.createdPages.push(newPage._id);
        Notebook.notebookCurrentPageNo = Notebook.createdPages.length;
        await Notebook.save();
        res.json({
            message: "Page Created!",
            pageId: page._id,
        });
    } catch (error) {
        res.json(error);
    }
});

router.put("/pages/:pageId", verifyToken, async (req, res) => {
    try {
        const page = await PageModel.findById(req.params.pageId);
        page.pageContent = req.body.pageContent;
        await page.save();
        res.json({
            message: "Page Updated!",
        });
    } catch (error) {
        res.json(error);
    }
});

router.delete("/pages/:notebookId/:pageId", verifyToken, async (req, res) => {
    try {
        const Notebook = await NotebookModel.findById(req.params.notebookId);
        if (Notebook.notebookCurrentPageNo === Notebook.createdPages.length) {
            Notebook.notebookCurrentPageNo--;
        }
        const newArray = Notebook.createdPages.filter(
            (element) => element != req.params.pageId
        );
        Notebook.createdPages = newArray;
        await Notebook.save();
        await PageModel.deleteOne({
            _id: req.params.pageId,
        });
        res.json({
            message: "Page Deleted!",
        });
    } catch (error) {
        res.json(error);
    }
});

export { router as editorRouter };
