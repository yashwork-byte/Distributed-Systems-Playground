import {redisClient} from '../redis'

import {
    completeTask,
    isTaskCompleted, 
    getTaskById
} from '../store/taskStore'

import {enqueueRetry} from '../queue/retryProducer'
import {sendToDLQ} from '../queue/dlqProducer'

const STREAM = 'tasks:stream'
const GROUP = 'workers'

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function startConsumer(consumerName: string){
    try{
        await redisClient.xGroupCreate(
            STREAM,
            GROUP,
            '0',
            {MKSTREAM : true}
        )
    } catch{}

    while(true){
        const response = await redisClient.xReadGroup(
            GROUP,
            consumerName,
            {
                key: STREAM,
                id: '>'
            },
            {
                COUNT: 1,
                BLOCK: 2000
            }
        )

        if(!response) continue

        const message = (response as any)[0].messages[0]
        const taskId = Number(message.message.taskId)

        console.log(`[${consumerName}] processing ${taskId}`)

        const task = await getTaskById(taskId)
        if(!task) continue

        if(await isTaskCompleted(task.id)){
            console.log(`Skipping already completed ${task.id}`)
            return
        }

        await sleep(3000)

        const fail = Math.random() < 0.3

        if(fail){
            const attempts = task.attempts + 1

            if(attempts > task.max_attempts){
                await sendToDLQ(task.id)
            }
            else{
                const delay = attempts * 3000
                await enqueueRetry(task.id, delay)
            }
        }
        else {
            await completeTask(task.id)
        }

        await redisClient.xAck(STREAM, GROUP, message.id)
    }
}
