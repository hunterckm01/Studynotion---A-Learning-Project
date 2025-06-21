const mongoose = require('mongoose')
const Subsection = require('../models/Subsection')
const CourseProgress = require('../models/CourseProgress')

exports.updateCourseProgress = async(req, res) => {
    try{
        const {courseId, subSectionId} = req.body 
        const userId = req.user.id
        console.log("course id and user id", courseId, userId)

        const subSection = await Subsection.findById(subSectionId)

        if(!subSection){
            return res.status(404).json({
                success: false,
                message: "Invalid SubSection"
        })
        }

        let courseProgress = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId
        })

        console.log("course progress is", courseProgress)

        if(!courseProgress){
            return res.status(404).json({
                success: false,
                message: "Course Progress doesn't exist"
            })
        }else{
            if(courseProgress.completedVideos.includes(subSectionId)){
                return res.status(400).json({
                    error: "Subsection already exist"
                })
            }
            courseProgress.completedVideos.push(subSectionId)
        }

        await courseProgress.save()
        return res.status(200).json({
            success: true,
            message: "Course progress updated successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        })
    }
}