import toast from "react-hot-toast";
import { setUser } from "../../slices/profileSlice";
import { settingsEndpoints } from '../apis'
import { apiConnector } from "../apiconnector";
import { logout } from "./authAPI";


const {
    UPDATE_DISPLAY_PICTURE_API,
    UPDATE_PROFILE_API,
    CHANGE_PASSWORD_API,
    DELETE_PROFILE_API
} = settingsEndpoints

export function updateProfilePicture(token, formData){
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        console.log("step2 , In the apis frontend checking token : ", token);
        
        try{
            const response = await apiConnector(
                "PUT",
                UPDATE_DISPLAY_PICTURE_API,
                formData,
                {
                    // Try without using this
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                }
            )

            console.log('UPDATE DISPLAY PICTURE API RESPONSE', response)   

            if(!response.data.success){
                throw new Error(response.data.message)
            }
            toast.success("Display Picture Updated Successfully");
            dispatch(setUser(response.data.data))

            localStorage.setItem("user", JSON.stringify(response.data.data))
            console.log(response.data.data);
        }
        catch(err){
            console.log('UPDATE_DISPLAY_PICTURE_API API ERROR', err)
            toast.error("Could not update display picture")
        }

        toast.dismiss(toastId);
    }
}

export function updateProfile(token, formData){
    return async(dispatch) => {
        const toastId = toast.loading("Loading...")

        try{
            const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
                Authorization: `Bearer ${token}`
            })
            console.log('UPDATE PROFILE API RESPONSE', response)

            if(!response.data.success){
                throw new Error(response.data.message)
            }

            // Check here for potential error
            const userImage = response?.data?.user?.image ?? `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`

            dispatch(setUser({...response.data.user, image: userImage}))
            localStorage.setItem("user", JSON.stringify(response.data.user))
            toast.success("Profile Information updated successfully");
        }
        catch(err){
            console.log("UPDATE_PROFILE_API API ERROR............", err);
            toast.error("Could Not Update Profile");
        }
        toast.dismiss(toastId);
    }
}

export async function changePassword(token, formData){
    // check with async here
    const toastId = toast.loading("Loading...")
    try{
        const response = await apiConnector("POST", CHANGE_PASSWORD_API, formData, {
            Authorization: `Bearer ${token}`
        })
        console.log('CHANGE PASSWORD API RESPONSE', response)

        if(!response.data.success){
            throw new Error(response.data.message)
        }
        toast.success("Password changed successfully")
    }
    catch(err){
         console.log("CHANGE_PASSWORD_API API ERROR............", err);
         toast.error(err.response.data.message);
    }
    toast.dismiss(toastId);
}

export function deleteProfile(token, navigate){
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        try{
            const response = await apiConnector('DELETE', DELETE_PROFILE_API, null, {
                Authorization: `Bearer ${token}`
            })
            console.log('DELETE PROFILE API RESPONSE', response)

            if(!response.data.success){
                throw new Error(response.data.message)
            }

            toast.success('Profile Deleted Successfully')
            dispatch(logout(navigate))

        }
        catch(err){
            console.log('DELETE PROFILE API ERROR', err)
            toast.error("Could Not Delete User")
        }
        toast.dismiss(toastId);
    }
}