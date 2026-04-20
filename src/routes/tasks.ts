import {Router, Request, Response} from 'express'

import {createTask,
    getAllTasks,
    getTaskById
} from '../store/taskStore'

const router = Router()

router.post('/', (req: Request, res: Response) => {
    const{type, payload} = req.body

    if(!type || typeof type !== 'string'){
        return res.status(400).json({
            error: 'type is required'
        })
    }

    const task = createTask(type, payload || {})
    return res.status(201).json(task)
})

router.get('/', (req: Request, res: Response) => {
    return res.json(getAllTasks());
})

router.get('/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const task = getTaskById(id)

    if(!task){
        return res.status(404).json({
            error: 'Task not found'
        })
    }

    return res.json(task)
})

export default router