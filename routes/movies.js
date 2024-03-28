import { Router } from 'express'
import { readJSON } from '../utils.js'
import { randomUUID } from 'node:crypto'
import { validateMovie, validatePartialMovie } from '../schemas/movies_schema.js'

const movies = readJSON('./movies.json')
export const moviesRouter = Router()

// GEt all movies
moviesRouter.get('/', (req, res) => {   
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
moviesRouter.get('/:id', (req, res) => {
    const { id } = req.params
    const movie = movies.find(movie => movie.id === id)
    if (movie) return res.json(movie)
    res.status(404).json({ error: 'movie not found' })
})
// POST movie
moviesRouter.post('/', (req, res) => {
    const result = validateMovie(req.body)

    if(!result.success){
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newMovie = {
        id: randomUUID(),
        ...result.data
    }

    movies.push(newMovie)
    res.status(201).json(newMovie)
})
// PATCH movie
moviesRouter.patch('/:id', (req, res) => {
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
// DELETE movie
moviesRouter.delete('/:id', (req, res) => {
    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) {
        return res.status(404).json({ error: 'movie not found' })
    }

    movies.splice(movieIndex, 1)

    return res.json({ success: true })
})

