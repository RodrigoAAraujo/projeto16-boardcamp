import { Router } from "express";
import { sendGames, registerGame } from "../controllers/games.controllers.js";
import { validateGame } from "../middlewares/games.middlewares.js";

const router = Router()

router.get("/games", sendGames)
router.post("/games", validateGame, registerGame)

export default router