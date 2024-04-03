import { Router } from 'express'
import { MovieController } from '../controllers/movies.js'

export const moviesRouter = Router()

// GET all movies
// POST movie
moviesRouter.get('/', MovieController.getAll)
moviesRouter.post('/', MovieController.create)
// GET movie by id
// PATCH movie
// DELETE movie
moviesRouter.get('/:id', MovieController.getById)
moviesRouter.patch('/:id', MovieController.update)
moviesRouter.delete('/:id', MovieController.delete)

