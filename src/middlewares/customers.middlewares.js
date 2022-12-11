import { copyFileSync } from "fs"
import connection from "../database/database.js"
import customerSchema from "../models/clientSchema.js"

export async function validateCustomerExistence(req, res, next){
    const {id} = req.params

    try{
        const idExistence = await connection.query("SELECT * FROM customers WHERE id=$1", [Number(id)])

        if(idExistence.rows.length === 0){
            res.sendStatus(404)
            return
        }

        next()
    }catch(err){
        res.status(500).send({message: err})
        return
    }
}

export async function validateCustomerPost(req,res,next){
    const {cpf} = req.body


    const {error} = customerSchema.validate(req.body)

    if(error){
        res.status(400).send(error.details.map(detail => detail.message))
        return
    }

    try{
        const cpfExistence = await connection.query("SELECT * FROM customers WHERE cpf=$1",[cpf])

        if(cpfExistence.rows.length !== 0){
            res.sendStatus(409)
            return
        } 

        next()
    }catch(err){
        res.status(500).send({message: err})
        return
    }
}

export async function validateCustomerPut(req,res,next){
    const {cpf} = req.body
    const {id} = req.params

    const {error} = customerSchema.validate(req.body)

    if(error){
        res.status(400).send(error.details.map(detail => detail.message))
        return
    }

    try{
        const idExistence = await connection.query("SELECT * FROM customers WHERE id=$1",[id])

        if(idExistence.rows.length === 0){
            res.sendStatus(404)
            return
        } 

        
        const cpfExistence = await connection.query("SELECT * FROM customers WHERE cpf=$1",[cpf])


        //Condition that allows change without changing cpf
        if(cpfExistence.rows.length !== 0 && cpfExistence.rows[0].id !== Number(id)){
            res.sendStatus(409)
            return
        } 

        next()
    }catch(err){
        res.status(500).send({message: err})
        return
    }
}