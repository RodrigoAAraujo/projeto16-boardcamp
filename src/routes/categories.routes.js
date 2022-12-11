import { Router } from "express";
import { sendCategories, registerCategory } from "../controllers/categories.controllers.js";
import {validateCategory} from "../middlewares/categories.middlewares.js";

const router = Router()

router.get("/categories", sendCategories)
router.post("/categories", validateCategory, registerCategory)

export default router