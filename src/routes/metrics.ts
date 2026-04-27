import {Router} from 'express'
import {getMetrics} from '../store/taskStore'

const router = Router()

router.get('/', async(req, res) => {
    const metrics = await getMetrics()
    res.json(metrics)
})

export default router