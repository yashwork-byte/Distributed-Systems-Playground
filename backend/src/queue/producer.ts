import {redisClient} from '../redis'

const STREAM = 'tasks:stream'

export async function enqueueTask(taskId: number){
    await redisClient.xAdd(
        STREAM,
        '*',{
            taskId: taskId.toString()
        }
    )
}