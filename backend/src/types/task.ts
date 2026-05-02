export type TaskStatus = 'queued' | 'running' | 'completed' | 'failed' | 'dead-letter'

export interface Task{
    id: number,
    type: string,
    payload: Record<string, unknown>
    status: TaskStatus,
    createdAt: string,
    workerId?: string
    attempts: number,
    maxAttempts: number,
    nextRetryAt?: number
}