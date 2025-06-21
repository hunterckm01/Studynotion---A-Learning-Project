const SubSection = require('../models/Subsection');
const Section = require('../models/Section');
const { uploadImageToCloudinary } = require('../utils/imageUploader');

//Create Sub Section
exports.createSubSection = async(req, res) => {
    try{
        //Fetch Data from Req body
        const {sectionId, title, description} = req.body ;
        //Extract File/Video
        const video = req.files.videoFile ;
        //Perform Validation
        if(!sectionId || !title || !description || !video){f    
            console.log("section is ", sectionId)
            console.log("section is ", title)
            console.log("section is ", description)
            console.log("section is ", video);
            return res.status(400).json({
                success: false,
                message: "All Fields are Required",  

            })
        }
        //Upload Video to Cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        //Create the Sub Section
        const subSectionDetails = await SubSection.create({
            title: title,
            timeDuration: `${uploadDetails.duration}`,
            description: description,
            videoUrl: uploadDetails.secure_url,
        })
        //Push the sub section id to section 
        const updatedSection = await Section.findByIdAndUpdate({_id: sectionId},
                                                    {$push: {
                                                        subSection: subSectionDetails._id
                                                    }},
                                                    {new: true}).populate("subSection").exec();

        console.log("updated section is",updatedSection)                                            
        //Return Response
        return res.status(200).json({
            success: true,
            message: "Sub Section Created Successfully",
            updatedSection,
        })
    }
    catch(err){
         return res.status(500).json({
            success: false,
            message: "Sub Section Not Created, Some Error Occured",
            updatedSection,
         });
    }
}

exports.updateSubSection = async(req, res) => {
    try{
        const {sectionId, subSectionId, title, description} = req.body ;
        // console.log("video reques", req.body.videoFile)
        // console.log("in the updated sub section")
        const subSection = await SubSection.findById(subSectionId);
        console.log(subSection);

        if(!subSection){
            return res.status(404).json({
                success: false,
                message: "Sub Section is not found"
            })
        }

        if(title !== undefined){
            subSection.title = title 
        }

        if (description !== undefined) {
          subSection.description = description;
        }

        if (title !== undefined) {
          subSection.title = title;
        }
        console.log("reached herer");
        if(req.files && req.files.video !== undefined){
            const video = req.files.videoFile;
            const uploadDetails = await uploadImageToCloudinary(
                video,
                process.env.FOLDER_NAME
            )
            subSection.videoUrl = uploadDetails.secure_url ;
            subSection.timeDuration = `${uploadDetails.duration}`
        }

        await subSection.save();

        //Find Updated section and return it
        const updatedSection = await Section.findById(sectionId).populate("subSection").exec();

        console.log("updated Section is ", updatedSection);

        return res.json({
            success: true,
            message: "Section updated successfully",
            data: updatedSection
        })

    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.deleteSubSection = async(req, res) => {
    try{
        const {sectionId, subSectionId} = req.body ;
        console.log("section id is", sectionId)
        console.log("sub section id is", subSectionId);
        
        const subSection = await SubSection.findByIdAndDelete(subSectionId);

        await Section.findByIdAndUpdate({_id: sectionId}, {
            $pull : {
                subSection : subSectionId
            }
        })
        
        
        if(!subSection){
        return res.status(404).json({
                success: false,
                message: "Sub Section not found"
            })
        }

        const updatedSection = await Section.findById(sectionId).populate("subSection").exec();

        console.log("Updated Section is: ", updatedSection);

        return res.status(200).json({
            success: true,
            message: "SubSection deleted successfully",
            data: updatedSection
        })

    }
    catch(err){
        return res.status(400).json({
            success: false,
            message: err.message,
        })
    }
}
