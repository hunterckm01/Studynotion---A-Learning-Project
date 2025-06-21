const BACKEND_URL = "http://localhost:4000/api/v1"

//AUTH ENDPOINTS
export const authEndpoints = {
  SENDOTP_API: BACKEND_URL + "/auth/sendotp",
  SIGNUP_API: BACKEND_URL +  "/auth/signup",
  LOGIN_API: BACKEND_URL + "/auth/login",
  RESETPASSTOKEN_API: BACKEND_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BACKEND_URL + "/auth/reset-password",
};

//PROFILE ENDPOINTS
export const profileEndpoints = {
    GET_USER_DETAILS_API: BACKEND_URL + "/profile/getUserDetails",
    GET_USER_ENROLLED_COURSES_API: BACKEND_URL + "/profile/getEnrolledCourses",
    GET_INSTRUCTOR_DATA_API: BACKEND_URL + "/profile/instructorDashboard"
}

//STUDENTS ENDPOINTS
export const studentEndpoints = {
    COURSE_PAYMENT_API: BACKEND_URL + "/payment/capturePayment",
    COURSE_VERIFY_API: BACKEND_URL + "/payment/verifyPayment",
    SEND_PAYMENT_SUCCESS_EMAIL_API: BACKEND_URL + "/payment/sendPaymentSuccessEmail"
}

//COURSE ENDPOINTS
export const courseEndpoints = {
  GET_ALL_COURSES_API: BACKEND_URL + "/course/getAllCourses",
  COURSE_DETAILS_API: BACKEND_URL + "/course/getCourseDetails",
  // COURSE_FULL_DETAILS_API: BACKEND_URL + "/course/getFullCourseDetails",
  EDIT_COURSE_API: BACKEND_URL + "/course/editCourse",
  COURSE_CATEGORIES_API: BACKEND_URL + "/course/showAllCategories",
  CREATE_COURSE_API: BACKEND_URL + "/course/createCourse",
  CREATE_SECTION_API: BACKEND_URL + "/course/addSection",
  CREATE_SUBSECTION_API: BACKEND_URL + "/course/addSubSection",
  UPDATE_SECTION_API: BACKEND_URL + "/course/updateSection",
  UPDATE_SUBSECTION_API: BACKEND_URL + "/course/updateSubSection",
  GET_ALL_INSTRUCTOR_COURSES_API: BACKEND_URL + "/course/getInstructorCourses",
  DELETE_SECTION_API: BACKEND_URL + "/course/deleteSection",
  DELETE_SUBSECTION_API: BACKEND_URL + "/course/deleteSubSection",
  DELETE_COURSE_API: BACKEND_URL + "/course/deleteCourse",
  GET_FULL_COURSE_DETAILS_AUTHENTICATED:
    BACKEND_URL + "/course/getFullCourseDetails",
  LECTURE_COMPLETION_API: BACKEND_URL + "/course/updateCourseProgress",
  CREATE_RATING_API: BACKEND_URL + "/course/createRating",
};

//RATINGS AND REVIEWS
export const ratingsEndpoints = {
    REVIEWS_DETAILS_API: BACKEND_URL + "/course/getReviews"
}

//CATEGORIES API
export const categories = {
    CATEGORIES_API: BACKEND_URL + "/course/showAllCategories"
}

//CATALOG PAGE DATA
export const catalogData = {
    CATALOGPAGEDATA_API: BACKEND_URL + "/course/getCategoryPageDetails"
}

//CONTACT US API
// export const contactusEndpoints = {
//     CONTACT_US_API: BACKEND_URL + "/reach/contact"
// }

//SETTINGS PAGE API
export const settingsEndpoints = {
    UPDATE_DISPLAY_PICTURE_API: BACKEND_URL + "/profile/updateDisplayPicture",
    UPDATE_PROFILE_API: BACKEND_URL + "/profile/updateProfile",
    CHANGE_PASSWORD_API: BACKEND_URL + "/auth/changepassword",
    DELETE_PROFILE_API: BACKEND_URL + "/profile/deleteProfile"
}