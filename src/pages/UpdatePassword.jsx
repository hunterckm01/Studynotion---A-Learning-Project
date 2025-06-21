import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { resetPassword } from '../../server/controllers/ResetPassword';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { Link, useLocation } from 'react-router-dom';
import { resetPassword } from '../services/operations/authAPI'

const UpdatePassword = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const {loading} = useSelector((state)=>state.auth)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    })

    const handleOnChange = (e) => {
        setFormData((prevData)=> (
            {
                ...prevData,
                [e.target.name] : e.target.value
            }
        ) )
    }

    const {password, confirmPassword} = formData ;

    const handleOnSubmit = (e) => {
        e.preventDefault();
        const token = location.pathname.split('/').at(-1);
        dispatch(resetPassword(password, confirmPassword, token))
    }

  return (
    <div className="text-white">
      {loading ? (
        <div>Loading....</div>
      ) : (
        <div>
          <h1>Choose New Password</h1>
          <p>Almost Done. Enter your new password and you're all set</p>
          <form onSubmit={handleOnSubmit}>
            <label>
              <p>
                New Password<sup>*</sup>
              </p>
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="password"
                className="w-full p-4 bg-richblack-600 text-richblack-5"
              />
              <span onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? (
                  <AiFillEyeInvisible fontSize={24} />
                ) : (
                  <AiFillEye fontSize={24} />
                )}
              </span>
            </label>

            <label>
              <p>
                Confirm New Password<sup>*</sup>
              </p>
              <input
                required
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleOnChange}
                placeholder="confirm password"
                className="w-full p-4 bg-richblack-600 text-richblack-5"
              />
              <span onClick={() => setConfirmPassword((prev) => !prev)}>
                {showConfirmPassword ? (
                  <AiFillEyeInvisible fontSize={24} />
                ) : (
                  <AiFillEye fontSize={24} />
                )}
              </span>
            </label>

            <button type="submit">Reset Password</button>
          </form>

          <div>
            <Link to="/login">
              <p>Back to Login</p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdatePassword
