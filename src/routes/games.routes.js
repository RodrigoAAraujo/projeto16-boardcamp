import { Router } from "express";

const router = Router()

router.get("/games", sendGames)
router.post("/games", validateBody, registerRentals)

export default router