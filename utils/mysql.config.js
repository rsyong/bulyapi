const mysql = require("mysql");
const option = {
    host: "cdb-gj0lltxm.bj.tencentcdb.com",
    user: 'root',
    password: 'rsyong950918',
    port: '10253',
    database: 'buly'
}
exports.init = () => {
    let conn = mysql.createConnection(option);
    return conn;
}