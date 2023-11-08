const express = require("express");
const app = express();
const {db} = require('./db');
const path = require('path')
console.log(__dirname + '/static');

app.use('/static', express.static(__dirname + '/static'));
app.use(express.json());
app.set('view engine', 'ejs');

app.get('/skct', function(req, res) {
    res.render('index');
  });

  app.get('/skct/register', function(req, res) {
    res.render('register');
  });

  app.get("/skct/api", (req, res) => {
    db.query('SELECT * from users LIMIT 1', (err, rows) => {
        if (err) throw err;
        console.log('The data from users table are: \n', rows);
        connection.end();
    });
});

app.post("/skct/api/register", (req, res) => {
  try {
    const {name, regno, batch, branch, phone_number, email, current_status, details_curr_status,will_participate, acc_count} = req.body;
    console.log({name, regno, batch, branch, phone_number, email, current_status, details_curr_status,will_participate, acc_count});
    res.send({status: true, message: 'Successfully Registered!', result: {tagId: '1uisd'} })
  } catch (error) {
    res.send({status: false, message: error?.message || 'Something Went Wrong!'})
  } 
});
 
app.listen(3000, (err) => {
    if(err) console.log('Err in Starting', err);
    // db.query('SELECT 1')
    console.log('Server is running at port 3000');
});