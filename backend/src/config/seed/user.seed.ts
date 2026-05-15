import bcrypt from 'bcrypt'
import type mysql from 'mysql2/promise'
import { v4 as uuidv4 } from 'uuid'

const SALT_ROUNDS = 10

export async function seedUser(conn: mysql.PoolConnection): Promise<void> {
  console.log('Seeding user...')

  const id = uuidv4()
  const password = await bcrypt.hash('senha123', SALT_ROUNDS)

  await conn.query(
    `INSERT INTO users (id, name, email, phone_number, password)
     VALUES (?, ?, ?, ?, ?)`,
    [id, 'João Silva', 'joao@example.com', '+55 41 99999-0000', password],
  )

  console.log(`Seeded user: joao@example.com (password: senha123)`)
}
