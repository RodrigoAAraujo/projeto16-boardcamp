import { Router } from "express";
import { 
    validateCustomerPost, 
    validateCustomerExistence, 
    validateCustomerPut 
} from "../middlewares/customers.middlewares.js";

import { sendCustomers, sendSpecificCustomer, registerCustomer, updateCustomer } from "../controllers/customers.controllers.js";

const router = Router()

router.get("/customers", sendCustomers)
router.get("/customers/:id", validateCustomerExistence,  sendSpecificCustomer)
router.post("/customers", validateCustomerPost, registerCustomer)
router.put("/customers/:id", validateCustomerPut, updateCustomer)

export default router