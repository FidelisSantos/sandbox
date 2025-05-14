import { Router } from "express";
import { AgeRatingController } from "../controllers/AgeRatingController";

const router = Router();

router.post("/", AgeRatingController.create);
router.get("/", AgeRatingController.get);
router.get("/:id", AgeRatingController.find);
router.delete("/:id", AgeRatingController.delete);

export default router;