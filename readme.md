# Learnova - Learning Management System(LMS)

A full-stack LMS (Learning Management System) web application built with the MERN stack. It allows users to browse, purchase, and access online courses. Admins can manage courses, chapters, and video lectures.
# Learnova - Learning Management System (LMS)

A full-stack LMS (Learning Management System) web application built with the MERN stack. It allows users to browse, purchase, and access online courses. Admins can manage courses, chapters, and video lectures.

🌐 **Live Demo**: [Click here to view](https://lms-frontend-hazel-seven.vercel.app/)


## 🚀 Tech Stack

- **Frontend:** React.js + Vite
- **Backend:** Node.js + Express.js
- **Authentication:** Clerk
- **Payments:** Stripe
- **Database:** MongoDB
- **Editor:** Quill.js (for rich-text lecture content)

## ✨ Features

### User Side:
- User signup/login using Clerk authentication
- Browse and view course details
- Secure Stripe integration for purchasing courses
- Access to purchased courses with structured chapters and video lectures

### Admin Side:
- Create and manage courses
- Add chapters and rich-text lectures
- View enrolled users
- Manage course content


## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Riyam111/LMS.git
cd LMS


###Run the Frontend
cd client
npm install
npm run dev
###Run the Backend
cd server
npm install
npm run server
