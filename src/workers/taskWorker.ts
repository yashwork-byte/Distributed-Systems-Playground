import {
    claimNextTask,
    completeTask,
    retryTask
} from '../store/taskStore'

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

async function process(workerId: string){
    const task = await claimNextTask(workerId)

    if(!task) return

    console.log(`[${workerId}] processing task ${task.id} attempt ${task.attempts}`)

    await sleep(3000)

    const shouldFail = Math.random() < 0.3

    if(shouldFail){
        console.log(`[${workerId}] failed task ${task.id}`)
        
        await retryTask(task.id,
            task.attempts,
            task.max_attempts
        )
        return
    }

    await completeTask(task.id)
    console.log(`[${workerId}] completed task ${task.id}`)
}

export function startWorker(workerId: string) {
    setInterval(() => {
        process(workerId)
    }, 1000)
}