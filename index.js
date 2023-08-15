require('dotenv').config({
  path: `.${process.env.NODE_ENV}.env`
})
const express = require('express')
const { createTransport } = require('nodemailer')

const app = express()
app.use(express.json())

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
    const { email, name, phone, message } = req.body;

    const mailOptions = {
      from: email,
      to: process.env.GMAIL_USER,
      subject: "Заказ",
      html: `
        <h3>${email}</h3><br>
        <h3>${name}</h3><br>
        <h3>${phone}</h3><br>
        <h3>${message}</h3><br>
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