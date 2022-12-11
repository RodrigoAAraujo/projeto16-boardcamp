import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import categoriesRoutes from './routes/games.routes.js'
import clientsRoutes from './routes/rents.routes.js'
import gamesRoutes from './routes/games.routes.js'
import rentRoutes from './routes/rents.routes.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use(gamesRoutes)
app.use(rentRoutes)
app.use(categoriesRoutes)
app.use(clientsRoutes)


const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Server connected at port ${port}`))