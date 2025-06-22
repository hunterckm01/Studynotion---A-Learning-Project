# 📘 StudyNotion - Full Stack EdTech Platform

StudyNotion is a full-stack EdTech web application where users can explore, purchase, and learn from online courses, while instructors can create and manage their own course content. The platform offers real-time user authentication, course management, media uploads, and secure payments.

---

## 🚀 Features

### 👨‍🏫 For Instructors:
- Create, update, and delete courses
- Upload videos to Cloudinary
- Add modules, sub-sections, quizzes, and resources
- Track enrolled students

### 🧑‍🎓 For Students:
- Browse and purchase courses
- View enrolled courses in dashboard
- Resume video playback with progress tracking
- Take quizzes and download resources

### 🔒 Authentication:
- JWT-based login & signup
- Email verification and password reset via nodemailer
- Role-based access (Admin, Instructor, Student)

### 💳 Payment:
- Stripe integration for course purchases
- Success and cancel handling

### 📦 Cloud Uploads:
- Videos & thumbnails uploaded securely to Cloudinary

---

## 🧩 Tech Stack

### 🖥 Frontend:
- React.js
- Tailwind CSS
- React Router DOM
- Redux Toolkit (for global state)
- Axios

### ⚙️ Backend:
- Node.js
- Express.js
- MongoDB + Mongoose
- Cloudinary (media hosting)
- Nodemailer (email services)
- Stripe (payment gateway)
- JWT (auth & security)

