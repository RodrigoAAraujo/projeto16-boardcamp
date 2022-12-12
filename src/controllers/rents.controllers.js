import dayjs from "dayjs";
import connection from "../database/database.js";

export async function sendRentals(req, res) {
    const { gameId, customerId , status, startDate} = req.query

    try {
        const games = await connection.query("SELECT * FROM games")
        const customers = await connection.query("SELECT * FROM customers")
        const categories = await connection.query("SELECT * FROM categories")
        let rents =null

        if (!gameId && !customerId && (status !== "open" && status !== "closed") && !startDate) {
            rents = await connection.query(`SELECT *  FROM rentals`)
        }else if (gameId) {
            rents = await connection.query(`SELECT *  FROM rentals WHERE "gameId"=$1`, [gameId])
        }else if (customerId){
            rents = await connection.query(`SELECT *  FROM rentals WHERE "customerId"=$1`, [customerId])
        }else if (status){
            if(status === "open"){
                rents = await connection.query(`SELECT *  FROM rentals WHERE "returnDate" IS NULL`)
            }else if(status === "closed"){
                rents = await connection.query(`SELECT *  FROM rentals WHERE "returnDate" IS NOT NULL`)
            }
        }else if (startDate){
            rents = await connection.query(`SELECT *  FROM rentals WHERE "rentDate" >= $1`,[startDate])

        }

        const rentalInfo = rents.rows.map((rent) => ({
            ...rent,
            customer: {
                id: rent.customerId,
                name: customers.rows.find((c) => c.id === rent.customerId).name
            },
            game: {
                id: rent.gameId,
                name: games.rows.find((c) => c.id === rent.gameId).name,
                categoryId: games.rows.find((c) => c.id === rent.gameId).categoryId,
                categoryName: categories.rows.find((c) => c.id === games.rows.find((c) => c.id === rent.gameId).categoryId).name
            }
        })
        )


        res.send(rentalInfo)
        return
        
    } catch (err) {
        res.status(500).send({ message: err })
        return
    }
}

export async function registerRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body

    try {
        const gamePrice = await connection.query(`SELECT "pricePerDay" FROM games WHERE id=$1`, [gameId])


        await connection.query(`
            INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1,$2,$3,$4,$5,$6,$7)
        `, [customerId, gameId, dayjs(Date.now()).format("YYYY-MM-DD"), daysRented, null, Number(gamePrice.rows[0].pricePerDay) * Number(daysRented), null])

        res.sendStatus(201)
        return

    } catch (err) {
        res.status(500).send({ message: err })
        return
    }
}

export async function registerReturn(req,res){
    const {id} = req.params

    try{
        const rental = await connection.query("SELECT * FROM rentals WHERE id=$1", [id])

        console.log(rental)
        console.log(rental.rows[0].rentDate.getTime())
        console.log((Date.now() - rental.rows[0].rentDate.getTime())/(1000*3600*24)- rental.rows[0].daysRented)

        let days= Math.floor(((Date.now() - rental.rows[0].rentDate.getTime())/(1000*3600*24)- rental.rows[0].daysRented))

        if(days <= 0){
            days = 0
        }

        await connection.query(`UPDATE rentals SET "returnDate"=$1,"delayFee"=$2 WHERE id=$3`,
        [dayjs().format("YYYY-MM-DD"), days*rental.rows[0].originalPrice, id])

        res.sendStatus(200)
        return

    }catch (err) {
        res.status(500).send({ message: err })
        return
    }
}

export async function deleteRentals(req,res){
    const {id} = req.params

    try{
        await connection.query("DELETE FROM rentals WHERE id=$1", [id])

        res.sendStatus(200)
        return

    }catch (err) {
        res.status(500).send({ message: err })
        return
    }
}