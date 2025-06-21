import copy from 'copy-to-clipboard';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ACCOUNT_TYPE } from '../../../utils/constants';
import { addToCart } from '../../../slices/cartSlice';
import {FaShareSquare} from 'react-icons/fa'

function CourseDetailsCard({course, setConfirmationModal, handleBuyCourse}){

    const {
        thumbnail: ThumbnailImage,
        price: CurrentPrice,
    } = course?.courseDetails;
    console.log("Course Data is", course)
    const userDetails = useSelector(state => state.profile)
    const user = userDetails?.user
    const token = useSelector(state => state.auth)
    const cartCourses = useSelector(state => state.cart)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [isActive, setIsActive] = useState([])

    // console.log("User id ", user?.user?._id)
    const handleAddToCart = () => {
        // console.log("User is", user)
        // console.log("Token of user is", token)
        if(user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR){
            toast.error("You are An Instructor, You can't buy the course")
            return ;
        }
        if(token){
            console.log("Cart Courses length is", cartCourses.cart.length, cartCourses.cart)
            if(cartCourses.cart.length > 0){
                const courseExists = cartCourses.cart.some(existingCourse => existingCourse._id === course._id)
                if(courseExists){
                    toast.error("Course is already added to your cart")
                    return 
                }
                else{
                    dispatch(addToCart(course))
                    return 
                }
            }
            dispatch(addToCart(course))
            return 
        }

        setConfirmationModal({
            text1: "You are not Logged In",
            text2: "Plese Login to Add To cart",
            btn1Text: "Login",
            btn2Text: "Cancel",
            btn1Handler: ()=>navigate("/login"),
            btn2Handler: ()=>setConfirmationModal(null) 
        })
    }

    const handleShare = () => {
        copy(window.location.href)
        toast.success("Link Copied to Clipboard")
    }

    // useEffect(()=>{
    //     console.log("User id is", user?._id)
    //     console.log(course?.studentsEnrolled?.includes(user?._id))
    //     const checkBuyCourse = user?._id && course?.studentsEnrolled?.includes(user?._id)
    //     console.log("Check Buy Course result is", checkBuyCourse)
    // },[])

    return (
      <div
        className={`flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5`}
      >
        <img
          src={ThumbnailImage}
          alt="Thumbnail Image"
          className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
        />

        <div className='px-4 space-x-3 pb-4 text-3xl font-semibold'>Rs. {CurrentPrice}</div>

        <div className="flex flex-col gap-4">
          <button
            className="yellowButton"
            onClick={
              user &&
              course?.courseDetails?.studentsEnrolled.includes(user?._id)
                ? () => navigate("/dashboard/enrolled-courses")
                : handleBuyCourse
            }
          >
            {user && course?.courseDetails?.studentsEnrolled.includes(user?._id)
              ? "Go to Course"
              : "Buy Now"}
          </button>

          {!course?.courseDetails?.studentsEnrolled.includes(user?._id) && (
            <button
              className="bg-yellow-100 blackButton"
              onClick={handleAddToCart}
            >
              Add To Cart
            </button>
          )}
        </div>

        <div>
          <p className='pb-3 pt-6 text-center text-sm text-richblack-25'>30 DAY MONEY BACK GUARENTEE</p>
        </div> 
        
        <div>
          <p className='my-2 text-xl font-semibold'>This Course Includes: </p>
          <div className="flex flex-col gap-y-3 text-sm text-caribbeangreen100">
            {course?.instructions?.map((item, index) => (
              <p key={index} className="flex flex-col gap-2">
                <span>{item}</span>
              </p>
            ))}
          </div>
        </div>

        <div className='text-center'>
          <button
            className="mx-auto flex items-center gap-2 p-6 text-yellow-100"
            onClick={handleShare}
          >
           <FaShareSquare size = {15} /> Share
          </button>
        </div>
      </div>
    );

}

export default CourseDetailsCard
