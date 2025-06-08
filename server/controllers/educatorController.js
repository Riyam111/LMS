import {clerkClient} from '@clerk/express'
import Course from '../models/Course.js'
import {v2 as cloudinary} from 'cloudinary'
import Purchases from '../models/Purchase.js'
import User from '../models/User.js'
// update a user's role to "educator" 
export const updateRoleToEducator=async(req,res)=>{
    try {
        const userId=req.auth.userId
        await clerkClient.users.updateUserMetadata(userId,{
            publicMetadata:{
                role:'educator',
            }
        })
        res.json({success:true,message:'you can publish a course '})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}
//adding new course
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file; // using with multer middleware use diskStorage
    const educatorId = req.auth.userId;


    if (!imageFile) {
      return res.json({ success: false, message: "Course image is required" });
    }

    const parsedCourseData = await JSON.parse(courseData);
    parsedCourseData.educator = educatorId;
 const newCourse=   await Course.create(parsedCourseData)
 const imageUpload=  await cloudinary.uploader.upload(imageFile.path)
 newCourse.courseThumbnail=imageUpload.secure_url
 await newCourse.save()
  res.json({ success: true, message: 'Course created successfully' });
}
 catch(error)  {
        res.json({ success: false, message: error.message });
      }
    }
    //get educator courses
    export const getEducatorCourses=async(req,res)=>{
      try {
        const educator=req.auth.userId
        const courses=await Course.find({educator})
        res.json({success:true,courses})
      } catch (error) {
       res.json({success:false,message:error.message}) 
      }
    }
    //get educator dashboard data
    export const getEducatorDashboardData = async (req, res) => {
  try {
    const educator= req.auth.userId;

    const courses = await Course.find({ educator });

    const courseIds = courses.map((course) => course._id);

    // calculate total earning from purchased courses
    const purchases= await Purchases.find({
      courseId: { $in: courseIds },
      status: "completed",
    });

    const totalEarnings = purchases.reduce((sum, purchase) => {
      return sum + purchase.amount;
    }, 0);

    const totalCourses = courses.length;

    // collect unique all enrolled students Ids with their course title
    const enrolledStudentsData = [];
    for (const course of courses) {
      const students = await User.find(
        { _id: { $in: course.enrolledStudents } },
        "name imageUrl"
      );
      students.forEach((student) => {
        enrolledStudentsData.push({ student, courseTitle: course.courseTitle });
      });
    }

    

    res.json({
      success: true,
      dashboardData: {
        totalEarnings,
        totalCourses,
        enrolledStudentsData,
       
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch dashboard data" });
  }
}
//get enrolled data of student with purchase data
export const getEnrolledStudentsData = async (req, res) => {
  try {
    const educator = req.auth.userId;
   
    

    const courses = await Course.find({ educator });

    const courseIds = courses.map((course) => course._id);

    // get all purchased courses
    const purchases = await Purchases.find({
      courseId: { $in: courseIds },
      status: "completed",
    }).populate("userId", "name imageUrl").populate("courseId", "courseTitle");

    const enrolledStudents = purchases.map(purchase => (
       {
        student: purchase.userId,
        courseTitle: purchase.courseId.courseTitle,
        purchaseDate: purchase.createdAt,
      })
    );

    res.json({
      success: true,
      enrolledStudents,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch enrolled students data" });
  }
};

