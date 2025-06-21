const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

//Reset Password Token
exports.resetPasswordToken = async(req, res) => {
    try{
        //Get email for body
        const {email} = req.body ;
        //Check user for email, email validation
        const user = await User.findOne({email});
        if(!user){
            return res.status(403).json({
                success: false,
                message: "Your mail is not registered with us."
            })
        }
        //Generate Token
        const token = crypto.randomUUID();
        //Update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate(
                                            {email: email},
                                            {
                                                token: token,
                                                resetPasswordExpires: Date.now() + 5*60*1000
                                            },
                                            {new: true}
                                        )
        //Create Url
        //IF ANY ERROR OCCUR AT FRONTEND THEN MATCH THIS URL
        const url = `http://localhost:5173/update-password/${token}`
        
        //Send Mail containing the url 
        await mailSender(email, 
                        "Password Reset Link",
                        `You can reset your password from here ${url}`)
        //Return response
        return res.json({
            success: true,
            message: "Email Sent Successfully, please check email and change password"
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something Went Wrong while sending reset password link"
        })
    }
}

//Reset Password

exports.resetPassword = async(req, res) => {
    try{
        // Data Fetch
        const {password, confirmPassword, token} = req.body ;
        // Validation
        if(password !== confirmPassword){
            return res.status(401).json({
                success: false,
                message: "Password doesn't matched"
            })
        }
        // Get User Details from DB using token
        const userDetails = await User.findOne({token: token});
        // If no entry - Invalid Token
        if(!userDetails){
            res.status(404).json({
                success: false,
                message: "Token is invalid"
            })
        }
        // Token Time Check
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.status(403).json({
                success: false,
                message: "Token is inspired, Please regenerate your token"
            })
        }
        // Hashed Password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Update Password
        await User.findOneAndUpdate(
            {token: token},
            {password: hashedPassword},
            {new: true},
        )
        // Return Response
        return res.status(200).json({
            success: true,
            message: "Password reset Successfully"
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while sending reset pwd mail"
        })
    }
}