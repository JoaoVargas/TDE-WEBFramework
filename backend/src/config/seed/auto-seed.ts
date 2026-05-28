import type { RowDataPacket } from 'mysql2'
import pool from '@/config/database'
import { seedRestaurants } from '@/config/seed/restaurants.seed'
import { seedUser } from '@/config/seed/user.seed'

export async function autoSeedIfEmpty(): Promise<void> {
  const conn = await pool.getConnection()
  try {
    const [[row]] = await conn.query<RowDataPacket[]>(
      'SELECT COUNT(*) AS count FROM restaurants',
    )
    if ((row as { count: number }).count > 0) return

    console.log('Empty database detected — running seed...')
    await conn.beginTransaction()
    await seedRestaurants(conn)
    await seedUser(conn)
    await conn.commit()
    console.log('Seed completed successfully')
  } catch (err) {
    await conn.rollback()
    console.error('Auto-seed failed, rolled back:', err)
    throw err
  } finally {
    conn.release()
  }
}
