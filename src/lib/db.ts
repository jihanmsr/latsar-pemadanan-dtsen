import mysql from 'mysql2/promise';

const dbUrl = process.env.DATABASE_URL || "mysql://u12228jhr_dtsen:inidatapenting123@103.5.51.154:3306/u12228jhr_dtsen";
const parsed = new URL(dbUrl);

const dbConfig = {
  host: parsed.hostname,
  port: Number(parsed.port) || 3306,
  user: decodeURIComponent(parsed.username),
  password: decodeURIComponent(parsed.password),
  database: parsed.pathname.slice(1),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

// Use a global pool to prevent connection leaks during Next.js hot reloads
const globalForDb = globalThis as unknown as {
  mysqlPool: mysql.Pool | undefined;
};

export const pool = globalForDb.mysqlPool ?? mysql.createPool(dbConfig);

if (process.env.NODE_ENV !== 'production') {
  globalForDb.mysqlPool = pool;
}

export async function query(sql: string, values?: any[]): Promise<any> {
  try {
    const [rows] = await pool.query(sql, values);
    return rows;
  } catch (err: any) {
    console.error("[DB Query Error]", err);
    throw err;
  }
}

export async function batch(sql: string, values: any[][]): Promise<any> {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const val of values) {
      await conn.query(sql, val);
    }
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
