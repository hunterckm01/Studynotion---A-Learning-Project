import React from 'react'
import { LearningGridArray }  from '../../../data/learning-grid-array.js'
import HighlightText from '../HomePage/HighlightText'
import CTAButton from '../HomePage/Button'

const LearningGrid = () => {
    // console.log(LearningGridArray);
  return (
    <div className="grid mx-auto w-[350px] xl:w-fit grid-cols-1 xl:grid-cols-4 mb-12">
      {LearningGridArray.map((card, index) => (
        <div
          key={index}
          className={`${index === 0 && "lg:col-span-2 lg:h-[280px]"}
                        ${
                          card.order % 2 === 1
                            ? "bg-richblack-700 lg:h-[280px]"
                            : "bg-richblack-800  lg:h-[280px]"
                        }
                        ${card.order === 3 && "lg:col-start-2"} 
                        ${card.order < 0 && "bg-transparent"}
                        `}
        >
          {card.order < 0 ? (
            <div className="lg:w-[90%] flex flex-col pb-5 gap-3 py-5 ">
              <div className="text-4xl font-semibold">
                {card.heading}
                <HighlightText text={card.highlightText} />
              </div>
              <p className="font-medium text-richblack-300">{card.description}</p>
              <div className="w-fit mt-2">
                <CTAButton active={true} linkto={card.BtnLink}>
                  {card.BtnText}
                </CTAButton>
              </div>
            </div>
          ) : (
            <div className="p-7 flex flex-col gap-8">
              <h2 className="text-richblack-5 text-lg">{card.heading}</h2>
              <p className="text-richblack-300 font-medium">
                {card.description}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default LearningGrid
