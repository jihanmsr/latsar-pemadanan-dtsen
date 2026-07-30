const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function run() {
  try {
    const conn = await mysql.createConnection({ host: '103.5.51.154', user: 'u12228jhr_dtsen', password: 'inidatapenting123', database: 'u12228jhr_dtsen' });
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Using UUID() function might not work if it's not supported by this DB version, but we'll try standard UUID.
    await conn.query(`
      INSERT INTO users (id, email, password, name, role, instansi) 
      VALUES (UUID(), 'admin', ?, 'Admin BPS (Test)', 'ADMIN', 'BPS Pusat')
      ON DUPLICATE KEY UPDATE password = ?, name = 'Admin BPS (Test)'
    `, [hashedPassword, hashedPassword]);
    
    console.log("SUCCESS! User 'admin' created.");
    await conn.end();
  } catch (e) {
    console.error("ERROR:", e.message);
  }
}
run();
