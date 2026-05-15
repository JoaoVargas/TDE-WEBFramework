import { Router } from 'express'
import * as dishController from '@/controllers/dish.controller'
import { requireAuth } from '@/middleware/auth.middleware'

const router = Router()

router.get('/', dishController.getAll)
router.get('/:id', dishController.getById)
router.post('/', requireAuth, dishController.create)
router.put('/:id', requireAuth, dishController.update)
router.delete('/:id', requireAuth, dishController.remove)

export default router
