const User = require('../models/User')
const OTP = require('../models/OTP')
const otpGenerator = require('otp-generator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Profile = require('../models/Profile')
const mailSender = require('../utils/mailSender')
const { passwordUpdated } = require('../mail/passwordUpdate')
require('dotenv').config();

// SEND OTP
exports.sendOTP = async(req, res) => {

    try{
        const {email} = req.body ;
    
        //Check If already Exists
        const checkUserPresent = await User.findOne({email});
    
        if(checkUserPresent){
            return res.status(401).json({
                success: false,
                message: "User Already Exist"
            })
        }

        //Generate Otp
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        } );

        console.log("Otp Generated: ", otp);

        //Check Unique Otp Or Not
        const result = await OTP.findOne({ otp: otp });
        
        while(result){
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({otp: otp});
        }

        console.log("result is" , result);
        
        const otpPayload = {email, otp};
        // console.log(otpPayload);

        //Create an entry for OTP
        const otpBody = await OTP.create(otpPayload);
        console.log("otp body : ", otpBody);

        res.status(200).json({
            success: true, 
            message: 'OTP sent Successfully',
            otp,
        })
    }
    catch(err){
        console.log("In the catch block");
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message,
            
        })
    }
}

//SIGNUP
exports.signUp = async(req, res) => {

    try{
        //Data Fetch from Request Body
        const { accountType, firstName, lastName, email, password, confirmPassword, otp, contactNumber } = req.body; ;

        console.log("In the backend", accountType, firstName, lastName, email, password, confirmPassword, otp);

        //Do Validation
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            res.status(403).json({
                success: false,
                message: "All Fields are Required",
                error: err.message
            })
        }
        //Match both Passwords
    
        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password Value doesn't matched, Please Try Again"
            })
        }
    
        //Check User Already Exists or not
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User is already Registered"
            })
        }
    
        //Find Most Recent Otp
        // const recentOtp = await OTP.findOne({email}).sort({createdAt:-1});
        const recentOtp = await OTP.find({email}).sort({createdAt: -1}).limit(1);
        console.log("recent otp is : ", recentOtp);
    
        if(recentOtp.length == 0){
            return res.status(400).json({
                success: false,
                message: "OTP Not Found"
            })
        }
        else if(otp != recentOtp[0].otp){
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            })
        }
    
        //Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        //Entry Created in DB
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null
        });
    
        const user = await User.create({
            firstName,
            lastName,
            email, 
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/9.x/initials/svg?seed=${firstName} ${lastName}`
        })

        return res.status(200).json({
            success: true,
            message: "User Registered Successfully",
            user
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please Try Again",
            error: err.message
        })
    }
}

//LOGIN
exports.login = async(req, res) => {
    try{
        //Get Data from Request body
        const {email, password} = req.body ;

        //Validation Data
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "All Fields are Required, Please Try Again"
            })
        }

        //Check User Existence
        const user = await User.findOne({ email }).populate(
          "additionalDetails");
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User is Not Registered, Please Sign Up"
            })
        }

        //Generate JWT Token, after password matching
        if(await bcrypt.compare(password, user.password)){
            const payload = {
                 email: user.email,
                 id: user._id,
                 accountType: user.accountType,
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "6h"
            })
            user.token = token ;
            user.password = undefined ;

            //Create Cookie and Send Response
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user, 
                message: "Logged in Successfully"
            })
        }
        else{
            return res.status(401).json({
                success: false,
                message: "Password is Incorrect"
            })
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Login Failure, Please Try Again",
            error: err.message
        })
    }
}

//CHANGE PASSWORD
exports.changePassword = async(req, res) => {
    try {
      // Get user data from req.user
      const userDetails = await User.findById(req.user.id);

      //Get Data from Request Body
      //Get OldPassword, newPassword, confirmNewPassword
      const { oldPassword, newPassword} = req.body;

      //Validation
      if (!oldPassword || !newPassword ) {
        return res.status(400).json({
          success: false,
          message: "All Fields are Mandatory",
        });
      }

    //   if (newPassword !== confirmNewPassword) {
    //     return res.status(401).json({
    //       success: false,
    //       message: "New Passwords does not matched",
    //     });
    //   }

      // Validate Old Password
      const isPasswordMatch = await bcrypt.compare(
        oldPassword, userDetails.password
      )

      if(!isPasswordMatch){
        return res.status(401).json({
            success: false,
            message: "Old Password doesn't matched"
        })
      }

      //Update Password from Database
      const encryptedPassword = await bcrypt.hash(newPassword, 10);
      const updatedUserDetails = await User.findByIdAndUpdate(
        req.user.id,
        { password: encryptedPassword },
        { new: true }
      );

      //Send mail - Password Updated
      try {
        const emailResponse = await mailSender(
          updatedUserDetails.email,
          "Password for your account has been updated",
          passwordUpdated(
            updatedUserDetails.email,
            `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
          )
        );
        console.log("Email sent successfully:", emailResponse.response);
      } catch (error) {
        // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
        console.error("Error occurred while sending email:", error);
        return res.status(500).json({
          success: false,
          message: "Error occurred while sending email",
          error: error.message,
        });
      }

      //Return Response
      return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" });
    } catch (error) {
      // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while updating password:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while updating password",
        error: error.message,
      });
    }
}

