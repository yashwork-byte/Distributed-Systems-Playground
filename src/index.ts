import express from 'express'
import 'dotenv/config'

import {connectRedis} from './redis'
import {startConsumer} from './workers/consumer'
import {connectDB} from './db'
import taskRoutes from './routes/tasks'
import metricsRoutes from './routes/metrics'
import {startRetryConsumer} from './workers/retryConsumer'

const app = express()
const PORT = 3000

app.use(express.json())

app.use('/tasks', taskRoutes)
app.use('/metrics', metricsRoutes)

async function main(){
    await connectDB()
    await connectRedis()

    app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`)})

    startConsumer("worker-1");
    startConsumer("worker-2");
    startConsumer("worker-3");

    startRetryConsumer('retry-1')
}

main()