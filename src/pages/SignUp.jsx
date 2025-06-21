import React from 'react'
import AuthTempelate from '../components/core/Auth/AuthTempelate';
import imageFront from "../assets/Images/login.webp";
import imageBack from "../assets/Images/frame.png";

const SignUp = () => {
  return (
    
      <div>
        <AuthTempelate
          title="Welcome Back"
          desc1="Discover your passions,"
          desc2="Be Unstoppable"
          imageFront={imageFront}
          imageBack={imageBack}
          formType="signup"
          // setIsLoggedIn={setIsLoggedIn}
          // isLoggedIn={isLoggedIn}
        />
      </div>
    
  );
};

export default SignUp
