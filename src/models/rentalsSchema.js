import joi from "joi"

const rentSchema = joi.object({
    customerId: joi.number().min(0).required(),
    gameId: joi.number().min(0).required(),
    daysRented: joi.number().min(0).required()
})

export default rentSchema