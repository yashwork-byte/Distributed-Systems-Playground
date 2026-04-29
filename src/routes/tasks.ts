import {Router, Request, Response} from 'express'

import {createTask,
    getAllTasks,
    getTaskById
} from '../store/taskStore'

import {enqueueTask} from '../queue/producer'

const router = Router()

router.post('/', async(req: Request, res: Response) => {
    const{type, payload} = req.body

    if(!type || typeof type !== 'string'){
        return res.status(400).json({
            error: 'type is required'
        })
    }

    const task = await createTask(type, payload || {})
    await enqueueTask(task.id)
    return res.status(201).json(task)
})

router.get('/', async(req: Request, res: Response) => {
    const tasks = await getAllTasks()
    return res.json(tasks);
})

router.get('/:id', async(req: Request, res: Response) => {
    const id = Number(req.params.id)
    const task = await getTaskById(id)

    if(!task){
        return res.status(404).json({
            error: 'Task not found'
        })
    }

    return res.json(task)
})

export default router