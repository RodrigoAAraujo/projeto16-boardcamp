import connection from "../database/database.js";
import rentSchema from "../models/rentalsSchema.js";

export async function validateRentalPost(req,res,next){
    const{customerId, gameId} = req.body
    
    const {error} = rentSchema.validate(req.body)

    if(error){
        res.status(400).send(error.details.map(detail => detail.message))
        return
    }

    try{
        const customerExist = await connection.query("SELECT * FROM customers WHERE id=$1",[customerId])
        if(customerExist.rows.length === 0){
            res.sendStatus(400)
            return
        }

        const gamesExist = await connection.query("SELECT * FROM games WHERE id=$1",[gameId])
        if(gamesExist.rows.length === 0){
            res.sendStatus(400)
            return
        }

        const rentalsThisGame = await connection.query(`SELECT * FROM rentals WHERE "gameId"=$1 AND "returnDate" IS NULL`,[gameId])

        if(rentalsThisGame.rowCount >= gamesExist.rows[0].stockTotal){
            res.sendStatus(400)
            return
        }

        next()
    }catch(err){
        res.status(500).send({message: err})
        return
    }
}

export async function validateReturnExistence(req,res,next){
    const {id} = req.params

    try{
        const rentalExist = await connection.query("SELECT * FROM rentals WHERE id=$1", [id])

        if(rentalExist.rows.length === 0){
            res.sendStatus(404)
            return
        }

        if(rentalExist.rows[0].returnDate !== null){
            res.sendStatus(400)
            return
        }

        next()

    }catch(err){
        res.status(500).send({message: err})
        return
    }
    
}

export async function validateDeleteExistence(req,res,next){
    const {id} = req.params

    try{
        const rentalExist = await connection.query("SELECT * FROM rentals WHERE id=$1",[id])

        if(rentalExist.rows.length === 0){
            res.sendStatus(404)
            return
        }

        if(rentalExist.rows[0].returnDate === null){
            res.sendStatus(400)
            return
        }

        next()

    }catch(err){
        res.status(500).send({message: err})
        return
    }
}