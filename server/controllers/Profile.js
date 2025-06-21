 const Profile = require('../models/Profile');
const User = require('../models/User');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
const { convertSecondsToDuration } = require('../utils/secToDuration');
const CourseProgress = require("../models/CourseProgress");
const Course = require('../models/Course');

exports.updateProfile = async(req, res) => {
    try{
        //Get Data
        const {
            firstName = "", 
            lastName = "",
            dateOfBirth="",
            about="", 
            contactNumber = "", 
            gender = ""
        } = req.body ;
        //Get User Id
        const id = req.user.id ;


        //Validation
        // if(!contactNumber || !gender || !id){
        //     return res.status(400).json({
        //         success: false,
        //         message: "All Fields are required"
        //     });
        // }


        //Find Profile
        const userDetails = await User.findById(id);
        // const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(userDetails.additionalDetails);

        const userUpdate = await User.findByIdAndUpdate(id, {
            firstName,
            lastName
        })
        await userUpdate.save()


        //Update Profile
        profileDetails.dateOfBirth = dateOfBirth ;
        profileDetails.about = about ;
        profileDetails.contactNumber = contactNumber ;
        profileDetails.gender = gender ;
        
        await profileDetails.save() ;

        const user = await User.findById(id).populate("additionalDetails").exec();

        //Return Response
        return res.status(200).json({
            success: true ,
            message: "Profile Updated Successfully",
            user
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            error: err.message
        })
    }
}

//Delete Profile
exports.deleteAccount = async(req, res) => {
    try{
        //Get Id
        const id = req.user.id ;
        //Validation
        const userDetails = await User.findById(id);
        if(!userDetails){
            res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        //Delete Profile
        await Profile.findByIdAndDelete({_id: userDetails.additionalDetails})
        //Delete User
        await User.findByIdAndDelete({_id: id})
        //Return Response 
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            error: err.message
        })
    }
}

//User All Details
exports.getUserDetails = async(req, res) => {
    try{
        //Get Id
        const id = req.user.id ;
        //Validation and get user details
        console.log(id);
        const user = await User.findById(id).populate("additionalDetails").exec();

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        console.log("user details is ", user);
        //Return Response
        return res.status(200).json({
            success: true,
            message: "User Data fetched Successfully",
            user
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

function isFileTypeSupported(imageType, supportedTypes){
    return supportedTypes.includes(imageType);
}

exports.updateDisplayPicture = async(req, res) => {
    try{
        const displayPicture = req.files.displayPicture ;
        const userId = req.user.id ;

        //Validation Check
        const supportedImageTypes = ["jpg", "jpeg", "png"];

        const fileType = displayPicture.name.split(".")[1].toLowerCase();

        if(!isFileTypeSupported(fileType, supportedImageTypes)){
            return res.status(400).json({
                success: false,
                message: `File format not supported, supported types ${supportedImageTypes}`
            })
        }
        console.log("Checked File type and its ok");

        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        )
        console.log(image);

        const updatedProfile = await User.findByIdAndUpdate(
            {_id: userId},
            {image: image.secure_url},
            {new: true}
        )

        return res.status(200).json({
            success: true,
            message: "Image updated successfully",
            data: updatedProfile
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            error : "Something went wrong",
            message: err.message
        })
    }
}

exports.getEnrolledCourses = async (req, res) => {
    try{
        const userId = req.user.id
        let userDetails = await User.findOne({_id: userId}).populate({
            path: "courses",
            populate: {
                path: "courseContent",
                populate: {
                    path: "subSection"
                }
            }
        }).exec()

        // let userAdditionalDetails = await User.findOne({_id: userId}).populate("additionalDetails").exec();
        // console.log("user additioal details",userAdditionalDetails);

        // console.log("populating user details", userDetails)

        userDetails = userDetails.toObject()

        var SubSectionLength = 0    
        for(var i = 0 ; i < userDetails.courses.length ; i++){
            let totalDurationInSeconds = 0
            SubSectionLength = 0

            for(var j = 0 ; j < userDetails.courses[i].courseContent.length; j++){
                totalDurationInSeconds += userDetails.courses[i].courseContent[j].subSection.reduce((acc, curr)=> acc + parseInt(curr.timeDuration), 0)
                userDetails.courses[i].totalDuration = convertSecondsToDuration(totalDurationInSeconds)
                
                SubSectionLength += userDetails.courses[i].courseContent[j].subSection.length
            }

            let courseProgressCount = await CourseProgress.findOne({
            courseID: userDetails.courses[i]._id,
            userId: userId
        })
        courseProgressCount = courseProgressCount?.completedVideos.length
        
        if(SubSectionLength === 0){
            userDetails.courses[i].progressPercentage = 100
        }else{
            const multiplier = Math.pow(10,2)
            // Check here for error
            userDetails.courses[i].progressPercentage = Math.round((courseProgressCount / SubSectionLength) * 100 * multiplier) / multiplier
        }
    }
    // Try this with moving up in order
        if(!userDetails){
            return res.status(400).json({
                success: false,
                message: `Could not find user with ${userDetails}`
            })
        }
        
        // console.log(userDetails.courses)

        console.log("At the end of backend get user enrolled courses backend");


        return res.status(200).json({
            success: true,
            data: userDetails.courses
        })
        
    }
    catch(err){
        return res.status(500).json({
          success: false,
          message: err.message,
        });
    }
};

exports.instructorDashboard = async(req, res) => {
    try{
        const courseDetails = await Course.find({instructor: req.user.id})

        const courseData = courseDetails.map((course)=>{
            const totalStudentsEnrolled = course.studentsEnrolled.length 
            const totalAmountGenerated = totalStudentsEnrolled * course.price

            const courseDataWithStats = {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                totalStudentsEnrolled,
                totalAmountGenerated
            }

            return courseDataWithStats
        })

        res.status(200).json({
            success: true,
            courses: courseData,
            data: courseData
        })
    }
    catch(err){
        res.status(500).json({
            error: err.message,
            message: "Server Error"
        })
    }
}