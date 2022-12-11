import { Router } from "express";

const router = Router()

router.get("/categories", sendCategories)
router.post("/categories", validateCategory, registerCategory)

export default router