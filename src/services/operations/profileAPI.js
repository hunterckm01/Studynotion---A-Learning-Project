import toast from "react-hot-toast"
import { setLoading } from "../../slices/profileSlice";
import { apiConnector } from "../apiconnector";
import { profileEndpoints } from "../apis";

const {GET_USER_ENROLLED_COURSES_API, GET_INSTRUCTOR_DATA_API} = profileEndpoints

export async function getUserEnrolledCourses(token, navigate){
    const toastId = toast.loading("Loading")
    let result = []
    try{
        const response = await apiConnector(
            "GET",
            GET_USER_ENROLLED_COURSES_API,
            null,
            {
            Authorization: `Bearer ${token}`,
            }
        )
        console.log("Get user enrolled api response", response)

        if(!response.data.success)
            throw new Error(response.data.message)

        result = response.data.data
        console.log("response is ", result)
        }   
    catch(err){
        console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", err)
         toast.error("Could Not Get Enrolled Courses")
    }   
    toast.dismiss(toastId);
    return result
}

export async function getInstructorData(token){
    const toastId = toast.loading("Loading...")
    let result = []

    try{
        const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, {
            Authorization: `Bearer ${token}` 
        });

        result = response?.data?.courses
    }
    catch(err){
        console.log("GET_INSTRUCTOR_API ERROR", err)
        toast.error("Could not get Instructor Data");
    }
    toast.dismiss(toastId)
    return result ;
}