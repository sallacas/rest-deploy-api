
import cors from 'cors'

// Accepted origins
const ACCEPTED_ORIGINS = [
    'http://localhost:1234',
    'http://localhost:8080',
    'https://rest-deploy-api-dev-hqzz.1.us-1.fl0.io'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS = {}}) => cors({
    origin: (origin, callback) => {
        
        // Check if origin is allowed
        if(acceptedOrigins.includes(origin)){
            callback(null, true)
        }
        // Check if origin is not allowed
        if(!origin){
            callback(null, true)
        }
        // Origin not allowed
        return callback(new Error('Not allowed by CORS'))
    }
})