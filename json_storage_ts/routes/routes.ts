import { Router } from "express";
import users from "../controllers/controllers";

const router = Router();

router.post("/:url", users.add);
router.get("/:url", users.findData);

export default router;
