require('dotenv').config()
const nodemailer = require('nodemailer');
const utils = require('./utils')
const config = require('../config')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.MAIL_USER,
    pass: config.MAIL_PASS
  }
});

const MailService = {
  send(mail_to, list){
    var mailOptions = {
      from: config.MAIL_USER,
      to: mail_to,
      subject: 'Report',
      html: utils.generateHtml(list),
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}



module.exports = MailService;
