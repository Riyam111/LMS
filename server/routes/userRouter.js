import express from 'express'
import { addUserRating, getUSerCourseProgress, getUserData, purchaseCourse, updateUserCourseProgress, userEnrolledCourses } from '../controllers/UserController.js'
const userRouter=express.Router()
userRouter.get('/data',getUserData)
userRouter.get('/enrolled-courses',userEnrolledCourses)
userRouter.post('/purchase',purchaseCourse)
userRouter.post('/update-course-progress',updateUserCourseProgress)
userRouter.post('/get-course-progress',getUSerCourseProgress)
userRouter.post('/add-rating',addUserRating)
export default userRouter;