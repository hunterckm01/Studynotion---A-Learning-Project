import React from 'react'

const StatsComponent = () => {
  const Stats = [
    {
      count: "5K",
      label: "Active Students",
    },
    {
      count: "10+",
      label: "Mentors",
    },
    {
      count: "200+",
      label: "Courses",
    },
    {
      count: "50+",
      label: "Awards",
    },
  ];


  return (
    <section className='className="bg-richblack-700"'>
      <div className="flex flex-col gap-10 justify-between w-11/12 max-w-maxContent text-white mx-auto ">
        <div className="grid grid-cols-2 md:grid-cols-4 text-center">
          {Stats.map((data, index) => (
            <div className="flex flex-col py-10" key={index}>
              <h1 className="text-[30px] font-bold text-richblack-5">
                {data.count}
              </h1>
              <p className="font-semibold text-[16px] text-richblack-500">
                {data.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsComponent;
