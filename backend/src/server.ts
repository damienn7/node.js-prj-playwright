import dotenv from 'dotenv'
dotenv.config()

import app from './app'

const PORT = process.env.PORT || 4000

console.log("DATABASE_URL =", process.env.DATABASE_URL);

app.listen(Number(PORT), () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
