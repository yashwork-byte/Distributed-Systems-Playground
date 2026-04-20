import {
    claimNextTask,
    completeTask,
    failTask
} from '../store/taskStore'

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

async function process(workerId: string){
    const task = claimNextTask(workerId)

    if(!task) return

    console.log(`[${workerId}] picked task ${task.id}`)

    await sleep(3000)

    const shouldFail = Math.random() < 0.2

    if(shouldFail){
        failTask(task.id)
        console.log(`[${workerId}] failed task ${task.id}`)
        return
    }

    completeTask(task.id)
    console.log(`[${workerId}] completed task ${task.id}`)
}

export function startWorker(workerId: string) {
    setInterval(() => {
        process(workerId)
    }, 1000)
}