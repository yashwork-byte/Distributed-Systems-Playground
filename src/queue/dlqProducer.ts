import {redisClient} from '../redis'

const DLQ_STREAM = 'tasks:dlq'

export async function sendToDLQ(taskId: number){
    await redisClient.xAdd(
        DLQ_STREAM,
        '*',
        {taskId: taskId.toString()}
    )

    console.log(`Task ${taskId} moved to DLQ`)
}