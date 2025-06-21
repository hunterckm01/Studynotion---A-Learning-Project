const express = require('express');
const app = express();



const userRoutes = require('./routes/User');
const profileRoutes = require('./routes/Profile');
const paymentRoutes = require('./routes/Payments');
const courseRoutes = require('./routes/Course');

const database = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const {cloudinaryConnect} = require('./config/cloudinary');
const fileUpload = require("express-fileupload");
const dotenv = require('dotenv');

const FRONTEND_URL = process.env.VITE_APP_BASE_URL ;
// console.log(FRONTEND_URL);
// console.log("Frontend url is", process.env.FRONTEND_URL);

dotenv.config();
const PORT = process.env.PORT  ;
const PORT2 = 4001 ;

// console.log("PORT THAT IS GOING TO BE USE IS", PORT)

//Database Connect
database.connect();
//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp"
    }
    )
)
//Cloudinary Connection
cloudinaryConnect();

//Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);


//Default Route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your message is up and running"
    })
});

// Get to the fall back port
const newServer = (PORT) => {
    app.listen(PORT, ()=>{
        console.log(`APP IS RUNNING AT ${PORT}`)
    })
}



const server = app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
})

// console.log("Error Occured")
server.on("error", (err)=>{
    // console.log("Here")
    if(err.code === 'EADDRINUSE'){
        console.warn(`Port ${PORT} is already in use`)
        if(PORT !== PORT2){
            newServer(PORT2);
        }
        else{
            console.error("Both the ports are already in use")
            process.exit(1)
        }
    }
    else{
        console.error("Server Error", err)
    }
})


