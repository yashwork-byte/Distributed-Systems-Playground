import {redisClient} from '../redis'
import {enqueueTask} from '../queue/producer'

const STREAM = 'tasks:retry'
const GROUP = 'retry-group'

export async function startRetryConsumer(name: string){
    try{
        await redisClient.xGroupCreate(STREAM, GROUP, '0', {
            MKSTREAM: true
        })
    }catch{}

    while(true){
        const res = await redisClient.xReadGroup(
            GROUP,
            name,
            {key: STREAM, id: '>'},
            {BLOCK: 5000}
        )

        if(!res) continue

        const msg = (res as any)[0].messages[0]

        const taskId = Number(msg.message.taskId)
        const runAt = Number(msg.message.runAt)

        if(Date.now() < runAt){
            await redisClient.xAdd(STREAM, '*', msg.message)
            continue
        }

        await enqueueTask(taskId)

        await redisClient.xAck(STREAM, GROUP, msg.id)
    }
}