const mysql = require('mysql2')

exports.db = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1q2w3e4r5t6y7u8i9o0P',
    database: 'revise-ethindia',
    multipleStatements: true
})
  .promise()