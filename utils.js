// Forma recomendada de importar JSON con ESmodule
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

export const readJSON = (filename) => require(filename)
