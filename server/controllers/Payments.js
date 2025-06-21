const {instance} = require('../config/razorpay');
const Course = require('../models/Course');
const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const {courseEnrollmentEmail} = require('../mail/courseEnrollmentEmail');
const { default: mongoose } = require('mongoose');
const crypto = require('crypto')
const {paymentSuccessEmail} = require('../mail/paymentSuccessEmail');
// const CourseProgress = require('../models/CourseProgress');
const CourseProgress = require('../models/CourseProgress');

//Capture the Payment and initiate the razorpay order

exports.capturePayment = async(req, res) => {
    const {courses} = req.body ;
    const userId = req.user.id ;

    // console.log("Inside Capture Payment Body");

    if(courses.length === 0){
      return res.status(400).json({
        success: false,
        message: "Please Provide the course id"
      })
    }

    let totalAmount = 0 ;
    for(const course_id of courses){
        let course ;
        try{
            course = await Course.findById(course_id)
            if(!course){
                return res.status(200).json({
                    success: false,
                    message: "Could not find the course"
                })
            }    
                // Check for error if occured
            const uid = new mongoose.Types.ObjectId(userId)
            if(course.studentsEnrolled.includes(uid)){
                return res.status(200).json({
                    success: false,
                    message: "Student is already Enrolled in this course"
                })
            }
            totalAmount += course.price
            }
        catch(err){
            // console.log(err)
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
    }

    const options = {
        amount: totalAmount*100,
        currency: 'INR',
        receipt: Math.random(Date.now()).toString()
    }

    try{
        const paymentResponse = await instance.orders.create(options)
        // console.log("Payment Response is", paymentResponse)
        res.json({
            success: true,
            message: paymentResponse,

        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Could not initiate Order"
        })
    }
}

exports.verifyPayment = async(req, res) => {
    // console.log("Verify Payment is Called")
    // console.log("Request body get", req.body, req.user.id)
    const razorpay_order_id = req.body?.razorpay_order_id ;
    const razorpay_payment_id = req.body?.razorpay_payment_id ;
    const razorpay_signature = req.body?.razorpay_signature ;
    const courses = req.body?.courses ;
    const userId = req.user?.id

    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId){
        return res.status(402).json({
            success: false,
            message: "Payment Failed"
        })
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id ;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

    // console.log("Exprected signature is", expectedSignature)
    if(expectedSignature === razorpay_signature){
         //Enroll the students
        await enrollStudents(courses, userId, res)

        // console.log("Enroll Students is done")
         //Return Response
         return res.status(200).json({
            success: true,
            message: "Payment Verified"
         })
    }

    // console.log("Verification is Done")

    return res.stauts(402).json({
        success: false,
        message: "Payment Failed"
    })
}


const enrollStudents = async(courses, userId, res) => {
    // console.log("Enroll Students function is called")
    if(!courses || !userId){
            return res.stauts(400).json({
            success: false,
            message: "Please Provide Data for courses and userid"
        })
    }
    // console.log("Before the for loop in enroll students")
    for(const courseId of courses){
        try{
            //  console.log("Enrolled students course push starts", courseId);
        const enrolledCourses = await Course.findOneAndUpdate(
            {_id: courseId},
            {$push: {studentsEnrolled: userId}},
            {new: true}
        )

        // console.log("Enrolled students course is pushed done")
    
    
    if(!enrolledCourses){
        return res.status(500).json({
            success: false,
            message: "Course Not Found"
        })
    }

    console.log("course id is", courseId)

    const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: []
    })

    console.log("course Progress is ", courseProgress)
    
    //Find the student and add the list of enrolled courses
    const enrolledStudent = await User.findByIdAndUpdate(userId,
        {$push: {
            courses: courseId,
            courseProgress: courseProgress._id
        }},
        {new: true},
    )

    const emailResponse = await mailSender(
      enrolledStudent.email,
      `Successfully enrolled into ${enrolledCourses?.courseName}`,
      courseEnrollmentEmail(
        enrolledCourses?.courseName,
        `${enrolledStudent.firstName}`
      )
    );
    console.log("Email Response is", emailResponse.response)
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
    }
}

exports.sendPaymentSuccessEmail = async(req, res) => {
    // console.log("Send Payment Success email Backend is called");
    // console.log("Request body contains", req.body);
    const {orderId, paymentId, amount} = req.body ; 
    const userId = req.user.id ;

    if(!orderId || !paymentId || !amount || !userId){
        return res.status(400).json({
            success: false,
            message: "Please Provide all the fields"
        })
    }

    try{
        //FIND THE STUDENT
        const enrolledStudent = await User.findById(userId)
        await mailSender(
            enrolledStudent.email,
            `Payment Received`,
            paymentSuccessEmail(`${enrolledStudent.firstName}`, amount/100, orderId, paymentId)
        )

        // console.log("Mail is Sended or Mail Sender is on the way")
    }
    catch(err){
        console.log("Error in sending mail", err)
        return res.status(500).json({
            success: false,
            message: "Could not send the email"
        })
    }
}

// PREVIOUS PAYMENT FOR ONE
// exports.capturePayment = async(req, res) => {
//     //Get Course Id and User Id
//     const {course_id} = req.body;
//     const userId = req.user.id ;

//     //Validation
//     //Valid course Id
//     if(!course_id){
//         return res.json({
//             success: false,
//             message: "Please Provide valid Course Id"
//         })
//     };
//     //valid Course Details
//     let course;
//     try{
//         course = await Course.findbyId(course._id);
//         if(!course){
//             return res.json({
//                 success: false,
//                 message: "Could not Find the Course"
//             })
//         }
//         //If Order already paid by user
//         const uid =  mongoose.Types.ObjectId(userId);
//         if(course.studentsEnrolled.includes(uid)){
//             return res.status(200).json({
//                 success: false,
//                 message: "Student is already Enrolled"
//             })
//         }
//     }
//     catch(err){
//         console.error(err);
//         return res.status(500).json({
//             success: false,
//             message: err.message,
//         });
//     }
//     //Order Created
//     const amount = course.price ;
//     const currency = "INR" ;

//     const options = {
//         amount : amount * 100 ,
//         currency,
//         receipt : Math.random(Date.now()).toString(),
//         notes: {
//             courseId: course_id,
//             userId
//         } 
//     };

//     try{
//         //Initiate the Payment using razorpay
//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse);

//         return res.status(200).json({
//             success: true,
//             courseName: course.courseName,
//             courseDescription: course.courseDescription,
//             thumbnail: course.thumbnail,
//             orderId: paymentResponse.id,
//             currency: paymentResponse.currency,
//             amount: paymentResponse.amount
//         })
//     }
//     //Return Response
//     catch(err){
//         console.log(err);
//         return res.status(200).json({
//             success: false,
//             message: "Could not initiate the Order"
//         })
//     }
// };

//Verify Signature

// exports.verifySignature = async(req, res) => {
    
//     const webHookSecret = "12345678";

//     const signature = req.header["x-razorpay-signature"] ;

//     const shasum = crypto.createHmac("sha256", webHookSecret) ;
//     shasum.update(JSON.stringify(req.body)) ;
//     const digest = shasum.digest("hex") ;

//     if(signature === digest){
//         console.log("Payment is Authorized");

//         const {courseId, userId} = req.body.payload.payment.entity.notes ;

//         try {
//             //Fulfill the action.

//             const enrolledCourse = await Course.findOneAndUpdate(
//                                                 {_id: courseId},
//                                                 {$push: {studentsEnrolled: userId}},
//                                                 {new: true}
//             );

//             if(!enrolledCourse){
//                 return res.status(500).json({
//                     success: false,
//                     message: "Course not found"
//                 })
//             }

//             //Find the course and enroll the student in it.
//             console.log(enrolledCourse);

//             //Find the student added to the course to their list added
//             const enrolledStudent = await User.findOneAndUpdate(
//                                                 {_id: userId},
//                                                 {$push: {courses: courseId}},
//                                                 {new: true}
//             );

//             console.log(enrolledStudent);

//             //Send the Confirmation Mail
//             const emailResponse = await mailSender(
//                                         enrolledStudent.email,
//                                         "congrulations from codehelp",
//                                         "Congrulations, you are onboarded to the new Course",           
//             );

//             console.log(emailResponse);

//             return res.status(400).json({
//                 success: true,
//                 message: "Signature verified and Course Added"
//             })
//         }
//         catch (err) {
//             console.log(err);
//             return res.status(200).json({
//                 success: false,
//                 message: err.message
//             })
//         }    
//     }
//     else{
//         return res.status(400).json({
//             success: false,
//             message: "Invalid Email"            
//         })
//     }
    
// }


// // Send Payment Success Email
// exports.sendPaymentSuccessEmail = async (req, res) => {
//   const { orderId, paymentId, amount } = req.body

//   const userId = req.user.id

//   if (!orderId || !paymentId || !amount || !userId) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Please provide all the details" })
//   }

//   try {
//     const enrolledStudent = await User.findById(userId)

//     await mailSender(
//       enrolledStudent.email,
//       `Payment Received`,
//       paymentSuccessEmail(
//         `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
//         amount / 100,
//         orderId,
//         paymentId
//       )
//     )
//   } catch (error) {
//     console.log("error in sending mail", error)
//     return res
//       .status(400)
//       .json({ success: false, message: "Could not send email" })
//   }
// }