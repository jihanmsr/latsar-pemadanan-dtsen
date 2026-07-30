import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

const dbUrl = process.env.DATABASE_URL || "mysql://u12228jhr_dtsen:inidatapenting123@103.5.51.154:3306/u12228jhr_dtsen";
const parsed = new URL(dbUrl);

const dbConfig = {
  host: parsed.hostname,
  port: Number(parsed.port) || 3306,
  user: decodeURIComponent(parsed.username),
  password: decodeURIComponent(parsed.password),
  database: parsed.pathname.slice(1),
};

export async function getConnection() {
  throw new Error("getConnection is disabled in child_process mode");
}

export async function query(sql: string, values?: any[]): Promise<any> {
  const script = `
    const mysql = require('mysql2/promise');
    async function run() {
      try {
        const conn = await mysql.createConnection(${JSON.stringify(dbConfig)});
        const [rows] = await conn.query(process.argv[1], JSON.parse(process.argv[2]));
        console.log(JSON.stringify({ success: true, data: rows }));
        await conn.end();
      } catch (e) {
        console.log(JSON.stringify({ success: false, error: e.message }));
      }
    }
    run();
  `;
  
  const env = { ...process.env };
  delete env.NODE_OPTIONS; // Prevent Next.js from patching the child process!

  const { stdout } = await execAsync(`node -e "${script.replace(/"/g, '\\"')}" "${sql.replace(/"/g, '\\"')}" "${JSON.stringify(values || []).replace(/"/g, '\\"')}"`, { env });
  const result = JSON.parse(stdout);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

export async function batch(sql: string, values: any[][]): Promise<any> {
  const script = `
    const mysql = require('mysql2/promise');
    async function run() {
      let conn;
      try {
        conn = await mysql.createConnection(${JSON.stringify(dbConfig)});
        await conn.beginTransaction();
        const vals = JSON.parse(process.argv[2]);
        for (const val of vals) {
          await conn.query(process.argv[1], val);
        }
        await conn.commit();
        console.log(JSON.stringify({ success: true }));
      } catch (e) {
        if (conn) await conn.rollback();
        console.log(JSON.stringify({ success: false, error: e.message }));
      } finally {
        if (conn) await conn.end();
      }
    }
    run();
  `;

  const env = { ...process.env };
  delete env.NODE_OPTIONS;

  const { stdout } = await execAsync(`node -e "${script.replace(/"/g, '\\"')}" "${sql.replace(/"/g, '\\"')}" "${JSON.stringify(values).replace(/"/g, '\\"')}"`, { env });
  const result = JSON.parse(stdout);
  if (!result.success) throw new Error(result.error);
  return result;
}

