const { Mongoose } = require("mongoose");
const Category = require("../models/category");
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const CategoryDetails = await Category.create({
      categoryName: name,
      description: description,
    });
    console.log(CategoryDetails);

    return res.status(200).json({
      success: true,
      message: "Category Created Successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.showAllCategories = async (req, res) => {
  try {
    // console.log("INSIDE SHOW ALL CATEGORIES");
    console.log("All categories are")
    const allCategories = await Category.find({});
    // console.log("all categories are", allCategories)
    res.status(200).json({
      success: true,
      data: allCategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//CategoryPageDetails

exports.categoryPageDetails = async(req, res) => {
  try{
    //Get Category Id
    const {categoryId} = req.body ;

    // console.log("categoryId is", categoryId)
    //Get Courses for Specified Category Id
    const selectedCategory = await Category.findById(categoryId)
                                    .populate({
                                      path:"courses",
                                      match: {status: "Published"},
                                      populate: "ratingAndReviews"
                                    })
                                    .exec();
    //Validation
    // console.log("selected category is", selectedCategory);

    if(!selectedCategory) {
      console.log("selected category not found")
      return res.status(404).json({
        success: false,
        message: "Data not Found anything",
      });
    }
    // console.log('category selected successfully')

    //Get Courses for different category
    const categoriesExceptSelected = await Category.find({
                                _id: {$ne: categoryId},
                                })
    
    let differentCategory = await Category.findOne(
      categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id
    ).populate({
      path: "courses",
      match: {status: "Published"}
    }).exec()

    const allCategoriees = await Category.find({}).populate({
      path: "courses",
      match: {status: "Published"},
      populate: {
        path: "instructor"
      }
    }).exec()

    const allCourses = allCategoriees.flatMap((category)=>category.courses)

    //Get Top selling courses
    const mostSellingCourses = allCourses.sort((a, b) => b.sold - a.sold).slice(0,10)
    // console.log("all done in category")
    
    // const plainSelectedCategory = selectedCategory?.toObject?.() || selectedCategory
    // const plainDifferentCategory = selectedCategory?.toObject?.() || differentCategory
    //Return Response
    return res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          differentCategory,
          mostSellingCourses
        }
    })
  }
  catch(err){
      console.log(err);
      return res.status(500).json({
        success: false,
        message: err.message
      })
  }
}
