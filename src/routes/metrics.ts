import {Router} from 'express'
import {getMetrics} from '../store/taskStore'

const router = Router()

router.get('/', (req, res) => {
    res.json(getMetrics())
})

export default router