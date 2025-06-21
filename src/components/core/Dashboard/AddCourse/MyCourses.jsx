import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchInstructorCourses } from '../../../../services/operations/courseDetails'
import IconBtn from '../../../common/IconBtn'
import CoursesTable from '../InstructorCourses/CoursesTable'
import { useSelector } from 'react-redux'

const MyCourses = () => {
    const {token} = useSelector(state => state.auth)
    const navigate = useNavigate()
    const [courses, setCourses] = useState([])

    useEffect(()=>{
        const fetchCourses = async () => {
            const result = await fetchInstructorCourses(token)
            if(result){
                setCourses(result);
            }
        }
        fetchCourses()
    },[])


    
  return (
    <div>
        <div className='text-white flex justify-between'>
            <h1>My Courses</h1>
            <IconBtn
                text = "Add Course"
                onclick={()=>navigate("/dashboard/add-course")}
            ></IconBtn>
        </div>

        {
            courses && <CoursesTable courses = {courses} setCourses = {setCourses}/>
        }
    </div>
  )
}

export default MyCourses
