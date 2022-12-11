import connection from "../database/database.js"

export async function sendGames(req,res){
    const {name}= req.query

    try{
        if(name){
            const filteredGames = await connection.query(`
            SELECT games.*, categories.name as "categoryName" FROM games JOIN categories ON games."categoryId"=categories.id WHERE UPPER(games.name) LIKE UPPER($1)
          `, [`%${name}%`])
            res.send(filteredGames.rows)
            return
        }else{
            const games = await connection.query(`
            SELECT games.*, categories.name as "categoryName" FROM games JOIN categories ON games."categoryId"=categories.id
          `)
   
            res.send(games.rows)
            return
        }

    }catch(err){
        res.status(500).send({message: err})
        return
    }
}

export async function registerGame(req,res){
    const{name, image, stockTotal,categoryId,pricePerDay} = req.body

    try{
        await connection.query(`INSERT INTO games (name, image, "stockTotal","categoryId","pricePerDay") VALUES ($1,$2,$3,$4,$5)`
        ,[name, image,stockTotal,categoryId,pricePerDay])

        res.sendStatus(201)
        return

    }catch(err){
        res.status(500).send({message: err})
        return
    }
}