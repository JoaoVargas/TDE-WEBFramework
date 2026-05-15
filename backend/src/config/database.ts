import fs from 'fs'
import mysql from 'mysql2/promise'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const pool = mysql.createPool({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? 'user',
  password: process.env.DB_PASSWORD ?? '123',
  database: process.env.DB_NAME ?? 'frameworkorder',
  waitForConnections: true,
  connectionLimit: 10,
  multipleStatements: true,
  typeCast(field, next) {
    if (field.type === 'DECIMAL' || field.type === 'NEWDECIMAL') {
      const value = field.string()
      return value === null ? null : parseFloat(value)
    }
    return next()
  },
})

export async function checkConnection(): Promise<void> {
  const conn = await pool.getConnection()
  await conn.ping()
  conn.release()
}

export async function initializeDatabase(): Promise<void> {
  const schemaPath = path.join(__dirname, 'schema.sql')
  const sql = fs.readFileSync(schemaPath, 'utf8')
  const conn = await pool.getConnection()
  try {
    await conn.query(sql)
    console.log('Database schema initialized')
  } finally {
    conn.release()
  }
}

export default pool
