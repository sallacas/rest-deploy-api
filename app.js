import express, { json } from 'express'
import { moviesRouter  } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'

const app = express()

// Middleware for use json
app.use(json())

// Middleware for use cors
app.use(corsMiddleware())
app.disable('x-powered-by')


// GEt all movies
app.get('/movies', moviesRouter)


const PORT = process.env.PORT ?? 1234


app.listen(PORT, () => {
    console.log(`server running on port http://localhost:${PORT}`)
})