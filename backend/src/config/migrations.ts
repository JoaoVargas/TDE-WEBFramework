import type mysql from 'mysql2/promise'
import pool from '@/config/database'

interface Migration {
  name: string
  up: (conn: mysql.PoolConnection) => Promise<void>
}

const migrations: Migration[] = [
  {
    name: '001_add_coords_to_addresses',
    up: async (conn) => {
      const [rows] = await conn.query<mysql.RowDataPacket[]>(
        `SELECT COUNT(*) AS count
         FROM information_schema.columns
         WHERE table_schema = DATABASE()
           AND table_name   = 'addresses'
           AND column_name  = 'coords'`,
      )
      if ((rows[0] as { count: number }).count === 0) {
        await conn.query(
          'ALTER TABLE addresses ADD COLUMN coords JSON NULL AFTER number',
        )
      }
    },
  },
]

async function ensureMigrationsTable(
  conn: mysql.PoolConnection,
): Promise<void> {
  await conn.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id         INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name       VARCHAR(255) NOT NULL UNIQUE,
      applied_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

async function appliedMigrations(
  conn: mysql.PoolConnection,
): Promise<Set<string>> {
  const [rows] = await conn.query<mysql.RowDataPacket[]>(
    'SELECT name FROM schema_migrations',
  )
  return new Set((rows as { name: string }[]).map((r) => r.name))
}

export async function runMigrations(): Promise<void> {
  const conn = await pool.getConnection()
  try {
    await ensureMigrationsTable(conn)
    const applied = await appliedMigrations(conn)

    for (const migration of migrations) {
      if (applied.has(migration.name)) continue

      console.log(`Running migration: ${migration.name}`)
      await migration.up(conn)
      await conn.query('INSERT INTO schema_migrations (name) VALUES (?)', [
        migration.name,
      ])
      console.log(`Migration applied: ${migration.name}`)
    }
  } finally {
    conn.release()
  }
}
