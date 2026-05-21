import { Router } from 'express'
import * as categoryController from '@/controllers/category.controller'
import { requireAuth } from '@/middleware/auth.middleware'

const router = Router()

router.get('/', categoryController.getAll)
router.get('/:id', categoryController.getById)
router.post('/', requireAuth, categoryController.create)
router.put('/:id', requireAuth, categoryController.update)
router.delete('/:id', requireAuth, categoryController.remove)

export default router
