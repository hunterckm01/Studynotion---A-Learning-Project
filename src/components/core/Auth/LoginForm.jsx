import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../../services/operations/authAPI';

const LoginForm = () => {

const navigate = useNavigate();
const dispatch = useDispatch();

const [formData, setFormData] = useState({
  email: "",
  password: "" 
});

const {email, password} = formData ;

const [showPassword, setShowPassword] = useState(false);

function changeHandler(event) {
  setFormData((prevData) => ({
    ...prevData,
    [event.target.name]: event.target.value,
  }));
}

function submitHandler(e) {
  e.preventDefault();
  dispatch(login(email, password, navigate));

  // console.log(formData);
}

return (
  <form onSubmit={submitHandler} className="flex flex-col w-full gap-y-6 mt-6">
    <label className="w-full">
      <p className="text-[0.75rem] text-richblack-5 mb-1 leading-[1.375rem]">
        Email Address 
        {/* <sup className="text-pink-200">*</sup> */}
      </p>
      <input
        required
        type="email"
        value={formData.email}
        name="email"
        onChange={changeHandler}
        placeholder="Enter Your Email Id"
        className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[10px]"
      />
    </label>

    <label className="w-full relative">
      <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
        Enter Password 
        {/* <sup className="text-pink-200">*</sup> */}
      </p>
      <input
        required
        type={showPassword ? "text" : "password"}
        value={formData.password}
        name="password"
        onChange={changeHandler}
        placeholder="Enter Your Password"
        className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[10px]"
      />
      <span
        className="absolute right-3 top-[38px] cursor-pointer"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? (
          <AiFillEye fontSize={24} fill="#AFB2BF" />
        ) : (
          <AiFillEyeInvisible fontSize={24} fill="#AFB2BF" />
        )}
      </span>
      <Link to="/forgot-password">
        <p className="text-xs mt-1 text-blue-100 ml-auto max-w-max font-inter">
          Forget Password
        </p>
      </Link>
    </label>

    <button 
      type = "submit"    
      className="bg-yellow-50 rounded-[8px] font-medium text-richblack-900 py-[12px] px-[8px] mt-4">
      Log In
    </button>
  </form>
);
}

export default LoginForm
