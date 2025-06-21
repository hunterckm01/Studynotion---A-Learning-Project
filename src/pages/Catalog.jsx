import React, { useEffect, useState } from 'react'
import Footer from '../components/common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector'
import { categories } from '../services/apis'
import { getCatalogPageData } from '../services/operations/pageAndComponentData'
import CourseSlider from '../components/core/Catalog/CourseSlider'
import CourseNewCard from '../components/core/Catalog/CourseNewCard'

const Catalog = () => {
  const {catalogName} = useParams()
  const [catalogPageData, setCatalogPageData] = useState(null)
  const [categoryId, setCategoryId] = useState("")
  const [active, setActive] = useState(1)

  //FETCH ALL CATEGORIES
  useEffect(()=>{
    const getCategories = async() => {
      const response = await apiConnector('GET', categories.CATEGORIES_API)
      // console.log("response is", response)
      const category_id = response?.data?.data?.filter((ct) => ct.categoryName.split(" ").join("-").toLowerCase() === catalogName)[0]._id
      // console.log("category id is", category_id)
      setCategoryId(category_id)
      
    }
    getCategories()
    // console.log("process ended")
  },[catalogName])

  useEffect(()=>{
    const getCategoryDetails = async() => {
      // console.log("process started")
      try{
        // console.log("category id inside category id effect", categoryId)
        const response = await getCatalogPageData(categoryId);
        console.log("response of categories selected", response?.data?.selectedCategory)
        setCatalogPageData(response)
        // console.log("catalog data is", catalogPageData)
      }
      catch(err){
        console.log(err)
      }
    }
    if(categoryId)
    getCategoryDetails()
  },[categoryId])

  useEffect(() => {
    console.log("catalog page data is", catalogPageData);
  }, [catalogPageData]);
  
  return (
    <div className="text-richblack-5">
      <div className=" box-content bg-richblack-800 px-4">
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
          <p className="text-sm text-richblack-300">
            {`Home / Catalog / `}
            <span className="text-yellow-25">
              {catalogPageData?.data?.selectedCategory?.categoryName}
            </span>
          </p>
          <p className="text-3xl text-richblack-5">
            {catalogPageData?.data?.selectedCategory?.categoryName}
          </p>
          <p className="max-w-[870px] text-richblack-200">
            {catalogPageData?.data?.selectedCategory?.description}
          </p>
        </div>
      </div>

      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">
          <div className="my-4 flex border-b border-b-richblack-600 text-sm">
            <p
              className={`px-4 py-2 ${
                active === 1
                  ? "border-b border-b-yellow-25 text-yellow-25"
                  : "text-richblack-50"
              } cursor-pointer`}
              onClick={() => setActive(1)}
            >
              Most Populer
            </p>
            <p
              className={`px-4 py-2 ${
                active === 2
                  ? "border-b border-b-yellow-25 text-yellow-25"
                  : "text-richblack-50"
              } cursor-pointer`}
              onClick={() => setActive(2)}
            >
              New
            </p>
          </div>
          <CourseSlider
            Courses={catalogPageData?.data?.selectedCategory?.courses}
          />
        </div>

        <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
          <p className="section_heading">
            Top Coureses in{" "}
            {catalogPageData?.data?.selectedCategory?.categoryName}
          </p>
          <div className="py-8">
            <CourseSlider
              Courses={catalogPageData?.data?.differentCategory?.courses}
            />
          </div>
        </div>

        <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
          <p className="section_heading">Frequently Bought</p>
          <div className="py-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {catalogPageData?.data?.mostSellingCourses
                ?.slice(0, 4)
                .map((course, index) => (
                  <CourseNewCard
                    course={course}
                    key={index}
                    Height="h-[300px] w-[300px]"
                  />
                ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Catalog
