const express = require('express')

const cors = require('cors')
const crypto = require('node:crypto')
const movies = require('./movies.json')


const {validateMovie, validatePartialMovie} = require('./schemas/movies_schema')


const app = express()

// Middleware for use json
app.use(express.json())

// Middleware for use cors
app.use(cors({
    origin: (origin, callback) => {
        // Accepted origins
        const allowedOrigins = [
            'http://localhost:1234',
            'http://localhost:8080'
        ]
        // Check if origin is allowed
        if(allowedOrigins.includes(origin)){
            callback(null, true)
        }
        // Check if origin is not allowed
        if(!origin){
            callback(null, true)
        }
        // Origin not allowed
        return callback(new Error('Not allowed by CORS'))
    }
}))
app.disable('x-powered-by')


// GEt all movies
app.get('/movies', (req, res) => {
    
    const { genre } = req.query
    if (genre) {
        const filteredMovies = movies.filter(
            movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        )
        return res.json(filteredMovies)
    }
    
    res.json(movies)
})

// GEt movie by id
app.get('/movies/:id', (req, res) => {
    const { id } = req.params
    const movie = movies.find(movie => movie.id === id)
    if (movie) return res.json(movie)
    res.status(404).json({ error: 'movie not found' })
})


// POST movie

app.post('/movies', (req, res) => {
    const result = validateMovie(req.body)

    if(!result.success){
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newMovie = {
        id: crypto.randomUUID(),
        ...result.data
    }

    movies.push(newMovie)
    res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
    // Validate partial movie
    const result = validatePartialMovie(req.body)
    
    if(!result.success){
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    // Query movie by id
    const { id } = req.params

    const movieIndex = movies.findIndex(movie => movie.id === id)
    
    // check if movie exists
    if (movieIndex === -1) {
        return res.status(404).json({ error: 'movie not found' })
    }

    const updatedMovie = {
        ...movies[movieIndex],
        ...result.data 
    }
    movies[movieIndex] = updatedMovie

    return res.json(updatedMovie)
})

app.delete('/movies/:id', (req, res) => {
    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) {
        return res.status(404).json({ error: 'movie not found' })
    }

    movies.splice(movieIndex, 1)

    return res.json({ success: true })
})


const PORT = process.env.PORT ?? 1234


app.listen(PORT, () => {
    console.log(`server running on port http://localhost:${PORT}`)
})