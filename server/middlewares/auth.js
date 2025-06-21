const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

//Auth
exports.auth = async(req, res, next) => {
    try{
        //Extract Token
        console.log("Requerst body is", req.body)
        const token = req.cookies.token 
                       || req.body.token 
                       || req.header("Authorization").replace("Bearer ", "" );
        //If Token Missing, then return response
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token is Missing"
            })
        }

        //Verify the token
        try{
            const decode =  jwt.verify(token, process.env.JWT_SECRET);
            // console.log(decode);
            req.user = decode
        }
        catch(err){
            //Verification Issue
            console.log("Token is invalid")
            return res.status(401).json({
                success: false,
                message: "Token is invalid",
                error: err
            })
        }
        next();
    }
    catch(err){
        console.log(err);
        res.status(401).json({
            success: false,
            message: "Something went wrong while validating the token"
        })
    }
}

//isStudent

exports.isStudent = async(req, res, next) => {
    try{
        if(req.user.accountType !== "Student"){
            res.status(401).json({
                success: false,
                message: "This is a Protected Route for Students Only"
            })
        }
        next();
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'User role cannot be verified'
        })
    }
}

//isInstructor

exports.isInstructor = async(req, res, next) => {
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for instructor only"
            })
        }
        next();
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "User role cannot be verified"
        })
    }
}

//isAdmin
exports.isAdmin = async(req, res, next)  => {
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This route is protected for Admin only"
            })
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified"
        })
    }
}