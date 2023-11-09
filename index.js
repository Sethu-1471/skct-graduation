const express = require("express");
const app = express();
const { PrismaClient } = require('@prisma/client')

const client = new PrismaClient()

const generateRandomId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters[randomIndex];
  }
  return id;
}

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

app.post("/skct/api/register", async(req, res) => {
  try {
    const {name, regno, batch, branch, phone_number, email, current_status, details_curr_status,will_participate, acc_count} = req.body;
    console.log({name, regno, batch, branch, phone_number, email, current_status, details_curr_status,will_participate, acc_count});
    if(isNaN(+acc_count)){
      throw {message:'ACC_Count is not a number'}
    }
    const result = await client.registrations.create({
      data:{
        name: name || '',
        regno: regno || '',
        uniqueId: generateRandomId(),
        acc_count: +acc_count || '',
        batch: batch || '',
        branch: branch || '',
        current_status:current_status || '',
        details_curr_status: details_curr_status || '',
        will_participate: will_participate.toLowerCase() === 'yes',
        phone_number: phone_number,
        email: email || '',

      }
    })
     res.send({status: true, message: 'Successfully Registered!', result: {tagId: result.uniqueId, id: result.id} })
  } catch (error) {
    console.log(error);
    res.send({status: false, message: error?.message || 'Something Went Wrong!'})
  } 
});
 

const connectPrisma = () => {
  // const client = new PrismaClient();
  return client.$connect();
}

connectPrisma().then(() => {
  console.log('[DATABASE] Connected!');
  app.listen(3000, async(err) => {
    if(err) console.log('Err in Starting', err);
    const result = await client.$queryRaw`SELECT 1`;
    console.log('Server is running at port 3000', result);
});
}).catch((error) => {
  console.log(
    `[prisma] Error connecting to database with error -> ${error}`
  );
});
