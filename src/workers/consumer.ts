import {redisClient} from '../redis'

import {
    completeTask,
    retryTask, 
    getTaskById
} from '../store/taskStore'

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

        await sleep(3000)

        const fail = Math.random() < 0.3

        if(fail){
            await retryTask(task.id,
            task.attempts,
            task.max_attempts
        )
        }
        else {
            await completeTask(task.id)
        }

        await redisClient.xAck(STREAM, GROUP, message.id)
    }
}
