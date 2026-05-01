import {redisClient} from '../redis'

const RETRY_STREAM = 'tasks:retry'

export async function enqueueRetry(taskId: number, delayMs: number){
    await redisClient.xAdd(
        RETRY_STREAM,
        '*',
        {
            taskId: taskId.toString(),
            runAt: (Date.now() + delayMs).toString()
        }
    )
}