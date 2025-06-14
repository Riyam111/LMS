
import React, { createContext, useEffect, useState } from 'react';
import { dummyCourses } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import humanizeDuration from 'humanize-duration';
import {useAuth,useUser} from "@clerk/clerk-react"
export const AppContext = createContext();

export const AppContextProvider = ( props) => {
  const currency=import.meta.env.VITE_CURRENCY
  const navigate=useNavigate();
const {getToken}=useAuth()
const {user}=useUser()

  const [allCourses,setAllCourses]=useState([]);
  const [isEducator,setEducator]=useState(true);
   const [enrolledCourses, setEnrolledCourses] = useState([]);
  const fetchAllCourses=async()=>{
    setAllCourses(dummyCourses)
  }
  // // Function to calculate average rating of a course
  const calculaterating=(course)=>{
    if(course.courseRatings.length===0){
      return 0;
    }
    let totalRating=0;
     course.courseRatings.forEach(rating=>{
      totalRating+=rating.rating
     })
     return totalRating/course.courseRatings.length
  }
  // Function to calculate the course chapter time
  const calculateCourseChapterTime = (chapter) => {
    const totalDuration = chapter.chapterContent.reduce((acc, lecture) => acc + lecture.lectureDuration, 0);
    return humanizeDuration(totalDuration * 60 * 1000, { units: ['h', 'm'], round: true });
  };
  // Functin to calculate course duration
  const calculateCourseDuration = (course) => {
    let time = 0;
    course.courseContent.map((chapter) => chapter.chapterContent.map((lecture)=>
    time+=lecture.lectureDuration
    ))
      
    
    return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] });
  };
  // Function to calculate to no of lectures in a course
  const calculateNoOfLectures = (course) => {
    let lectures = 0;
    course.courseContent.forEach(chapter => {
      if(Array.isArray(chapter.chapterContent)){
      lectures += chapter.chapterContent.length;}
    });
    return lectures;
  };
  const fetchUserEnrolledCourses=async()=>{
    setEnrolledCourses(dummyCourses)
  }
  useEffect(()=>{
    fetchAllCourses()
    fetchUserEnrolledCourses()
  },[]);
  const logToken=async()=>{
    console.log(await getToken());
  }
  useEffect(()=>{
if(user){
logToken()
}
  },[user])

  const value={
currency,allCourses,navigate,calculaterating,isEducator,setEducator,
calculateCourseChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    enrolledCourses,
    fetchUserEnrolledCourses
  }

 
  

  return (
    <AppContext.Provider value={ value }>
      {props.children}
    </AppContext.Provider>
  );
};
