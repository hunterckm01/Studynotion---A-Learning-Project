import React, { useState } from 'react'
import {Pie} from 'react-chartjs-2'
import { Chart, registerables } from "chart.js";
// import CoursesTable from '../InstructorCourses/CoursesTable'
Chart.register(...registerables);

const InstructorChart = ({courses}) => {

    const [currChart, setCurrChart] = useState("students")
    const getRandomColors = (numColors) => {
        const colors = []
        for(let i = 0; i < numColors; i++){
            const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random()*256)}, ${Math.floor(Math.random() * 256)})`
            colors.push(color)
        }
        return colors;
    }

    //Create data for chart display student info
    const chartDataForStudents = {
        labels: courses.map((course)=>course.courseName),
        datasets: [{
            data: courses.map((course)=>course.totalStudentsEnrolled),
            backgroundColor: getRandomColors(courses.length),
            
        }]
    }


    //Create Data for chart displaying Income Info
    const chartDataForIncome = {
        labels: courses.map((course)=>course.courseName),
        datasets: [{
            data: courses.map((course)=>course.totalAmountGenerated),
            backgroundColor: getRandomColors(courses.length)
        }]
    }   


    //Options
    const options = {
      maintainAspectRatio: false,
    };

  return (
    <div>
      <p>Visulaize</p>
      <div>
        <button onClick={()=>setCurrChart("students")}>Student</button>
        <button onClick={()=>setCurrChart("income")}>Income</button>
      </div>
      <div>
        <Pie
          data={
            currChart === "students" ? chartDataForStudents : chartDataForIncome
          }
          options={options}
        />
      </div>
    </div>
  );
}

export default InstructorChart
