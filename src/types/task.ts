export type TaskStatus = 'queued' | 'running' | 'completed' | 'failed'

export interface Task{
    id: number,
    type: string,
    payload: Record<string, unknown>
    status: TaskStatus,
    createdAt: string,
    workerId?: string
}