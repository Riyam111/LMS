import React, { useContext, useEffect, useState } from 'react'
import Footer from '../../components/student/Footer';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import YouTube from 'react-youtube';
import humanizeDuration from 'humanize-duration';
import RatingComponent from '../../components/student/RatingComponent';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';
import axios from 'axios';

const Player = () => {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [openSections, setOpenSections] = useState({
      0: true,
    });
    const [initialRating, setInitialRating] = useState(0);
     const [progressData, setProgressData] = useState(null);
  const {
    enrolledCourses,
    calculateCourseChapterTime,
    backendUrl,
    getToken,
    userData,
    fetchUserEnrolledCourses
    
  } = useContext(AppContext);
  const fetchCourseData = async () => {
    await enrolledCourses.map((course) => {
      if (course._id === courseId) {
        setCourseData(course);
        course?.courseRatings.map((rating) => {
          if (rating.userId === userData._id) {
            setInitialRating(rating.rating);
          }
        });
      }
    });
  };
 const markLectureAsCompleted = async (lectureId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl+'/api/user/update-course-progress',
        { courseId, lectureId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
       
        toast.success(data.message);
        getCourseProgress();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl+'/api/user/get-course-progress',
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        setProgressData(data.progressData);
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      
      toast.error(error.message);
    }
  };
  const handleRating = async (rating) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/add-rating`,
        { courseId, rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        fetchUserEnrolledCourses()
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
// total lectures in the course
const totalLectures = courseData?.courseContent?.reduce(
  (acc, chapter) => acc + chapter.chapterContent.length,
  0
);

// check if course is completed
const isCourseCompleted =
  progressData?.lectureCompleted?.length === totalLectures;

  useEffect(()=>{
    if(enrolledCourses.length>0){
    fetchCourseData() }   
  },[enrolledCourses])
   const toggleOpenSections = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };
  useEffect(()=>{
    getCourseProgress()
  },[])
  //handel certificate function
  const downloadCertificate = async () => {
  try {
    const token = await getToken(); // Clerk or auth method
    const response = await fetch(`${backendUrl}/api/user/get-certificate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ courseId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return toast.error(errorData.message || "Failed to download certificate");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${courseData.courseTitle}_Certificate.pdf`;
    a.click();
    a.remove();
  } catch (error) {
    toast.error(error.message);
  }
};


  return courseData? (
   <>
    <div className="p-4 sm:p-10 flex flex-row-reverse md:grid md:grid-cols-2 gap-10 md:px-36">
        {/* left column */}
        <div className="text-gray-800">
          <h2 className="text-xl font-semibold">Course Structure</h2>
          <div className="pt-5">
            {courseData &&
              courseData.courseContent.map((chapter, index) => (
                <div
                  key={index}
                  className="border border-gray-300 bg-white mb-2 rounded"
                >
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer select-none bg-gray-200/50"
                    onClick={() => toggleOpenSections(index)}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        className={` transform transition-transform ${
                          openSections[index] ? "rotate-180" : ""
                        } `}
                        src={assets.down_arrow_icon}
                        alt="down_arrow_icon"
                      />
                      <p className="font-medium md:text-base text-sm">
                        {chapter.chapterTitle}
                      </p>
                    </div>
                    <p className="text-sm md:text-default">
                      {chapter.chapterContent.length} lecture -{" "}
                      {calculateCourseChapterTime(chapter)}
                    </p>
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openSections[index] ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className="flex items-start gap-2 py-1">
                          <img
                            src={
                             progressData && progressData.lectureCompleted.includes(lecture.lectureId)
                                ? assets.blue_tick_icon
                                : assets.play_icon
                            }
                            alt="play_icon"
                            className="w-4 h-4 mt-1"
                          />
                          <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
                            <p className="text-sm md:text-default">
                              {lecture.lectureTitle}
                            </p>
                            <div className="flex gap-2">
                              {lecture.lectureUrl && (
                                <p
                                  onClick={() =>
                                    setPlayerData({
                                      ...lecture,
                                      chapter: index + 1,
                                      lecture: i + 1,
                                    })
                                  }
                                  className="text-blue-500 underline cursor-pointer"
                                >
                                  Watch
                                </p>
                              )}
                              <p>
                                {humanizeDuration(
                                  lecture.lectureDuration * 60 * 1000,
                                  { units: ["h", "m"] }
                                )}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
          </div>
            <div className="flex items-center gap-2 py-3 mt-10">
            <h1 className="text-xl font-bold">Rate this course:</h1>
            <RatingComponent
              initialRating={initialRating} onRate={handleRating}

            />
          </div>
          {isCourseCompleted && (
  <div className="mt-6">
    <button
     onClick={downloadCertificate}
      className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
    >
      🎓 Download Certificate
    </button>
  </div>
)}

          
         
        </div>
        {/* right column */}
        <div className="md:mt-10">
          {playerData ? (
           <div className="w-full">
  <div className="w-full aspect-video">
    <YouTube
      videoId={playerData.lectureUrl.split("/").pop()}
      className="w-full h-full"
      iframeClassName="w-full h-full"
    opts={{
    playerVars: {
      rel: 0,
      fs: 1,
      autoplay: 0,
    },
  }}

    />
  </div>
  <div className="flex justify-between items-center mt-2">
    <p className="text-sm md:text-base">
      {playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}
    </p>
    <button onClick={()=>markLectureAsCompleted(playerData.lectureId)} className="text-blue-600">
      {progressData && progressData.lectureCompleted.includes(playerData.lectureId) ? "Completed" : "Mark Completed"}
    </button>
  </div>
</div>

          ) : (
            <img 
              src={courseData && courseData.courseThumbnail}
              alt="courseThumbnail"
            />
          )}
        </div>
      </div>
      <Footer />
   </>
  ):<Loading/>
}

export default Player
