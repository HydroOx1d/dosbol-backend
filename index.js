require('dotenv').config({
  path: `.${process.env.NODE_ENV}.env`
})
const express = require('express')
const { createTransport } = require('nodemailer')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 3000

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD
  },
});

app.post('/feedback', (req, res) => {
  try {
    const { phone, loadingAddress, loadingDate, loadingStartTime, unloadingAddress, unloadingDate, unloadingStartTime } = req.body;

    const mailOptions = {
      from: "no-reply@gmail.com",
      to: process.env.GMAIL_USER,
      subject: "Request",
      html: `
        <h3>Phone number: ${phone}</h3>
        <h3>Loading address: ${loadingAddress}</h3>
        <h3>Loading date: ${loadingDate}</h3>
        <h3>Loading start time: ${loadingStartTime}</h3>
        <h3>Unloading address: ${unloadingAddress}</h3>
        <h3>Unloading date: ${unloadingDate}</h3>
        <h3>Unloading start time: ${unloadingStartTime}</h3>
      `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);

        return res.json({
          success: true
        })
      }
    });
  } catch(err) {
    console.log(err)
    res.status(500).json({
      msg: "Something went wrong"
    })
  }
})


app.listen(PORT, () => {
  console.log('Listen port ' + PORT)
})