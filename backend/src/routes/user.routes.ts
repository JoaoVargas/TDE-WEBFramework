import { Router } from 'express'
import multer from 'multer'
import * as userController from '@/controllers/user.controller'
import { requireAuth } from '@/middleware/auth.middleware'

const router = Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  },
})

router.get('/me', requireAuth, (req, res) => { void userController.getMe(req, res) })
router.put('/me', requireAuth, (req, res) => { void userController.updateMe(req, res) })
router.get('/me/pfp', requireAuth, (req, res) => { void userController.getPfp(req, res) })
router.post('/me/pfp', requireAuth, upload.single('image'), (req, res) => { void userController.uploadPfp(req, res) })
router.delete('/me/pfp', requireAuth, (req, res) => { void userController.deletePfp(req, res) })

export default router
