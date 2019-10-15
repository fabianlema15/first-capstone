require('dotenv').config()
const utils = require('./utils')
const config = require('../config')
const sgMail = require('@sendgrid/mail');

const MailService = {
  send(mail_to, list){
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: mail_to,
      from: process.env.SENDGRID_USERNAME,
      subject: 'Report',
      html: utils.generateHtml(list),
    };
    sgMail.send(msg);
  }
}



module.exports = MailService;
