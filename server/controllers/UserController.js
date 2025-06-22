import Course from "../models/Course.js"
import { courseProgress } from "../models/CourseProgress.js";
import Purchases from "../models/Purchase.js"
import User from "../models/User.js"
import Stripe from "stripe";
import generateCertificatePDF from "../utils/GenerateCertificate.js";
export const getUserData=async(req,res)=>{
    try {
     
        const userId=  req.auth.userId
        const user=await User.findById(userId)
        if(!user){
            return res.json({success:false,message:'user not found'})

        }
        res.json({success:true,user})
    } catch (error) {
      res.json({success:false,message:error.message
        
      })  
    }
}
//user enrolled course with lecture link
export const userEnrolledCourses=async(req,res)=>{
    try {
        const userId= req.auth.userId
        const userData=await User.findById(userId).populate('enrolledCourses')
    res.json({success:true,enrolledCourses:userData.enrolledCourses})
    } catch (error) {
      res.json({success:false,message:error.message
        
      })    
    }
}
//stripe payment controlller function  purchase course
export const purchaseCourse=async(req,res)=>{
  try {
    const {courseId}=req.body
    const {origin}=req.headers
    const userId=req.auth.userId
    const userData=await User.findById(userId)
    const courseData=await Course.findById(courseId)
    if(!userData || !courseData){
        return res.json({success:false,message:'Data not found'})
    }
const purchaseData={
    courseId:courseData._id,
    userId,
    amount:(courseData.coursePrice-courseData.discount*
        courseData.coursePrice/100
    ).toFixed(2),
}
//storing purchase data in mongodb
const newPurchase=await Purchases.create(purchaseData)
//stripe gatway initilize
const stripeInstance=new Stripe(process.env.STRIPE_SECRET_KEY)
const currency=process.env.CURRENCY.toLowerCase()
const line_items=[{
    price_data:{
        currency,
        product_data:{
            name:courseData.courseTitle
        },
        unit_amount:Math.floor(newPurchase.amount)*100
    },
    quantity:1
}]
const session=await stripeInstance.checkout.sessions.create({
    success_url:`${origin}/loading/my-enrollments`,
    cancel_url:`${origin}/`,
    line_items:line_items,
    mode:'payment',
    metadata:{
        purchaseId:newPurchase._id.toString()
    }

  })
  res.json({success:true,session_url:session.url})
  } catch (error) {
    res.json({success:false,message:error.message});
  }  

}

//update user course progress
export const updateUserCourseProgress=async(req,res)=>{
    try {
        const userId=req.auth.userId
        const {courseId,lectureId}=req.body
        const progressData=await courseProgress.findOne({userId,courseId})
    if(progressData){
        if(progressData.lectureCompleted.includes(lectureId)){
            return res.json({success:true,message:'lecture already completed'})
        }
       progressData.lectureCompleted.push(lectureId)
       await progressData.save() 
    }
    else{
        await courseProgress.create({
           userId,
           courseId,
           lectureCompleted:[lectureId] 
        })
    }
    res.json({success:true,message:'Progress Updated'})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

//get user course progress
export const getUSerCourseProgress=async(req,res)=>{
    try {
         const userId=req.auth.userId
        const {courseId}=req.body
        const progressData=await courseProgress.findOne({userId,courseId})
    res.json({success:true,progressData})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}
//add user rating to course
export const addUserRating=async(req,res)=>{
    const userId=req.auth.userId
    const {courseId,rating}=req.body
    if(!courseId||!userId||rating<1||rating>5){
     return res.json({success:false,message:'Invalid Details'}) ;  
    }
    try {
        const course=await Course.findById(courseId)
        if(!course){
            return res.json({success:false,message:'Course not found'})
        }
        const user=await User.findById(userId);
        if(!user||!user.enrolledCourses.includes(courseId)){
            return res.json({success:false,message:'USer has not purchased this course'})
        }
        const existingRatingIndex=course.courseRatings.findIndex(r=>r.userId===userId)
    if(existingRatingIndex>-1){
        course.courseRatings[existingRatingIndex].rating=rating;
    }
    else{
        course.courseRatings.push({userId,rating});
    }
    await course.save();
     return res.json({success:true,message:'Rating added'})
    } catch (error) {
      return res.json({success:false,message:error.message})  
    }
}
//adding genrate certificate function 
export const generateCertificate = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId } = req.body;

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);
    const progress = await courseProgress.findOne({ userId, courseId });

    if (!user || !course) {
      return res.status(404).json({ success: false, message: 'User or Course not found' });
    }

    if (!user.enrolledCourses.includes(courseId)) {
      return res.status(403).json({ success: false, message: 'You are not enrolled in this course' });
    }

    const totalLectures = course.courseContent.reduce(
      (acc, chapter) => acc + chapter.chapterContent.length,
      0
    );

    if (!progress || progress.lectureCompleted.length < totalLectures) {
      return res.status(400).json({ success: false, message: 'Course not completed yet' });
    }

    const pdfBuffer = await generateCertificatePDF({
      studentName: user.name,
      courseTitle: course.courseTitle,
      date: new Date().toLocaleDateString(),
    });

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${course.courseTitle}_Certificate.pdf"`,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

