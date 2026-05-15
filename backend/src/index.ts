import cors from 'cors'
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express'
import { initializeDatabase } from '@/config/database'
import { runMigrations } from '@/config/migrations'
import authRoutes from '@/routes/auth.routes'
import dishRoutes from '@/routes/dish.routes'
import restaurantRoutes from '@/routes/restaurant.routes'

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/restaurants', restaurantRoutes)
app.use('/api/dishes', dishRoutes)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err)
  res.status(500).json({ data: null, error: 'Internal server error' })
})

async function start(): Promise<void> {
  await initializeDatabase()
  await runMigrations()
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
