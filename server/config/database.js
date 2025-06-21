const mongoose = require('mongoose');
require('dotenv').config();

exports.connect = () => {
    mongoose.connect(process.env.DB_URL)
    .then(()=>console.log("DB Connection Successfull"))
    .catch((err)=>{
        console.log("Error while Connecting to DB");
        console.error(err);
        process.exit(1);
    })
}