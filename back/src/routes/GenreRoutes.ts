import { Router } from "express";
import { GenreController } from "../controllers/GenreController";

const router = Router();

router.post("/", GenreController.create);
router.get("/", GenreController.get);
router.get("/:id", GenreController.find);
router.delete("/:id", GenreController.delete);

export default router;