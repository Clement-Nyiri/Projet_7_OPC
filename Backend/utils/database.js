const mysql = require('mysql2');

exports.connect = () =>{
    const connection = mysql.createConnection({
        host: 'localhost',
        user:'root',
        password:'',
        database:'groupomania'
    });
    return connection;
}
 
exports.pool = () => {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        database: 'groupomania',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
    return pool;
}