import connection from "../database/database.js"
import gameSchema from "../models/gameSchema.js"

export async function validateGame(req,res,next){
    const{name, categoryId} = req.body

    const {error} = gameSchema.validate(req.body)

    if(error){
        res.status(400).send(error.details.map(detail => detail.message))
        return
    }

    try{
        const categoryExist =await connection.query("SELECT * FROM categories WHERE id=$1", 
        [categoryId])


        if(categoryExist.rows.length === 0){
            res.sendStatus(400)
            return
        }

        const nameExist =await connection.query("SELECT * FROM games WHERE name=$1", 
        [name])

        if(nameExist.rows.length !== 0){
            res.sendStatus(409)
            return
        }

        next()
    }catch(err){
        res.status(500).send({message: err})
        return
    }
}