import { Router } from 'express'
import * as restaurantController from '@/controllers/restaurant.controller'
import * as restaurantDishController from '@/controllers/restaurantDish.controller'
import { requireAuth } from '@/middleware/auth.middleware'

const router = Router()

router.get('/', restaurantController.getAll)
router.get('/:id', restaurantController.getById)
router.post('/', requireAuth, restaurantController.create)
router.put('/:id', requireAuth, restaurantController.update)
router.delete('/:id', requireAuth, restaurantController.remove)

router.get('/:restaurantId/dishes', restaurantDishController.getByRestaurant)
router.post(
  '/:restaurantId/dishes',
  requireAuth,
  restaurantDishController.addDish,
)
router.patch(
  '/:restaurantId/dishes/:dishId',
  requireAuth,
  restaurantDishController.updateStock,
)
router.delete(
  '/:restaurantId/dishes/:dishId',
  requireAuth,
  restaurantDishController.removeDish,
)

export default router
