import React, { useContext } from 'react'
import {assets} from '../../assets/assets'
import { Link,useLocation } from 'react-router-dom'
import { useClerk,useUser,UserButton} from '@clerk/clerk-react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
const Navbar = () => {
  const {navigate,isEducator,backendUrl,setEducator,getToken}=useContext(AppContext)
  const location=useLocation();
  const isCourseListPage=location.pathname.includes('/course-list');
  const {openSignIn}=useClerk()
const {user}=useUser()

const becomeEducator=async()=>{
  try {
    if(isEducator){
      navigate('/educator')
      return
    }
    const token=await getToken()
    const {data}=await axios.get(backendUrl+'/api/educator/update-role',
      {headers:{Authorization:`Bearer ${token}`}}
    )
 if(data.success){
  setEducator(true)
  toast.success(data.message)
 }
 else{
  toast.error(data.message)
 }
  } catch (error) {
     toast.error(error.message)
  }
}
  return (
    <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${isCourseListPage?'bg-white':'bg-cyan-100/70'}`}>
      <div 
  onClick={() => navigate('/')} 
  className="flex items-center gap-2 sm:gap-3 cursor-pointer"
>
  <img 
    src={assets.favicon} 
    alt="Learnova Logo" 
    className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 object-contain" 
  />
  <h1 className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-400 drop-shadow-sm">
    Learnova
  </h1>
</div>



    <div className='hidden md:flex items-center gap-5 text-gray-500'>
      <div className='flex items-center gap-5'>
        {user && <>
          <button onClick={becomeEducator}>{isEducator?'Educator Dashboard':'Become Educator'}</button>
        |<Link to='/my-enrollments'>My Enrollment</Link>
      </>}
      </div>
      {user?<UserButton/>:
        <button onClick={()=>openSignIn()} className='bg-blue-600 text-white px-5 py-2 rounded-full'>Create Account</button>}
    </div>
    <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
      <div className='flex items-center gap-1 sm:gap-2 max-sm:text-xs'>
      {user && <>
          <button onClick={becomeEducator}>{isEducator?'Educator Dashboard':'Become Educator'}</button>
        |<Link to='/my-enrollments'>My Enrollment</Link>
      </>}
        </div>
        {
          user?<UserButton/>:
           <button onClick={()=>openSignIn()}><img src={assets.user_icon} alt='user icon'/></button>
    
        }
       
    </div>
    </div>
  )
}

export default Navbar
