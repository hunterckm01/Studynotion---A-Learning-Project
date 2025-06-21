import React, { useState } from 'react'
import {HomePageExplore} from '../../../data/homepage-explore'
import CourseCard from "./CourseCard.jsx";
import HighlightText from './HighlightText';

const tabsName = [
    "Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths",

]

const ExploreMore = () => {

    const [currentTab, setCurrentTab] = useState(tabsName[0]);
    const [courses, setCourses] = useState(HomePageExplore[0].courses);
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

    const setMyCards = (value) => {
        setCurrentTab(value);
        const result = HomePageExplore.filter((course)=>course.tag === value);
        setCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading)
    }

  return (
    <div>
      <div className=" text-4xl font-semibold text-center border-richblack-100 ">
        Unlock the
        <HighlightText text=" Power of Code" />
      </div>

      <p className="text-center text-richblack-300 text-base font-medium mt-3">
        Learn to build anything you can imagine
      </p>

      <div className="flex rounded-full bg-richblack-800 mt-5 px-1 py-1 mb-5 ">
        {tabsName.map((element, index) => {
          return (
            <div
              className={`text-base flex gap-2 items-center 
                ${
                  currentTab === element
                    ? "bg-richblack-900 text-richblack-5 font-medium"
                    : "text-richblack-200"
                } rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5 px-7 py-3 `}
              key={index}
              onClick={() => setMyCards(element)}
            >
              {element}
            </div>
          );
        })}
      </div>

      <div className="w-full relative lg: h-[200px]"></div>
      {/* Course Card */}

      <div className="lg:absolute flex flex-row gap-10 justify-between  mx-auto w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[35%] lg:mb-0 lg:px-0">
        {courses.map((element, index) => {
          return (
            <CourseCard
              key={index}
              cardData={element}
              currentCard={currentCard}
              setCurrentCard={setCurrentCard}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ExploreMore
