const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');
const emailTemplate = require("../mail/emailVerificationTempelate"); 

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,   
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 10 * 60,
    },
});

// A Function To Send Emails
async function sendVerificationEmail(email, otp){
    try{
        const mailResponse = await mailSender(
          email,
          "Verification Email from StudyNotion",
          emailTemplate(otp)
        );
        console.log("Email sent successfully", mailResponse);
    }
    catch(err){
        
        console.log("Error Occured while sending mails: ", err);
        throw err ;
    }
}

OTPSchema.pre("save", async function(next){
    try{
        console.log("Otp requirements", this)
        await sendVerificationEmail(this.email, this.otp);
        next();
    }
    catch(err){
        console.error("Error sending verification email", err);
        next(err);
    }
})
module.exports = mongoose.model("OTP", OTPSchema);