import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import CountryCode from '../../data/countrycode.json'

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false);
  const {
    register, 
    handleSubmit,
    reset, 
    formState: {errors, isSubmitSuccessfull}
  } = useForm();

  const submitContactForm = async(data) => {
    console.log(data);
    try{
      setLoading(true)
      // const response = await apiConnector("POST", contactusEndpoint.CONTACT_US_API, data);
      const response = {status: 'OK'}
      console.log("Logging response in Contact Us Form", response)
      setLoading(false);
    } 
    catch(err){
      console.log("Error", err.message)
      setLoading(false)
    }
  }

  useEffect(()=>{
    if(isSubmitSuccessfull){
      reset({
        email: "",
        firstName: "",
        lastName: "",
        message: "",
        phoneNumber: ""
      })
    }
  },[isSubmitSuccessfull, reset])

  return (
    <form className="flex flex-col gap-7" onSubmit={handleSubmit(submitContactForm)}>
      <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">
        <div className="flex flex-col gap-2 lg:w-[48%]">
          {/* First Name */}
            <label htmlFor="firstName" className="label-style">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="Enter Your First Name"
              className="form-style"
              {...register("firstName", { required: true })}
            />
            {errors.firstName && <span>Please Enter First Name</span>}
          </div>
          {/* Last Name */}
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="lastName" className="label-style">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Enter Your Last Name"
              className="form-style"
              {...register("lastName")}
            />
          </div>
        </div>
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="label-style">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="random@xyz"
              className="form-style"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                Enter Email Address
              </span>
            )}
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-2">
            <label htmlFor="phoneNumber" className="label-style">
              Enter Phone Number
            </label>
            <div className="flex gap-5">
              {/* DropDown */}

              <select
                className="w-[80px] flex flex-col gap-2 form-style"
                name="dropdown"
                id="dropdown"
                {...register("countrycode", { required: true })}
              >
                {CountryCode.map((element, index) => (
                  <option
                    className="bg-slate-800 text-white"
                    key={index}
                    value={element.code}
                  >
                    {element.code} - {element.country}
                  </option>
                ))}
              </select>

              <input
                className="w-[calc(100%-90px)] flex flex-col gap-2 form-style"
                type="number"
                name="phoneNumber"
                id="phoneNumber"
                placeholder="Enter Number"
                {...register("phoneNumber", {
                  required: {
                    value: true,
                    message: "Please Enter Phone Number",
                  },
                  maxLength: { value: 10, message: "Invalid PhoneNumber" },
                  minLength: { value: 8, message: "Invalid phone Number" },
                })}
              />
            </div>
            {errors.phoneNumber && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                {errors.phoneNumber.message}
              </span>
            )}
          </div>

          {/* Message */}
          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="label-style">
              Message
            </label>
            <textarea
              type="message"
              id="message"
              cols="30"
              rows="7"
              placeholder="Have your Views"
              className="form-style resize-none"
              {...register("message", { required: true })}
            />
            {errors.message && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                Enter Your Message
              </span>
            )}
          </div>

          <button
            className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
         ${
           !loading &&
           "transition-all duration-200 hover:scale-95 hover:shadow-none"
         }  disabled:bg-richblack-500 sm:text-[16px] `}
            type="submit"
          >
            Send Message
          </button>
       
    </form>
  );
}

export default ContactUsForm
