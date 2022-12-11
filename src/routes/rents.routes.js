import { Router } from "express";
import { sendRentals, registerRentals, registerReturn, deleteRentals } from "../controllers/rents.controllers.js";
import { validateRentalPost, validateReturnExistence, validateDeleteExistence } from "../middlewares/rents.middlewares.js";

const router = Router()

router.get("/rentals", sendRentals)
router.post("/rentals", validateRentalPost, registerRentals)
router.post("/rentals/:id/return", validateReturnExistence, registerReturn)
router.delete("/rentals/:id", validateDeleteExistence, deleteRentals)


export default router