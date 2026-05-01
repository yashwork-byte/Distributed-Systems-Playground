import {redisClient} from '../redis'

import {
    completeTask,
    isTaskCompleted, 
    getTaskById
} from '../store/taskStore'

import {enqueueRetry} from '../queue/retryProducer'
import {sendToDLQ} from '../queue/dlqProducer'

import {eventBus} from '../events/eventBus'

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

        eventBus.emit('task-event', {
            type: 'TASK_RECEIVED',
            taskId,
            worker: consumerName
        })

        const task = await getTaskById(taskId)
        if(!task) continue

        if(await isTaskCompleted(task.id)){
            console.log(`Skipping already completed ${task.id}`)
            return
        }

        eventBus.emit('task-event', {
            type: 'TASK_STARTED',
            taskId: task.id,
            worker: consumerName
        })

        await sleep(3000)

        const fail = Math.random() < 0.3

        if(fail){
            eventBus.emit('task-event', {
                type: 'TASK_FAILED',
                taskId: task.id,
                worker: consumerName
            })

            const attempts = task.attempts + 1

            if(attempts > task.max_attempts){
                await sendToDLQ(task.id)

                eventBus.emit('task-event', {
                type: 'TASK_DLQ',
                taskId: task.id,
            })
            }
            else{
                const delay = attempts * 3000
                await enqueueRetry(task.id, delay)

                eventBus.emit('task-event', {
                type: 'TASK_RETRY',
                taskId: task.id,
                delay
            })
            }
        }
        else {
            await completeTask(task.id)
            eventBus.emit('task-event', {
                type: 'TASK_COMPLETED',
                taskId: task.id,
                worker: consumerName
            })
        }

        await redisClient.xAck(STREAM, GROUP, message.id)
    }
}
