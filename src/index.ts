import express from 'express'
import 'dotenv/config'

import {connectDB} from './db'
import taskRoutes from './routes/tasks'
import metricsRoutes from './routes/metrics'
import {startWorker} from './workers/taskWorker'

const app = express()
const PORT = 3000

app.use(express.json())

app.use('/tasks', taskRoutes)
app.use('/metrics', metricsRoutes)

async function main(){
    await connectDB()

    app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`)})

    startWorker("worker-1");
    startWorker("worker-2");
    startWorker("worker-3");
}

main()