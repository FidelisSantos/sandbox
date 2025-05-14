import { Router } from "express";
import { SandboxController } from "../controllers/SandboxController";

const router = Router();

router.get("/describe", SandboxController.describeTables);
router.get("/populate", SandboxController.populateTables);

export default router;
