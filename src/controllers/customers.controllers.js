import connection from "../database/database.js";

export async function sendCustomers(req, res){
    const {cpf}= req.query

    try{
        if(cpf){
            const filteredCustomers = await connection.query("SELECT * FROM customers WHERE cpf LIKE $1",[`%${cpf}%`])
            res.send(filteredCustomers.rows)
            return
        }else{
            const customers = await connection.query(`
                SELECT * FROM customers JOIN 
                rentals ON customers.id = rentals."customerId" GROUP BY customers.name
            `)
            res.send(customers.rows)
            return
        }

    }catch(err){
        res.status(500).send({message: err})
        return
    }
}

export async function sendSpecificCustomer(req, res){
    const {id} = req.params

    try{
        console.log("audjo")
        const customer = await connection.query("SELECT * FROM customers WHERE id=$1", [id])

        res.send(customer.rows[0])
        return

    }catch(err){
        res.status(500).send({message: err})
        return
    }
}

export async function registerCustomer(req,res){
    const {name, phone, cpf, birthday} = req.body

    console.log(req.body)

    try{
        await connection.query("INSERT INTO customers (name,phone,cpf,birthday) VALUES ($1, $2, $3, $4)",
        [name, phone, cpf, birthday])

        res.sendStatus(201)
        return
    }catch(err){
        res.status(500).send({message: err})
        return
    }
}

export async function updateCustomer(req,res){
    const {name, phone, cpf, birthday} = req.body
    const {id} = req.params

    try{
        await connection.query("UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5",
        [name, phone, cpf, birthday, id])

        res.sendStatus(201)
        return
    }catch(err){
        res.status(500).send({message: err})
        return
    }
}