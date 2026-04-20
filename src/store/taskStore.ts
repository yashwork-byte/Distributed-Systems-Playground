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
    }

    tasks.push(task)
    return task
}

export function getAllTasks(): Task[]{
    return tasks
}

export function getTaskById(id : number): Task | undefined {
    return tasks.find((task) => task.id === id)
}

export function claimNextTask(
    workerId: string
): Task | undefined {
    const task = tasks.find(
        (task) => task.status === 'queued'
    )

    if(!task) return undefined

    task.status = 'running'
    task.workerId = workerId

    return task
}

export function completeTask(id: number){
    const task = getTaskById(id)

    if(!task) return

    task.status = 'completed'
}

export function failTask(id: number){
    const task = getTaskById(id)

    if(!task) return

    task.status = 'failed'
}