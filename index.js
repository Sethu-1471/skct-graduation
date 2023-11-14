const express = require("express");
const { PrismaClient } = require('@prisma/client')
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');


const app = express();
const client = new PrismaClient()
dotenv.config();

console.log(process.env.MAIL_PASSWORD);

const generateRandomId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters[randomIndex];
  }
  return id;
}

const sendMail = async(email, id, wp, mc) =>{
  var transporter =  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'graduation.2022@skct.edu.in',
      pass: process.env.MAIL_PASSWORD
    }
  });
  
  var mailOptions = {
    from: 'graduation.2022@skct.edu.in',
    to: email,
    subject: 'Welcome to SKCT 34th Graduation Day! - Registration Confirmation',
    html: '<!DOCTYPE html>'+
        '<html><head><title>Welcome to SKCT 34th Graduation Day!</title>'+
        '</head><body><div>'+
        `<p>Dear Graduate,</p>`+
        '<p>Warm wishes and Greetings from Sri Krishna College of Technology, Coimbatore! You are cordially invited to attend the Graduation ceremony  which is to be held on 19th November 2023.</p>'+
        `<p><strong>${wp? 'Your registration for the 34th Graduation Day is confirmed.' : 'Sorry to hear that, you are not going to attend Graduation Ceremony'}!.</strong></p>`+
        `<p>${wp? 'Here is your entry pass ID: ' + id: 'If it done by mistake, Please contact your class tutor for modification.'}</p>`+
        `<p style="color: #bf3d23;">Only graduates are allowed inside the hall. Youtube live streaming is available for others to watch.</p>` +
        `<p style="margin: 5px 0px;color: #2372BF !important;font-weight:700">
                    NOTE:
                </p>
                <ol>
                    <li>
                      All Graduands shall come only in formal attire.
                    </li>
                    <li>
                      No one shall enter the Ceremony Hall after 9.30 a.m.
                    </li>
                    <li>
                      All Graduands shall handover the Mobile Phones at the Registration Desk.
                    </li>
                    <li>
                      Either father or mother / Guardian can accompany each Graduand.
                    </li>
                    <li>
                       No spot registration.
                    </li>
                    <li>
                        Kids are strictly not allowed inside the hall.
                    </li>
                    <li>
                        All the arrangements are made for graduates and 1 accompanying person.
                    </li>
                </ol>
                <p>
                The graduands are asked to pay Rs.600/- towards caution deposit for Graduation Robes (Rs.500/- will
                be refunded on return of Graduation Robes) and Rs.300/- for Graduation Photo of the Individual in
                the respective counters.
            </p>`+
        `<p>${wp ? "We are very happy to see you and your parents/guests on the memorable and enjoyable day to celebrate GRADUATION CEREMONY." : ''}</p>`+
        '<p>Thank You!</p>'+
        '</div></body></html>'
  };
  
  return new Promise((resolve, reject) => {
    return transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log('Email sent: ' + info.response);
        resolve(info);
      }
    });
  })
}

app.use('/static', express.static(__dirname + '/static'));
app.use(express.json());
app.set('view engine', 'ejs');

app.get('/skct/sendmail', async(req,res) =>{
  try {
    const result = await sendMail('sethu1471@gmail.com','sethu1471', true, 4) 
    res.send({status: true, result})
  } catch (error) {
    res.send({status: false, message: error})

  }
} )

app.get('/skct', function(req, res) {
  res.render('index');
});

app.get('/skct/graduation/list', async (req, res) => {
  const countResult = await client.registrations.groupBy({
    by: ['branch', 'batch', 'regno'],
    _count: {
      branch: true,
    },
    where:{
      deletedAt: null
    }
  });
  const totalResult =  await client.registrations.findMany({
    where:{
      deletedAt: null
    }
  });
  const willAttend = totalResult.filter(val => val.will_participate)
  res.render('view', {
    count: countResult,
    total: totalResult.length,
    willAttend:willAttend.length,
    notAttend: totalResult.length - willAttend.length
});
});

app.get('/skct/graduation/list/:dept_name', async (req, res) => {
  const {dept_name} =  req.params;
  const result = await client.registrations.findMany({
    where:{
      branch: dept_name,
      deletedAt: null
    },
    orderBy:{
      createdAt:'asc'
    }
  });
  const willAttend = result.filter(val => val.will_participate);
  res.render('viewStudents', {
    result: result,
    willAttend: willAttend.length,
    notAttend: result.length - willAttend.length,
    dept_name
});
});

  app.get('/skct/register', function(req, res) {
    res.render('register');
  });

app.post("/skct/api/register", async(req, res) => {
  try {
    const {name, regno, batch, branch, phone_number, email, current_status, details_curr_status,will_participate, acc_count,emp_mailid} = req.body;
    console.log({name, regno, batch, branch, phone_number, email, current_status, details_curr_status,will_participate, acc_count,emp_mailid});
    if(isNaN(+acc_count)){
      throw {message: 'Accompanying Count is Invalid!'}
    }
    const checkAlredyRegistered = await client.registrations.findFirst({
      where:{
        regno: {
          equals: regno.trim(),
          mode: 'insensitive'
        },
        deletedAt: null
      }
    });
    if(checkAlredyRegistered){
      throw {message: 'You already registered!', alreadyRegitered: true }
    }
    const result = await client.registrations.create({
      data:{
        name: name || '',
        regno: regno.trim() || '',
        uniqueId: generateRandomId().toLowerCase(),
        acc_count: +acc_count,
        batch: batch || '',
        branch: branch || '',
        current_status:current_status || '',
        details_curr_status: details_curr_status || '',
        will_participate: will_participate.toLowerCase() === 'yes',
        phone_number: phone_number,
        email: email || '',
        emp_mailid: emp_mailid || ''
      }
    })
    if(!result) throw {message:'Problem in Saving Data!'}
    try {
      const mailResult = await sendMail(email, result?.uniqueId, result?.will_participate, result?.acc_count);
      console.log(mailResult);
    } catch (error) {
      console.log("[ERROR IN SENDING MAIL]", error);
    }
     res.send({status: true, message: 'Successfully Registered!', result: {tagId: result.uniqueId, id: result.id} })
  } catch (error) {
    console.log(error);
    res.send({status: false, alreadyRegitered: error?.alreadyRegitered || false, message: error?.message || 'Something Went Wrong!'})
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
