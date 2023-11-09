const mysql = require('mysql2')

exports.db = mysql.createPool({
    host: '13.233.122.219',
    port: 3306,
    user: 'service',
    password: '1q2w3e4r..S',
    database: 'skct_graduation',
    multipleStatements: true
})
  .promise()