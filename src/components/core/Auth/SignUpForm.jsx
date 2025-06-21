import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {ACCOUNT_TYPE} from '../../../utils/constants'
import { setSignupData } from "../../../slices/authSlice";
import { sendOtp } from '../../../services/operations/authAPI';
import Tab from '../../common/Tab';

const SignUpForm = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({firstName: "",  lastName: "", email: "", password: "", confirmPassword: ""})

    const [accountType, setAccType] = useState(ACCOUNT_TYPE.STUDENT);

    const [psdType, setPsdType] = useState(false);

    const [psdType2, setPsdType2] = useState(false);

    const tabData = [{
        id: 1,
        tabName: "Student",
        type: ACCOUNT_TYPE.STUDENT
      },
      {
        id: 2,
        tabName: "Instructor",
        type: ACCOUNT_TYPE.INSTRUCTOR,
      },
    ]

    function changeHandler(event){
        setFormData((prevData) => ({
            ...prevData,
            [event.target.name] : event.target.value
        }
    ))
    }

    // useEffect(()=>{
    //   console.log(accType);
    // },[])

    function submitHandler(event){
      // console.log(accountType);
      event.preventDefault();
      if (formData.password !== formData.confirmPassword) {
        toast.error("Password do not matched");
        return;
      }

      const signupData = {
        ...formData,
        accountType,
      };

      dispatch(setSignupData(signupData));

      dispatch(sendOtp(formData.email, navigate));

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setAccType(ACCOUNT_TYPE.STUDENT);
    }



  return (
    <div className="">
      <Tab tabData={tabData} field={accountType} setField={setAccType} />

      <form onSubmit={submitHandler}>
        {/* fist and last name */}
        <div className="flex gap-x-10 mt-[20px]">
          <label>
            <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
              First Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="text"
              name="firstName"
              onChange={changeHandler}
              value={FormData.firstName}
              placeholder="First Name"
              className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[10px] "
            />
          </label>

          <label>
            <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
              Last Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="text"
              name="lastName"
              onChange={changeHandler}
              value={FormData.lastName}
              placeholder="Last Name"
              className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[10px]"
            />
          </label>
        </div>

        {/* email */}
        <div className="mt-[20px]">
          <label>
            <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
              Email Address <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="email"
              name="email"
              value={FormData.email}
              onChange={changeHandler}
              placeholder="321@hotmail.com"
              className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[10px]"
            />
          </label>
        </div>

        <div className="flex gap-x-10 mt-[20px]">
          <label className="relative">
            <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
              Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={psdType ? "text" : "password"}
              name="password"
              value={FormData.password}
              onChange={changeHandler}
              placeholder="***"
              className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[10px]"
            />
            <span
              className="absolute  cursor-pointer right-[10px] top-[40px]"
              onClick={() => setPsdType((prev) => !prev)}
            >
              {psdType ? <AiFillEye /> : <AiFillEyeInvisible />}
            </span>
          </label>

          <label className="relative">
            <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
              Confirm Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={psdType2 ? "text" : "password"}
              name="confirmPassword"
              value={FormData.confirmPassword}
              onChange={changeHandler}
              placeholder="***"
              className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[10px] "
            />
            <span
              className="absolute  cursor-pointer right-[10px] top-[40px]"
              onClick={() => setPsdType2((prev) => !prev)}
            >
              {psdType ? <AiFillEye /> : <AiFillEyeInvisible />}
            </span>
          </label>
        </div>
        <button className="bg-yellow-50 rounded-[8px] font-medium text-richblack-900 py-[12px] px-[8px] mt-4 w-full">
          Create Account
        </button>
      </form>
    </div>
  );
}

export default SignUpForm;
