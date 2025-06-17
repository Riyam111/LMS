import React, { useContext, useEffect, useState } from "react";
import { dummyStudentEnrolled } from "../../assets/assets";

import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import axios from "axios";
import { toast } from "react-toastify";


const StudentsEnrolled = () => {
  const {backendUrl,getToken,isEducator}=useContext(AppContext)
  const [enrolledStudents, setEnrolledStudents] = useState();

  

  const fetchEnrolledStudents = async () => {
   try {
    const token=await getToken()
    const {data}=await axios.get(backendUrl+'/api/educator/enrolled-student',
      {headers:{Authorization:`Bearer ${token}`}})
      if(data.success){
        setEnrolledStudents(data.enrolledStudents.reverse())
      }
      else{
        toast.error(data.message)
      }
   } catch (error) {
     toast.error(error.message)
   }
    
  };

  useEffect(() => {
    isEducator && fetchEnrolledStudents();
  }, [isEducator]);

  return enrolledStudents ? (
    <div className="h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="w-full">
        <h2 className="pb-4 text-lg font-medium">Student Enrolled</h2>
        <div>
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 border-b border-r-gray-500/20 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate hidden sm:table-cell">
                  #
                </th>
                <th className="px-4 py-3 font-semibold truncate">
                  Student Name
                </th>
                <th className="px-4 py-3 font-semibold truncate">
                  Course Title
                </th>
                <th className="px-4 py-3 font-semibold truncate hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {enrolledStudents.map((item, index) => (
                <tr key={index} className="border-b border-gray-500/20">
                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    {++index}
                  </td>
                  <td className="md:px-4 pl-2 md:pl-3 py-3 flex items-center space-x-3">
                    <img
                      src={item.student.imageUrl}
                      alt="item Image"
                      className="w-9 h-9 rounded-full"
                    />
                    <span className="truncate">{item.student.name}</span>
                  </td>
                  <td className="px-4 py-3 truncate">{item.courseTitle}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                     {console.log(item.purchaseDate)}
                    {new Date(item.purchaseDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default StudentsEnrolled;