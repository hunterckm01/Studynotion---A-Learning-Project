const Category = require('../models/category');

//Create Tag Handler Function

exports.createCategory = async(req, res) => {
    try{
        //Fetch Data
        const {name, description} = req.body ;

        //Validation
        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: "All fields are mandatory"
            })
        }

        //Create Entry in DB
        const categoryDetails = await Category.create({
            name: name, 
            description: description
        });

        console.log(categoryDetails);

        //Return the successfull Response
        return res.status(200).json({
            success: true,
            message: "New Tag has been Created"
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


//Get All Tags Handler

exports.showAllCategories = async(req, res) => {
    try{
        //Find All the tags
        const allTags = await Category.find({}, {name: true, description: true});

        //Return the successfull responseoo
        res.status(200).json({
            success: true,
            message: "All tags are returned successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}