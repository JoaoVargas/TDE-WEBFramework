import pool, { initializeDatabase } from '@/config/database'
import { runMigrations } from '@/config/migrations'
import { seedRestaurants } from '@/config/seed/restaurants.seed'
import { seedUser } from '@/config/seed/user.seed'

async function run(): Promise<void> {
  await initializeDatabase()
  await runMigrations()

  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()

    await seedRestaurants(conn)
    await seedUser(conn)

    await conn.commit()
    console.log('Seed completed successfully')
  } catch (err) {
    await conn.rollback()
    console.error('Seed failed, rolled back:', err)
    process.exit(1)
  } finally {
    conn.release()
    await pool.end()
  }
}

void run()
