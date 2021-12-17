module.exports = async function query() {
  let mysql = require("mysql2/promise");
  let cfg = {
    host: "172.16.100.109",
    user: "root",
    password: "root",
    database: "jd",
  };
  const connection = await mysql.createConnection(cfg);

  const [rows, filed] = await connection.execute(
    `SELECT camera_ip,ws_port,http_port FROM sys_workshop WHERE camera_ip IS NOT NULL AND ws_port IS NOT NULL AND http_port IS NOT NULL`
  );
  return rows;
};
