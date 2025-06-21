import React from 'react'
import HighlightText from './HighlightText'
import know_your_progress from '../../../assets/Images/know_your_progress.svg'
import compare_with_others from "../../../assets/Images/Compare_with_others.svg";
import plan_your_lesson from "../../../assets/Images/Plan_your_lessons.svg";
import CTAButton from './Button';

const LearningLanguageSection = () => {
  return (
    <div className="mt-[110px] mb-16">
      <div className="flex flex-col gap-5 items-center">
        <div className="text-4xl font-semibold text-center ">
          Your swiss knife for
          <HighlightText text=" learning any language" />
        </div>

        <p className="text-center text-richblack-600 mx-auto text-base mt-3 font-normal w-[70%]">
          Using spin making learning multiple languages easy. with 20+ languages
          realistic voice-over, progress tracking, custom schedule and more.
        </p>

        <div className='flex flex-row items-center justify-center mt-5'>
          <img 
            src={know_your_progress} 
            alt="know your progress image" className="object-contain -mr-32" />

          <img 
            src={compare_with_others}                            alt="compare_with_others image" className="object-contain" />

          <img 
            src={plan_your_lesson} 
            alt="Plan your lesson image" className="object-contain -ml-40 -mt-16" />
        </div>

        <div className='w-fit'>
            <CTAButton active = {true} linkto = {"/signup"}>
            Learn More</CTAButton>
        </div>
      </div>
    </div>
  );
}

export default LearningLanguageSection
