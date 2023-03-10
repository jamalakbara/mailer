const express = require('express');
const app = express();
const cors = require('cors')

const dotenv = require("dotenv")
dotenv.config()

app.use(cors())

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;


const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
  },
});


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.post('/contact-us', (req, res) => {
  const { from, subject, body, name, company } = req.body;
  const mailOptions = {
    from: `${from} <${process.env.USER_EMAIL}>`,
    to: process.env.USER_EMAIL,
    subject,
    html: `
      <table style="table-layout: fixed; width: 100%">
        <colgroup>
          <col style="width: 15%">
          <col style="width: 10%">
          <col style="width: 75%">
        </colgroup>
        <tr>
          <td style="font-weight: bold">Name</td>
          <td style="font-weight: bold">:</td> 
          <td style="font-weight: bold">${name}</td>
        </tr>
        <tr>
          <td style="font-weight: bold">Email</td>
          <td style="font-weight: bold">:</td> 
          <td style="font-weight: bold">${from}</td>
        </tr>
        <tr>
          <td style="font-weight: bold">Company</td>
          <td style="font-weight: bold">:</td> 
          <td style="font-weight: bold">${company}</td>
        </tr>
      </table>
  
      <br/>
      <br/>

      <p>
        ${body}
      </p>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).send({
        status: 500,
        error
      });
    } else {
      res.status(200).send({
        status: 200,
        message: 'Email sent: ' + info.response
      });
    }
  });
});

app.post('/compro', (req, res) => {
  const { to, subject } = req.body;
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to,
    subject,
    html: `
      <p>We sent you the Company Profile in attachment</p>
    `,
    attachments: [
      {
        path: './public/pdf/compro.pdf'
      }
    ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).send({
        status: 500,
        error
      });
    } else {
      res.status(200).send({
        status: 200,
        message: 'Email sent: ' + info.response
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
