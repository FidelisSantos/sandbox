import { Router } from "express";
import { MovieController } from "../controllers/MovieController";

const router = Router();

router.post("/", MovieController.create);
router.get("/", MovieController.get);
router.get("/:id", MovieController.find);
router.delete("/:id", MovieController.delete);

export default router;