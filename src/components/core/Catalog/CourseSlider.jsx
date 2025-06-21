import React, { useEffect, useState } from 'react'
import {Swiper, SwiperSlide} from 'swiper/react'
import 'swiper/css'
import 'swiper/css/free-mode'
import "swiper/css/pagination";
import {Autoplay, FreeMode, Navigation, Pagination} from 'swiper/modules'
import CourseNewCard from './CourseNewCard';


const CourseSlider = ({Courses}) => {
    // console.log("Courses are", Courses)
  
  return (
    <div>
      {
        Courses?.length ? (
        <Swiper
        slidesPerView={1}
        loop = "true"
        spaceBetween={120}
        pagination = {true}
        modules = {[Pagination, Autoplay, Navigation]}
        className='mySwiper'
        autoplay = {{
          delay: 1000,
          disableOnInteraction: false
        }}
        navigation = {true}
        breakpoints={{
          1024:{slidesPerView:3}
        }}
        >
          {
            Courses?.map((course, index)=>(
            <SwiperSlide key = {index}>
              <CourseNewCard course = {course} Height = "h-[250px]"/>    
            </SwiperSlide>
            ))
          }
          </Swiper>
        ) : (<div>No Course Found</div>)
      }
    </div>
  )
}

export default CourseSlider
