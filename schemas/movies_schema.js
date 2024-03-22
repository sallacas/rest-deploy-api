const z = require('zod')
// Schema
const schema = z.object({
    title: z.string({
        required_error: 'title is required',
        invalid_type_error: 'title must be a string',
    }),
    year: z.number().int().min(1900).max(2026),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).default(5),
    poster: z.string().url({
        message: 'poster must be a valid url',
    }),
    genre: z.array(
        z.enum(['Action', 'Drama', 'Comedy', 'Sci-Fi', 'Horror', 'Romance', 'Thriller', 'Documentary','Terror','Crime']),
        {
            required_error: 'genre is required',
            invalid_type_error: 'genre must be an array of strings',
        }
    )
})

function validateMovie(movie) {
    return schema.safeParse(movie)
}

function validatePartialMovie(movie) {
    return schema.partial().safeParse(movie)
}

module.exports = {
    validateMovie,
    validatePartialMovie
}