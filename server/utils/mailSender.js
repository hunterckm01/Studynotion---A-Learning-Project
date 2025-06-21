const nodemailer = require('nodemailer');
require("dotenv").config();

const mailSender = async(email, title, body) => {
  // console.log("entered mail sender");
    try{
        
        let transporter = nodemailer.createTransport({
          host: process.env.MAIL_HOST,
          // port: 587, 
          // secure: false,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        });
        // console.log("exit transporter");

        // console.log("entring info");
        let info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        })
        // console.log("exit info");
        console.log("info is : ", info);
        return info ;
    }
    catch(err){
        console.log("error is : ", err.message);
    }
}

module.exports = mailSender ;