import {Task} from '../types/task'

let tasks: Task[] = []
let currentId = 1

export function createTask(
    type : string,
    payload: Record<string, unknown>
): Task{
    const task: Task ={
        id: currentId++,
        type,
        payload,
        status: 'queued',
        createdAt: new Date().toISOString(),
        attempts: 0,
        maxAttempts: 3
    }

    tasks.push(task)
    return task
}

export function getAllTasks(): Task[]{
    return tasks
}

export function getTaskById(id: number): Task | undefined {
  return tasks.find((task) => task.id === id);
}

export function claimNextTask(
    workerId: string
): Task | undefined {
    const now = Date.now()

    const task = tasks.find(
        (task) => task.status === 'queued' && (!task.nextRetryAt || task.nextRetryAt <= now)
    )

    if(!task) return undefined

    task.status = 'running'
    task.workerId = workerId
    task.attempts++

    return task
}

export function completeTask(id: number){
    const task = getTaskById(id)

    if(task) task.status = 'completed'
}

export function retryTask(id: number){
    const task = getTaskById(id)
    if(!task) return

    if(task.attempts >= task.maxAttempts){
        task.status = 'dead-letter'
        return
    }

    const backOffMins = task.attempts * 3000

    task.status = 'queued'
    task.nextRetryAt = Date.now() + backOffMins
}

export function getMetrics(){
    return{
        total: tasks.length,
        queued: tasks.filter((t) => t.status === 'queued').length,
        running: tasks.filter((t) => t.status === 'running').length,
        completed: tasks.filter((t) => t.status === 'completed').length,
        deadLetter: tasks.filter((t) => t.status === 'dead-letter').length,
    }
}