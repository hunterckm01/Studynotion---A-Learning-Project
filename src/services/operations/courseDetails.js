import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector"
// import { Error } from "mongoose";
import { RiErrorWarningFill } from "react-icons/ri";
import { data } from "react-router-dom";
import { courseEndpoints } from "../apis";

const {
  COURSE_DETAILS_API,
  COURSE_FULL_DETAILS_API,
  COURSE_CATEGORIES_API,
  GET_ALL_COURSE_API,
  CREATE_COURSE_API,
  EDIT_COURSE_API,
  CREATE_SECTION_API,
  CREATE_SUBSECTION_API,
  UPDATE_SECTION_API,
  UPDATE_SUBSECTION_API,
  DELETE_SECTION_API,
  DELETE_SUBSECTION_API,
  GET_ALL_INSTRUCTOR_COURSES_API,
  DELETE_COURSE_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
  CREATE_RATING_API,
  LECTURE_COMPLETION_API,
} = courseEndpoints;


export const getAllCourses = async() => {
    const toastId = toast.loading("Loading")
    let result = []

    try{
        const response = await apiConnector("GET", GET_ALL_COURSE_API)
        if(!response.data.success){
            throw new Error("Could not get all courses api data", response)
        }
        result = response?.data?.data
    }
    catch(err){
         console.log("GET_ALL_COURSE_API API ERROR............", err);
         toast.error(err.message);
    }
    toast.dismiss(toastId)
    return result
}


export const fetchCourseDetails = async(courseId) => {
    const toastId = toast.loading("Loading");
    let result = null

    try{
      console.log("Get Course Details Frontend to backend is called")
        const response = await apiConnector('POST', COURSE_DETAILS_API, {courseId})
        console.log('COURSE_DETAILS_API RESPONSE', response)

        if(!response.data.success){
            throw new Error(response.data.message)
        }

        result = response.data

    }
    catch(err){
       console.log("COURSE_DETAILS_API API ERROR............", err);
       result = err.response.data;
    }
    toast.dismiss(toastId)
    return result 
}


export const fetchCourseCategories = async() => {
    let result = []
    try{
        const response = await apiConnector("GET", COURSE_CATEGORIES_API)

        // console.log("Course Categories Api response", response)

        if(!response?.data?.success){
            throw new Error("Could not fetch course categories")
        }

        result = response?.data?.data
    }
    catch(err){
        console.log("COURSE_CATEGORY_API API ERROR............", err);
        toast.error(err.message);
    }

    return result
}


export const addCourseDetails = async(data, token) => {
    let result = null
    const toastId = toast.loading("Loading")
    try{
        console.log("add course details api",data)
        const response = await apiConnector('POST', CREATE_COURSE_API, data, {
            Authorization: `Bearer ${token}`
        })
        console.log('CREATE COURSE API RESPONSE', response)

        if(!response?.data?.success){
            throw new Error("Could not add course details")
        }

        toast.success("Course added successfully")

        result = response?.data?.data
    }
    catch(err){
        console.log('CREATE COURSE API ERROR.......', err)
        toast.error(err.message)
    }
    toast.dismiss(toastId)
    return result
}


export const editCourseDetails = async(data, token) => {
    let result = null
    const toastId = toast.loading('Loading...')
    try{
        const response = await apiConnector('POST', EDIT_COURSE_API, data, {
            Authorization: `Bearer ${token}`
        })

        console.log("EDIT COURSE API RESPONSE............", response);
        if (!response?.data?.success) {
          throw new Error("Could Not Update Course Details");
        }
        toast.success("Course Details Updated Successfully");
        result = response?.data?.data ; 
    }
    catch(err){
         console.log("EDIT COURSE API ERROR............", err);
         toast.error(err.message);
    }
    toast.dismiss(toastId)
    return result
}


export const createSection = async(data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try{
        const response = await apiConnector("POST", CREATE_SECTION_API, data, {
          Authorization: `Bearer ${token}`,
        });

        console.log("CREATE SECTION API RESPONSE............", response);
        if (!response?.data?.success) {
          throw new Error("Could Not Create Section");
        }
        toast.success("Course Section Created");
        result = response?.data?.updatedCourseDetails;
    }
    catch(err){
        console.log("CREATE SECTION API ERROR............", err);
        toast.error(err.message);
    }
    toast.dismiss(toastId)
    return result
}


export const createSubSection = async (data, token) => {
  console.log("data in frontend hitted api", data);
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", CREATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });

    console.log("CREATE SUB SECTION API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Add Lecture");
    }
    toast.success("Lecture Added Successfully");
    result = response?.data?.updatedSection;
    console.log("response is", result);
  } catch (err) {
    console.log("CREATE SUB SECTION API ERROR............", err);
    toast.error(err.message);
  }
  toast.dismiss(toastId);
  return result;
};


export const updateSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", UPDATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });

    console.log("UPDATE SECTION API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Update Section");
    }
    toast.success("Course Section updated");
    result = response?.data?.data;
  } catch (err) {
    console.log("UPDATE SUB SECTION API ERROR............", err);
    toast.error(err.message);
  }
  toast.dismiss(toastId);
  return result;
};


export const updateSubSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", UPDATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });

    console.log("UPDATE SUB SECTION API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Update Lecture");
    }
    toast.success("Course Section updated");
    result = response?.data?.data;
  } catch (err) {
    console.log("UPDATE SUB SECTION API ERROR............", err);
    toast.error(err.message);
  }
  toast.dismiss(toastId);
  return result;
};


export const deleteCourse = async(data, token) => {
    const toastId = toast.loading("Loading")
    try{
        const response = await apiConnector('DELETE', DELETE_COURSE_API, data, {
            Authorization: `Bearer ${token}`
        })
        console.log('DELETE COURSE API RESPONSE', response)

        if(!response?.data?.success){
            throw new Error("Could not delete the course")
        }

        toast.success("Course Deleted Successfully")
    }
    catch(err){
        console.log('DELETE COURSE API ERROR', err)
        toast.error(err.message)
    }
    toast.dismiss(toastId)
}


export const deleteSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", DELETE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });

    console.log("DELETE  SECTION API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Section");
    }
    toast.success("Course Section Deleted");
    result = response?.data?.data;
  } catch (err) {
    console.log("DELETE SUB SECTION API ERROR............", err);
    toast.error(err.message);
  }
  toast.dismiss(toastId);
  return result;
};


export const deleteSubSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", DELETE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });

    console.log("DELETE SUB SECTION API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Sub Section");
    }
    toast.success("Course Sub Section Deleted");
    result = response?.data?.data;
  } catch (err) {
    console.log("DELETE SUB SECTION API ERROR............", err);
    toast.error(err.message);
  }
  toast.dismiss(toastId);
  return result;
};


export const fetchInstructorCourses = async(token) => {
    let result = []
    const toastId = toast.loading

    try{
        const response = await apiConnector('GET', GET_ALL_INSTRUCTOR_COURSES_API, null, {
            Authorization: `Bearer ${token}`
        })
        // console.log('INSTRUCTOR COURSES API RESPONSE', response)

        if(!response?.data?.success){
            throw new Error("Could not fetch instuructor courses")
        }

        result = response?.data?.data
    }
    catch(err){
        console.log("INSTRUCTOR COURSES API ERROR............", err);
        toast.error(RiErrorWarningFill.message);
    }

    toast.dismiss(toastId)
    return result
}


export const getFullCourseDetails = async (courseId, token) => {
    const toastId = toast.loading("Loading...")
    // console.log("Course id and token are", courseId, token)
    let result = null
    try{
        const response = await apiConnector('POST', GET_FULL_COURSE_DETAILS_AUTHENTICATED, {
            courseId
        },
        {
            Authorization: `Bearer ${token}`
        } )
        
        console.log("COURSE FULL DETAILS API RESPONSE.......", response)

        if(!response?.data?.success){
            throw new Error(response.data.message)
        }


        result = response?.data?.data
        // console.log("data is", result)
    }
    catch(err){
        console.log('COURSE FULL DETAILS API ERROR', err)
        result = err.response.data
    }
    toast.dismiss(toastId)
    console.log("result is returned")
    return result

}


export const markLectureAsComplete = async(data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try{
        const response = await apiConnector('POST', LECTURE_COMPLETION_API, data, {
            Authorization: `Bearer ${token}`
        })
        console.log("MARK LECTURE AS COMPLETE API RESPONSE", response)

        if(!response?.data?.message){
            throw new Error(response.data.error)
        }
        toast.success("Lecture Completed")
        result = true
    }
    catch(err){
        console.log('MARK LECTURE AS COMPLETED API ERROR', err)
        toast.error(err.message)
        result = false
    }
    toast.dismiss(toastId)
    return result
}


export const createRating = async(data, token) => {
    const toastId = toast.loading("Loading...");
    let success = false ;
    try{
        const response = await apiConnector("POST", CREATE_RATING_API, data, {
          Authorization: `Bearer ${token}`,
        });
        console.log("CREATE RATING API RESPONSE............", response);
        if (!response?.data?.success) {
          throw new Error("Could Not Create Rating");
        }
        toast.success("Rating Created");
        success = true;
    }
    catch(err){
        success = false;
        console.log("CREATE RATING API ERROR............", err);
        toast.error(err.message);
    }
    console.log("REached here")
    toast.dismiss(toastId);
    return success;
}