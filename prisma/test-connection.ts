import * as mariadb from 'mariadb';

async function test() {
  const url = process.env.DATABASE_URL!;
  console.log('DATABASE_URL:', url);

  const parsed = new URL(url);
  const config: mariadb.PoolConfig = {
    host: parsed.hostname,
    port: parseInt(parsed.port || '3306'),
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, ''),
    connectionLimit: 3,
  };
  console.log('Parsed host:', config.host);
  console.log('Parsed port:', config.port);
  console.log('Parsed user:', config.user);
  console.log('Parsed db:', config.database);

  const pool = mariadb.createPool(config);
  const conn = await pool.getConnection();
  const rows = await conn.query('SELECT 1 as ping, NOW() as server_time');
  console.log('✅ Direct mariadb OK:', rows);
  conn.release();
  await pool.end();
}

test().catch(e => {
  console.error('❌ Error:', e.message, e.cause?.message ?? '');
  process.exit(1);
});
