const mysql = require('mysql2/promise');
async function run() {
  try {
    const conn = await mysql.createConnection({ host: '103.5.51.154', user: 'u12228jhr_dtsen', password: 'inidatapenting123', database: 'u12228jhr_dtsen' });
    console.log("Connected successfully!");
    setInterval(async () => {
      try {
        await conn.query('SELECT 1');
        console.log("Ping successful!");
      } catch (e) {
        console.error("Ping failed!", e.message);
      }
    }, 2000);
  } catch (e) {
    console.error("Connection failed!", e.message);
  }
}
run();
