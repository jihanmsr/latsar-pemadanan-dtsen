const mariadb = require('mariadb');
const pool = mariadb.createPool({
  host: "control.capella.idgx.net",
  port: 3306,
  user: "u12228jhr_dtsen",
  password: "inidatapenting123",
  database: "u12228jhr_dtsen",
  connectionLimit: 5,
  connectTimeout: 30000,
});
pool.getConnection()
  .then(conn => {
    console.log("Connected successfully");
    conn.release();
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection failed:", err);
    process.exit(1);
  });
