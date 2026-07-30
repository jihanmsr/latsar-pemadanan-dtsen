const mariadb = require('mariadb');
const pool = mariadb.createPool({
  host: '103.5.51.154', 
  port: 3306, 
  user: 'u12228jhr_dtsen', 
  password: 'inidatapenting123', 
  database: 'u12228jhr_dtsen',
  connectionLimit: 1
});
pool.getConnection()
  .then(async conn => {
    const tables = await conn.query("SHOW TABLES");
    console.log(tables);
    conn.release();
    pool.end();
  })
  .catch(err => {
    console.error("Failed to connect:", err);
  });
