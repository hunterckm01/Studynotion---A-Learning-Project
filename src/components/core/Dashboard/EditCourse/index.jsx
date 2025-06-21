import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getFullCourseDetails } from '../../../../services/operations/courseDetails'
import { setCourse, setEditCourse } from '../../../../slices/courseSlice'
import { useParams } from 'react-router-dom'
import RenderSteps from '../AddCourse/RenderSteps'

const EditCourse = () => {

    const dispatch = useDispatch()
    const {courseId} = useParams()
    const { course } = useSelector((state) => state.course)
    const { token } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false)

    // console.log("courseId is", courseId.courseId)
    useEffect(()=>{
        const populateCourseDetails = async() => {
            setLoading(true)
            console.log("course id is", courseId)
            const result = await getFullCourseDetails(courseId, token)
            console.log("result get in frontend", result)
            if(result){
                dispatch(setEditCourse(true))
                dispatch(setCourse(result?.courseDetails))
                console.log("if get any")
            }
            setLoading(false)
            console.log("course is", course)
        }
        populateCourseDetails();
        console.log("course is what get", course)
    },[])

    if(loading){
        return (
          <div className="grid flex-1 place-items-center">
            Still Loading.... Hold On
          </div>
        );
    }

  return (
    <div >
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">
        Edit Course
      </h1>
      <div className="mx-auto max-w-[600px]">
        {!loading ? (
          <RenderSteps />
        ) : (
          <p className="mt-14 text-center text-3xl font-semibold text-richblack-100">
            Course Not Found
          </p>
        )}
      </div>
    </div>
  );
}

export default EditCourse
