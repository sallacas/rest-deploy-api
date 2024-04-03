import { MovieModel } from '../models/movie.js'
import { validateMovie, validatePartialMovie } from '../schemas/movies_schema.js'

export class MovieController {
    static async getAll (req, res) {   
        const { genre } = req.query
        const movies = await MovieModel.getAll({ genre })
        res.json(movies)
    }
    static async getById (req, res) {
        const { id } = req.params
        const movie = await MovieModel.getById({ id })
        if (movie) return res.json(movie)
        res.status(404).json({ error: 'movie not found' })
    }
    static async create (req, res) {
        const result = validateMovie(req.body)
        if(!result.success){
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }
        const newMovie = await MovieModel.create(result)
        res.status(201).json(newMovie)
    }
    static async update (req, res) {
        const result = validatePartialMovie(req.body)
        if(!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })
        // Query movie by id
        const { id } = req.params
        const updatedMovie = await MovieModel.update({ id, input: result.data })

        return res.json(updatedMovie)
    }
    static async delete (req, res) {
        const { id } = req.params
        const result = MovieModel.delete({ id })

        if(!result) return res.status(404).json({ error: 'Movie not found' })
        return res.json({ message: 'Movie deleted', success: result })
    }
}