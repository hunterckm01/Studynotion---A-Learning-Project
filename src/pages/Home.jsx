import React from "react"
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import HighlightText from "../components/core/HomePage/HighlightText";
import CTAButton from "../components/core/HomePage/Button";
import Banner from '../assets/Images/banner.mp4'
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import TimelineSection from "../components/core/HomePage/TimelineSection";
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection";
import InstructorSection from "../components/core/HomePage/InstructorSection";
import ExploreMore from "../components/core/HomePage/ExploreMore";
import Footer from "../components/common/Footer";
import ReviewSlider from "../components/common/ReviewSlider";

const Home = () => {
    return (
      <>
        {/* Section 1 */}
        <div className="relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between">
          <Link to={"/signup"}>
            <div className="group mt-24 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit">
              <div className="group-hover:bg-richblack-900 flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200">
                <p>Become an Instructor</p>
                <FaArrowRight />
              </div>
            </div>
          </Link>

          <p className="text-center text-4xl font-semibold mt-7">
            Empower Your Future Growth with{" "}
            <HighlightText text={"Coding Skills"}> </HighlightText>
          </p>

          <p className="w-[90%] text-center text-lg font-bold text-richblack-300 mt-4">
            With our online coding courses, you can learn at your own pace, from
            anywhere in the world, and get access to a wealth of resources,
            including hands-on projects, quizzes, and personalized feedback from
            instructors
          </p>

          <div className="flex flex-row gap-7 mt-8">
            <CTAButton active={true} linkto={"/signup"}>
              Learn More
            </CTAButton>

            <CTAButton active={false} linkto={"/login"}>
              Book a Demo
            </CTAButton>
          </div>

          <div className="shadow-blue-200 mx-3 my-12">
            <video muted loop autoPlay className="h-160">
              <source src={Banner} type="video/mp4"></source>
            </video>
          </div>

          {/* Code Section 1 */}
          <div className="mx-3">
            <CodeBlocks
              codeColor={"text-yellow-200"}
              position={`lg:flex-row`}
              heading={
                <div className="text-4xl font-semibold">
                  Unlock Your <HighlightText text={"coding potential"} /> with
                  our online courses
                </div>
              }
              subheading={
                "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
              }
              ctabtn1={{
                btnText: "Try it youreself",
                linkto: "/signup",
                active: true,
              }}
              ctabtn2={{
                btnText: "Learn More",
                linkto: "/login",
                active: false,
              }}
              codeblock={` <!DOCTYPE html>
                <html>
                <head><title>Example</title>
                <linkrel="stylesheet" href = "styles.css">
                </head>
                <body>
                <h1><a href = "/">Header</a></h1>
                <nav><a href = "one/">One</a><a href = "two">Two</a>
                <a href = "three/">Three</a></nav>`}
            />
          </div>

          {/* Code Section 2 */}
          <div className="mx-3 ">
            <CodeBlocks
              codeColor={"text-yellow-200"}
              position={`lg:flex-row-reverse`}
              heading={
                <div className="text-4xl font-semibold">
                  Start <HighlightText text={"coding in seconds"} />
                </div>
              }
              subheading={
                "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
              }
              ctabtn1={{
                btnText: "Try it youreself",
                linkto: "/signup",
                active: true,
              }}
              ctabtn2={{
                btnText: "Learn More",
                linkto: "/login",
                active: false,
              }}
              codeblock={` <!DOCTYPE html>
                <html>
                <head><title>Example</title>
                <linkrel="stylesheet" href = "styles.css">
                </head>
                <body>
                <h1><a href = "/">Header</a></h1>
                <nav><a href = "one/">One</a><a href = "two">Two</a>
                <a href = "three/">Three</a></nav>`}
            />
          </div>

          <ExploreMore />
        </div>

        {/* Section 2 */}
        <div className="bg-pure-greys-5 text-richblack-700">
          <div className="homepage_bg h-[320px]">
            <div className="gap-8 w-11/12 max-w-maxContent flex items-center mx-auto flex-col justify-between">
              <div className="h-[150px]"></div>
              <div className="flex flex-row gap-7 text-white ">
                <CTAButton active={true} linkto={"/signup"}>
                  <div className="flex items-center gap-3">
                    Explore Full Catalog
                    <FaArrowRight />
                  </div>
                </CTAButton>
                <CTAButton active={false} linkto={"/signup"}>
                  <div className="flex items-center gap-3">Learn More</div>
                </CTAButton>
              </div>
            </div>
          </div>

          <div className="w-11/12 max-w-maxContent flex items-center mx-auto flex-col justify-between gap-7">
            <div className="flex flex-row gap-5 mt-[95px] mb-10">
              <div className="text-4xl font-semibold w-[45%]">
                Get the skills you need for a
                <HighlightText text={" job that is in demand"} />
              </div>

              <div className="flex flex-col gap-10 w-[40%] items-start">
                <div className="text-[16px] font-medium ">
                  The modern StudyNotion is the dictates its own terms. Today,
                  to be a competitive specialist requires more than professional
                  skills.
                </div>
                <CTAButton linkto={"/signup"} active={true}>
                  Learn More
                </CTAButton>
              </div>
            </div>

            <TimelineSection />

            <LearningLanguageSection />
          </div>
        </div>

        {/* Section 3 */}

        <div className="w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8  bg-richblack-900 text-white">
          <InstructorSection />

          <h2 className="text-center text-4xl font-semibold mt-10">
            Review from other Learners
          </h2>

          <ReviewSlider/>
        </div>

        {/* Footer  */}
        <Footer />
      </>
    );
}

export default Home