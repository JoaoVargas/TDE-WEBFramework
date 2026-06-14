import bcrypt from 'bcrypt'
import { type Response } from 'express'
import type { AuthRequest } from '@/middleware/auth.middleware'
import userModel from '@/models/user.model'
import userPfpModel from '@/models/userPfp.model'
import type { UpdateUserPayload } from '@/types/api/user'

const SALT_ROUNDS = 10

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  const user = await userModel.findById(req.userId!)
  if (!user) {
    res.status(404).json({ data: null, error: 'User not found' })
    return
  }

  const pfp = await userPfpModel.findByUserId(user.id)

  res.json({
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
      has_pfp: !!pfp,
    },
    error: null,
  })
}

export async function updateMe(req: AuthRequest, res: Response): Promise<void> {
  const { name, email, current_password, new_password } =
    req.body as UpdateUserPayload

  const user = await userModel.findById(req.userId!)
  if (!user) {
    res.status(404).json({ data: null, error: 'User not found' })
    return
  }

  const updateData: { name?: string; email?: string; hashedPassword?: string } =
    {}

  if (name !== undefined) {
    if (!name.trim()) {
      res.status(400).json({ data: null, error: 'Name cannot be empty' })
      return
    }
    updateData.name = name.trim()
  }

  if (email !== undefined) {
    if (!email.trim()) {
      res.status(400).json({ data: null, error: 'Email cannot be empty' })
      return
    }
    if (await userModel.emailExistsForOther(email, user.id)) {
      res.status(409).json({ data: null, error: 'Email already in use' })
      return
    }
    updateData.email = email.trim()
  }

  if (new_password !== undefined) {
    if (!current_password) {
      res
        .status(400)
        .json({ data: null, error: 'current_password is required to change password' })
      return
    }
    const valid = await bcrypt.compare(current_password, user.password)
    if (!valid) {
      res.status(401).json({ data: null, error: 'Current password is incorrect' })
      return
    }
    if (new_password.length < 8) {
      res
        .status(400)
        .json({ data: null, error: 'New password must be at least 8 characters' })
      return
    }
    updateData.hashedPassword = await bcrypt.hash(new_password, SALT_ROUNDS)
  }

  const updated = await userModel.update(user.id, updateData)
  if (!updated) {
    res.status(404).json({ data: null, error: 'User not found' })
    return
  }

  res.json({
    data: {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone_number: updated.phone_number,
    },
    error: null,
  })
}

export async function getPfp(req: AuthRequest, res: Response): Promise<void> {
  const pfp = await userPfpModel.findByUserId(req.userId!)
  if (!pfp) {
    res.status(404).json({ data: null, error: 'No profile picture found' })
    return
  }
  res.json({
    data: { mime_type: pfp.mime_type, image_data: pfp.image_data },
    error: null,
  })
}

export async function uploadPfp(req: AuthRequest, res: Response): Promise<void> {
  if (!req.file) {
    res.status(400).json({ data: null, error: 'No file provided' })
    return
  }

  const mimeType = req.file.mimetype
  const imageData = req.file.buffer.toString('base64')

  const pfp = await userPfpModel.upsert(req.userId!, mimeType, imageData)

  res.json({
    data: { mime_type: pfp.mime_type, image_data: pfp.image_data },
    error: null,
  })
}

export async function deletePfp(req: AuthRequest, res: Response): Promise<void> {
  await userPfpModel.deleteByUserId(req.userId!)
  res.json({ data: null, error: null })
}
