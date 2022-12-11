import connection from "../database/database.js";

export async function sendCategories(req,res){

    try{
        const categories = await connection.query("SELECT * FROM categories")

        res.status(200).send(categories)
        return
    }catch(err){
        res.status(500).send({message: err})
        return
    }
  
}


export async function registerCategory(req, res){
    const {name}= req.body

    try{
        await connection.query("INSERT INTO categories (name) VALUES ($1)", [name])

        res.status(201)
        return

    }catch(err){
        res.status(500).send({message: err})
        return
    }
}