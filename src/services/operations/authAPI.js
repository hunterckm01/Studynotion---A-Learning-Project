import toast from "react-hot-toast"
import { apiConnector } from "../apiconnector";
import { authEndpoints } from "../apis";
import { setLoading, setToken } from "../../slices/authSlice";
import { setUser } from "../../slices/profileSlice";
import { resetCart } from '../../slices/cartSlice'
import { useSelector } from "react-redux";


const {
    SENDOTP_API,
    SIGNUP_API,
    LOGIN_API,
    RESETPASSTOKEN_API,
    RESETPASSWORD_API,
} = authEndpoints


export function sendOtp(email, navigate){
    return async (dispatch) => {
        const toastId = toast.loading("Loading....");
        dispatch(setLoading(true))

        try{
            const response = await apiConnector("POST", SENDOTP_API, {
                email,
                checkUserPresent: true
            })

            console.log('SENDOTP API RESPONSE...........', response);
            console.log(response.data.message);

            if(!response.data.success){
                throw new Error(response.data.message)
            }

            toast.success("OTP Sent Successfully");
            navigate('/verify-email');
        }
        catch(err){
            console.log('SENDING API ERROR.........', err);
            toast.error(err.response.data.message);
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}

export function login(email, password, navigate){
    return async(dispatch) => {
        // const {user} = useSelector((state)=>state.profile);
        const toastId = toast.loading("Loading");
        dispatch(setLoading(true));
        try{
            const response = await
             apiConnector('POST', LOGIN_API, {
                email, password
            })

            console.log('LOGIN API RESPONE.........', response);
            if(!response.data.success){
                throw new Error(response.data.message)
            }

            toast.success("Login Successfull");
            dispatch(setToken(response.data.token));
            // dispatch(setUser(response.data.user));
            const userImage = response.data?.user?.image  
                ? response.data.user.image
                : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
            
            dispatch(setUser({ ...response.data.user, image: userImage}))

            localStorage.setItem("token", JSON.stringify(response.data.token));
            localStorage.setItem("user", JSON.stringify(response.data.user));
            navigate('/dashboard/my-profile');
            // console.log(user);
        }
        catch(err){
            console.log('LOGIN API ERROR...', err)
            toast.error(err.message)
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}

export function signup( 
    accountType,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    otp,
    navigate
){
    return async(dispatch) => {
        const toastId = toast.loading("SENDING OTP");
        dispatch(setLoading(true));

        try{
            const response = await apiConnector("POST", SIGNUP_API, {
              accountType,
              firstName,
              lastName,
              email,
              password,
              confirmPassword,
              otp,
            });

            console.log("SIGN UP API RESPONSE", response);

            if(!response.data.success){
                throw newError(response.data.message)
            }
            toast.success("Signup successfully");
            navigate('/login');

        }
        catch(err){
            console.log("SIGN UP API ERROR: ", err);
            toast.error("Signup Failed");
            navigate("/signup");
        }

        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}

export function logout(navigate){
    return (dispatch)=>{
        dispatch(setToken(null));
        dispatch(setUser(null));
        dispatch(resetCart());
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Logged Out");
        navigate("/");
    }
}

export function getPasswordResetToken(email, setEmailSent){
    return async(dispatch)=> {
        dispatch(setLoading(true));
        const toastId = toast.loading("Reset Email is sending");
        try{
            const response = await apiConnector("POST", RESETPASSTOKEN_API, {email})

            console.log("Reset Password token response....", response)

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            toast.success("Reset Email Sent");
            setEmailSent(true);
        }
        catch(err){
            console.log("RESET PASSWORD TOKEN ERROR")
            toast.error("Failed to send email for resetting password");
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}

export function resetPassword(password, confirmPassword, token){
    return async(dispatch)=>{
        dispatch(setLoading(true))

        try{
            const response = await apiConnector("POST", RESETPASSWORD_API, {password, confirmPassword, token})

            console.log("RESET PASSWORD RESPONSE", response);

            if(!response.data.message){
                throw new Error(response.data.message);
            }

            toast.success("Password has been reset successfully");

        }
        catch(err){
            console.log('RESET PASSWORD ERROR', err);
            toast.error("Unable to reset  password")
        }
        dispatch(setLoading(false));
    }
}

