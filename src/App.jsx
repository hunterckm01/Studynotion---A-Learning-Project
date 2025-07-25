import { React } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { useState } from 'react';
// import Footer from './components/common/Footer';
import Navbar from './components/common/Navbar';
import ForgotPassword from './pages/ForgotPassword';
import OpenRoute from './components/core/Auth/OpenRoute';
import UpdatePassword from './pages/UpdatePassword';
import VerifyEmail from './pages/VerifyEmail';
import MyProfile from './components/core/Dashboard/MyProfile';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import PrivateRoute from './components/core/Auth/PrivateRoute';
import Error from './pages/Error';
import Dashboard from './pages/Dashboard';
import Settings from './components/core/Dashboard/Settings/index';
import EnrolledCourses from './components/core/Dashboard/EnrolledCourses';
import Cart from "./components/core/Dashboard/Cart/index";
import { ACCOUNT_TYPE } from './utils/constants'
import { useSelector } from 'react-redux';
import AddCourse from './components/core/Dashboard/AddCourse';
import MyCourses from './components/core/Dashboard/AddCourse/MyCourses';
import EditCourse from './components/core/Dashboard/EditCourse/index';
import Catalog from './pages/Catalog';
import CourseDetails from './pages/CourseDetails'
import ViewCourse from './pages/ViewCourse';
import VideoDetails from './components/core/ViewCourse/VideoDetails';
import Instructor from './components/core/Dashboard/InstructorDashboard/Instructor';


const App = () => {

  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {user} = useSelector(state => state.profile)
  
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/catalog/:catalogName" element={<Catalog />}></Route>
        <Route path="/courses/:courseId" element={<CourseDetails/>} />
        {/* <Route path = ""></Route> */}

        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        ></Route>

        <Route
          path="/signup"
          element={
            <OpenRoute>
              <SignUp />
            </OpenRoute>
          }
        ></Route>

        <Route
          path="/forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        ></Route>

        <Route
          path="/verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        ></Route>

        <Route
          path="/update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        ></Route>

        <Route path="/about" element={<About />}></Route>

        {/* Dashboard Private Routes */}
        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard/my-profile" element={<MyProfile />} />
          <Route path="/dashboard/settings" element={<Settings />} />

          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route path="/dashboard/cart" element={<Cart />} />
              <Route
                path="/dashboard/enrolled-courses"
                element={<EnrolledCourses />}
              />
            </>
          )}

          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path = "/dashboard/instructor" element = {<Instructor/>}/>
              <Route path="/dashboard/add-course" element={<AddCourse />} />
              <Route path="/dashboard/my-courses" element={<MyCourses />} />
              <Route
                path="/dashboard/edit-course/:courseId"
                element={<EditCourse />}
              />
            </>
          )}
        </Route>

        <Route
          element = {
          <PrivateRoute>
            <ViewCourse/>
          </PrivateRoute>  }
        >
          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route
                path = "/view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element = {<VideoDetails/>}
                />

              </>
            )
          }
        </Route>

        <Route path="*" element={<Error />} />

        <Route path="/contact" element={<ContactUs />} />
      </Routes>
    </div>
  );
}

export default App ;
