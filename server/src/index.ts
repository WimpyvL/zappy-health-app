import express from 'express'
import cors from 'cors'
import { ENV } from './env'
import authRoutes from './routes/auth'
import profileRoutes from './routes/profiles'
import healthRecordRoutes from './routes/health-records'
import orderRoutes from './routes/orders'
import patientRoutes from './routes/patients'
import homeRoutes from './routes/home'
import treatmentRoutes from './routes/treatments'
import shopRoutes from './routes/shop'
import resourceRoutes from './routes/resources'

const app = express()

app.use(cors({ origin: ENV.frontendUrl, credentials: true }))
app.use(express.json({ limit: '1mb' }))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/auth', authRoutes)
app.use('/profiles', profileRoutes)
app.use('/health-records', healthRecordRoutes)
app.use('/orders', orderRoutes)
app.use('/patients', patientRoutes)
app.use('/home', homeRoutes)
app.use('/treatments', treatmentRoutes)
app.use('/shop', shopRoutes)
app.use('/resources', resourceRoutes)

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unexpected error:', err)
  res.status(500).json({ message: 'Internal server error' })
})

app.listen(ENV.port, () => {
  console.log(`API server listening on port ${ENV.port}`)
})
