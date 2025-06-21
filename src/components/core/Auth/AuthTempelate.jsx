import React from 'react'
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

const AuthTempelate = ({title, desc1, desc2, imageFront, imageBack, formType, setIsLoggedIn, isLoggedIn}) => {
  return (
    <div className="w-11/12 max-w-maxContent flex  text-white mx-auto gap-x-12 py-8 justify-between my-8">
      {/* Left Side Frame */}
      <div className="border-red-500 border-2 p-8 w-11/12">
        <h2 className="text-3xl text-richblack-5 font-semibold font-inter">
          {title}
        </h2>
        <p className="mt-3 text-richblack-100 text-base leading-7">{desc1}</p>
        <p className="leading-6 text-blue-100 font-edu-sa font-bold">{desc2}</p>
        {formType === "signup" ? (
          <SignUpForm setIsLoggedIn={setIsLoggedIn} />
        ) : (
          <LoginForm setIsLoggedIn={setIsLoggedIn} />
        )}
      </div>

      {/* Right Side Frame */}
      <div className="relative w-full">
        <img
          src={imageFront}
          height={504}
          width={558}
          className="relative z-10 "
        />
        <img
          src={imageBack}
          height={504}
          width={558}
          className="absolute top-7 left-10 z-[1]"
        />
      </div>
    </div>
  );
}

export default AuthTempelate
