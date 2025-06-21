import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI";
import { useNavigate } from "react-router-dom";

const EnrolledCourses = () => {

  const { token } = useSelector((state) => state.auth);
  const [enrolledCourses, setEnrolledCourses] = useState(null);
  const navigate = useNavigate()

  const getEnrolledCourses = async () => {
    try {
      const response = await getUserEnrolledCourses(token);
      console.log("response is: ",response)
      setEnrolledCourses(response);
      console.log(enrolledCourses)
    } catch(err) {
      console.log("Unable to fetch user enrolled courses");
    }
  };

  useEffect(() => {
    getEnrolledCourses();
  }, []);

  return (
    <div className="text-richblack-5">
      <h2 className="text-3xl text-richblack-50">Enrolled Courses</h2>
      {!enrolledCourses ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div>Loading...</div>
        </div>
      ) : !enrolledCourses.length ? (
        <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
          You have not enrolled in any courses
        </p>
      ) : (
        <div className="my-8 text-richblack-5">
          <div className="flex rounded-t-lg bg-richblack-500 ">
            <p className="w-[45%] px-5 py-3">Course Name</p>
            <p className="w-1/4 px-2 py-3">Duration</p>
            <p className="flex-1 px-2 py-3">Porgress</p>
          </div>

          {enrolledCourses.map((course, i, arr) => (
            <div
              className={`flex items-center border border-richblack-700 ${
                i === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
              }`}
              key={i}
            >
              <div className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                onClick = {()=>{
                  console.log("course id is ", course?._id)
                  navigate(`/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`)}}
              >
                <img
                  src={course.thumbnail}
                  alt="course_img"
                  className="h-14 w-14 rounded-lg object-cover"
                />
                <div className="flex max-w-xs flex-col gap-2">
                  <p className="font-semibold">{course.courseName}</p>
                  <p className="text-xs text-richblack-300">
                    {course.courseDescription.length > 50
                      ? `${course.courseDescription.slice(0, 50)}...`
                      : course.courseDescription}
                  </p>
                </div>
              </div>

              <div className="w-1/4 px-2 py-3">{course?.totalDuration}</div>
              <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                <p>Progress: {course.progressPercentage || 0} %</p>
                {/* Check here for progress bar error */}
                <progress value={course.progressPercentage || 0} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
