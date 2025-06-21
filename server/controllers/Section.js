const Section = require('../models/Section');
const SubSection = require("../models/Subsection");
const Course = require('../models/Course');

exports.createSection = async(req, res) => {
    try{
        //Data Fetch
        const {sectionName, courseId} = req.body ;
        //Data Validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: "Missing Properties",
            })
        }
        //Create Section
        const newSection = await Section.create({sectionName})
        //Update Section with object Id
        const updatedCourseDetails = await Course.findByIdAndUpdate(
                                            courseId,
                                            {
                                                $push: {
                                                    courseContent: newSection._id,
                                                }
                                            },
                                            {new: true}
        ).populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            }
        }).exec();
        //HW: USE POPULATE TO REPLACE SECTIONS/SUB-SECTIONS BOTH IN UPDATED COURSE DETAILS
        //Return Response
        return res.status(200).json({
            success: true,
            message: "Section Created Successfullly",
            updatedCourseDetails
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Unable to create Section, please try again",
            error: err.message
        });
    }
}

exports.updateSection = async(req, res) => {
    try{
        //Data Input
        const {sectionName, sectionId, courseId} = req.body ;

        console.log("in the update section backend")
        //Data Validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success: false,
                message: "Missing Properties",
            })
        }

        //Update Data
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new: true});

        const course = await Course.findById(courseId).populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        }).exec()

        //Return Response
        return res.status(200).json({
            success: true,
            message: "Section Updated Successfully",
            data: course
        })
    }   
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Unable to create Section, please try again",
            error: err.message,
        });
    }
}

exports.deleteSection = async(req, res) => {
    try{
        //Get Id
        const {sectionId, courseId} = req.body ;
        //Use Find by id and delete

        //Check for the alternative option
        const section = await Section.findById(sectionId);

        await Course.findByIdAndUpdate(courseId, {
            $pull: {
                courseContent: sectionId
            }
        })

        if(!section){
            return res.status(404).json({
                success: false,
                message: "Section Not Found"
            })
        }

        //Delete All Sub Sections

        await SubSection.deleteMany({ _id: {$in: section.subSection}});

        await Section.findByIdAndDelete(sectionId);

        const course = await Course.findById(courseId).populate({
            path : "courseContent",
            populate: {
                path: "subSection"
            }
        }).exec();
        
        //Return response
        return res.status(200).json({
            success: true,
            message: "Section Deleted Successfully",
            data: course
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            messaage: "Unable to delete the Section, Please try again later",
            error: err.message,
        })
    }
}