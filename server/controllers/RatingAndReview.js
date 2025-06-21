const RatingAndReview = require('../models/RatingAndReview');
const Course = require('../models/Course');
const { default: mongoose } = require('mongoose');

//Create Rating
exports.createRating = async(req, res) => {
    try{
      //Get User Id
      const userId = req.user.id;
      //Fetch Data from Request Body
      const { rating, review, courseId } = req.body;
      //Check if user is enrolled or not
      const courseDetails = await Course.findOne({
        _id: courseId,
        studentsEnrolled: { $elemMatch: { $eq: userId } },
      });

      if (!courseDetails) {
        return res.status(404).json({
          success: false,
          message: "Students is not enrolled in this course",
        });
      }

      //Check if user already reviewed the course
      const alreadyReviewed = await RatingAndReview.findOne({
                                                user: userId,
                                                course: courseId,
                                            });

      if(alreadyReviewed) {
        return res.status(403).json({
          success: false,
          message: "Course is already reviewed by the user",
        });
      }

      //Create Rating
      const ratingReview = await RatingAndReview.create({rating, review,
                                                        course: courseId,
                                                        user: userId
                                                        });

      //Update Course with rating and review
      const updatedCourseDetails = await Course.findByIdAndUpdate({_id: courseId},
                                    {
                                        $push: {
                                            ratingAndReviews: ratingReview._id
                                        }
                                    },
                                    {new: true})
     
      console.log(updatedCourseDetails);
      //Return Response 
      return res.status(200).json({
        success: true,
        message: "Rating and Review created successfully",
        ratingReview
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



//Get Average Rating
exports.getAverageRating = async(req, res) => {
    try{
        //Get Course ID
        const courseId = req.body.courseId ;

        //Calculate Average Rating 
        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: {$avg: "$rating"}
                }
            }
        ])

        //Return Rating
        if(result.length > 0){
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            })
        }

        //If no rating and review is available
        return res.status(200).json({
            success: true,
            message: "Average rating 0, no ratings is given till no",
            averageRating: 0,
        })
    }
    catch(err){

    }
}


//Get All Rating and reviews
exports.getAllRating = async(req,res) =>{
    try{
        const allReviews = await RatingAndReview.find({})
                                  .sort({rating: "desc"})
                                  .populate({
                                      path: "user",
                                      select: "firstName lastName email image",
                                  })
                                  .populate({
                                    path: "course",
                                    select: "courseName"
                                  })  
                                  .exec();

        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data: allReviews
        }); 
    }
    catch(err){

    }
}