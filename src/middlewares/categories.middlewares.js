import connection from "../database/database.js";
import categorySchema from "../models/categorySchema.js";

export async function validateCategory(req,res,next){
    const {name}= req.body

    const {error} =categorySchema.validate(req.body)

    if(error){
        res.status(400).send(error.details.map(detail => detail.message))
        return
    }


    try{
        const categoryExistence = await connection.query("SELECT * FROM categories WHERE name=$1", [name])

        if(categoryExistence.rows.length !== 0){
            res.sendStatus(409)
            return 
        }

        next()
    }catch(err){
        res.status(500).send({message: err})
        return
    }

}