import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import IconBtn from '../../../../common/IconBtn';
import { COURSE_STATUS } from '../../../../../utils/constants';
import { resetCourseState } from '../../../../../slices/courseSlice';
import { editCourseDetails } from '../../../../../services/operations/courseDetails';
import { useNavigate } from 'react-router-dom';

const CoursePublishForm = () => {
  const { register, handleSubmit, setValue, getValues } = useForm();
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  useEffect(()=>{
    if(course?.status === COURSE_STATUS.PUBLISHED){
      setValue("public", true)
    }
  },[])

  const goBack = () => {
        dispatch(setStep(2))
        // dispatch(setEditCourse(true))
        // console.log("edit course is", editCourse)
      }

  const goToCourses = () => {
    console.log("go to courses hit")
    dispatch(resetCourseState())
    navigate("/dashboard/my-courses")
  }

  const handleCoursePublish = async() => {
    if(course?.status === COURSE_STATUS.PUBLISHED && getValues("public") === true || (course.status === COURSE_STATUS.DRAFT && getValues("public") === false)){
      goToCourses() ;
      return ;
    }

    const formData = new FormData()
    formData.append("courseId", course._id)
    const courseStatus = getValues("public") ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT
    formData.append("status", courseStatus);

    setLoading(true)
    const result = await editCourseDetails(formData, token);
    console.log("result of courses are", result)
    if(result){
      goToCourses()
    }
    setLoading(false)
  }

  const onSubmit = () => {
    handleCoursePublish();
  };


  return (
    <div className="rounded-md border-[1px] bg-richblack-800 p-6 border-richblack-700 text-white ">
      <p>Publish Course</p> 
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="public">
            <input
              type="checkbox"
              id="public"
              {...register("public")}
              className="rounded-md h-4 w-4"
              />
              <span className='ml-3'></span>
              Make this course as public
            </label>
        </div>

        <div className='flex justify-end gap-x-3'>
          <button 
          disabled = {loading}
          type = "button"
          onClick={goBack}
          className='flex items-center rounded-md bg-richblack-300 p-3 px-2'
          >Back</button>
          <IconBtn
            disabled = {loading}
            customClasses={`px-2 py-3`}
            >Save Changes</IconBtn>
            
          </div>
      </form>
    </div>
  );
};

export default CoursePublishForm;
