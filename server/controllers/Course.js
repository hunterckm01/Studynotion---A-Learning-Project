const Course = require('../models/Course');
const Category = require('../models/category');
const User = require('../models/User');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
const Section = require('../models/Section');
const Subsection = require('../models/SubSection');
const CourseProgress = require('../models/CourseProgress');
const { convertSecondsToDuration } = require('../utils/secToDuration');

//Create Course Handler Function
exports.createCourse = async(req, res) => {
    try{
      //Get the Data
      let {
        courseName,
        courseDescription,
        whatWillYouLearn,
        price,
        tag: _tag,
        category,
        status,
        instructions: _instructions,
      } = req.body;

  

      //Get the File Thumbnail
      const thumbnail = req.files.thumbnailImage;

      // Convert the tag and instructions from stringified Array to Array
  
      const tag = JSON.parse(_tag);
      const instructions = JSON.parse(_instructions);

      console.log("tag", tag);
      console.log("instructions", instructions);
      console.log("course name", courseName);
      console.log("course description", courseDescription);
      console.log("what will you learn", whatWillYouLearn);
      console.log("Status is ", status);
      console.log(thumbnail);

      //Perform Validation
      if (
        !courseName ||
        !courseDescription ||
        !whatWillYouLearn ||
        !price ||
        !tag ||
        !category ||
        !status ||
        !instructions
      ) {
        return res.status(400).json({
          success: false,
          message: "All Fields are mandatory",
        });
      }

      console.log("reached status exam");
      if (!status || status === undefined) {
        status = "Draft";
      }
      console.log("passed status exam");

      //Instructor Level Validation
      const userId = req.user.id;
      const instructorDetails = await User.findById(userId);
      console.log("Instructor Details", instructorDetails);
      
      
      if (!instructorDetails) {
        return res.status(404).json({
          success: false,
          message: "instructor details not found",
        });
      }

      //Check Valid Tag
      const categoryDetails = await Category.findById(category);
      if (!categoryDetails) {
        return res.status(404).json({
          success: false,
          message: "Category Details are not Found",
        });
      }

      //Upload Image To Cloudinary
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );

      //Create Entry For New Course
      const newCourse = await Course.create({
        courseName,
        courseDescription,
        instructor: instructorDetails._id,
        whatWillYouLearn: whatWillYouLearn,
        price,
        category: categoryDetails._id,
        status: status,
        instructions,
        thumbnail: thumbnailImage.secure_url,
      });

      console.log("Course New is: ", newCourse)

      //Add the new course to the user Schema of Istructor
      await User.findByIdAndUpdate(
        { _id: instructorDetails._id },
        {
          $push: {
            courses: newCourse._id,
          },
        },
        { new: true }
      );
      //Update the tagSchema
      const categoryDetails2 = await Category.findByIdAndUpdate(
        { _id: category },
        {
          $push: {
            courses: newCourse._id,
          },
        },
        { new: true }
      );
      console.log("HEREEEEEEEE", categoryDetails2);

      return res.status(200).json({
        success: true,
        message: "Course created Successfully",
        data: newCourse,
      });
    }
    catch(err){
        return res.status(400).json({
            success: false, 
            message: "Failed to create Course",
            error: err.message
        })
    }
}

//Edit Course Details
exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const updates = req.body;
    console.log(courseId);
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update");
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );
      course.thumbnail = thumbnailImage.secure_url;
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key]);
        } else {
          course[key] = updates[key];
        }
      }
    }

    await course.save();

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//Get All Courses Handler Function
exports.getAllCourses = async(req, res) => {
    try{
        const allCourses = await Course.find({}, 
          { 
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            studentsEnrolled:true       
           } )
          .populate("instructor")
          .exec();
        
        return res.status(200).json({
            success: true,
            message: "Data Fetched Successfully",
            data: allCourses,
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Cannot Fetch All the courses",
            error: err.message 
        })
    }
}


//getCourseDetails
exports.getCourseDetails = async(req, res) => {
  try{
    // console.log("get course details is called")
    //Get id
    const {courseId} = req.body ;
    //Find the Course Details
    //Validation
    console.log(courseId);
    const course = await Course.findById(courseId);
    // console.log("Course is ", course)

    if(!course){
      return res.status(400).json({
        success: false,
        message: `Could Not Find the Course with ${courseId}`
      })
    }

    const courseDetails = await Course.findById(
                               courseId)
                                .populate(
                                  {
                                    path: "instructor",
                                    populate:{
                                      path: "additionalDetails",
                                    }
                                  }
                                )
                                .populate("category")
                                .populate("ratingAndReviews")
                                .populate({
                                  path: "courseContent",
                                  populate: {
                                    path: "subSection",
                                  },
                                })
                                .exec();
    
    console.log("Course Details inside Course Details", courseDetails)                            
                                
    let totalDurationInSeconds = 0 ;
    courseDetails?.courseContent?.forEach((content)=>{
      content?.subSection?.forEach((subSection)=>{
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
    
    // console.log('course Details is this', courseDetails)
    //Return response
    return res.status(200).json({
      success: true,
      message: "Data Fetched Successfully",
      data: {
        courseDetails,
        totalDuration        
      }
    })
  }
  catch(err){
      console.log(err);
      return res.status(500).json({
          success: false,
          message: err.message
      })
  }
}


//getInstructorCourses
exports.getInstructorCourses = async(req, res) => {
  try{
    const instructorId = req.user.id
    
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: instructorCourses
    })

  }
  catch(err){
    console.log(err)
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: err.message
    })
  }
}

//DeleteCourse
exports.deleteCourse = async(req, res) => {
  try{
    const {courseId} = req.body ;

    const course = await Course.findById(courseId)

    if(!course)
      return res.status(404).json({
    message: "Course not Found"
    })

    const studentsEnrolled = course.studentsEnrolled
    for(const studentId of studentsEnrolled){
      // Delete the user :- CHECK HERE FOR ERROR HAPPENED IF USER IS NOT DELETE OR COURSE CONTENT
      await User.findByIdAndUpdate(studentId, {
        $pull: {courses: courseId}
      })
    }

    const courseSections = course.courseContent 
    for(const sectionId of courseSections){
      const section = await Section.findById(sectionId)
      if(section){

        // Delete SubSection
        const subSection = section.subSection
        for(const subSectionId of subSection){
          await Subsection.findByIdAndDelete(subSectionId)
        }
      }

      //Delete Section
      await Section.findByIdAndDelete(sectionId)
    }

    //Delete the Course
    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully"
    })
  }
  catch(err){
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message
    })
  }
}

//getFullCourseDetails
exports.getFullCourseDetails = async(req, res) => {
  try{
    console.log("Inside course details")
    const {courseId} = req.body

    const userId = req.user.id

    const courseDetails = await Course.findById(courseId).populate({
      path: "instructor",
      populate: {
        path: "additionalDetails"
      }
    })
    .populate("category")
    .populate("ratingAndReviews")
    .populate({
      path: "courseContent",
      populate: {
        path: "subSection"
      },
    }).exec()

    // console.log("Course Details inside Full Course Details", courseDetails)

    // console.log("additional Details", courseDetails.courseContent.subSection);

    
    if(!courseDetails){
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }

    // IMPORT THIS:- DONE
    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId
    })

    console.log("CourseProgressCount", courseProgressCount)

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content)=>{
      content.subSection.forEach((subSection)=> {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    // IMPORT THIS
    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);
    console.log("total duration in seconds", totalDuration)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos ? courseProgressCount?.completedVideos: [],
      }
    })
    
  }
  catch(err){
     return res.status(500).json({
       success: false,
       message: err.message,
     });
  }
}


