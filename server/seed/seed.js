import dotenv from "dotenv";
import mongoose from "mongoose";
import Job from "../src/models/Job.js";

dotenv.config();

const jobs = [
  {
    title: "Backend Developer",
    company: "Google",
    location: "Bangalore",
    salary: "20 LPA",
    jobType: "Full-Time",
    experience: "2 Years",
    description: "Node.js Backend Developer",
    skills: ["Node.js", "Express", "MongoDB"],
    postedBy: "System",
  },
  {
    title: "Frontend Developer",
    company: "Microsoft",
    location: "Hyderabad",
    salary: "18 LPA",
    jobType: "Full-Time",
    experience: "1 Year",
    description: "React Developer",
    skills: ["React", "JavaScript", "Tailwind CSS"],
    postedBy: "System",
  },
  {
    title: "MERN Stack Intern",
    company: "Amazon",
    location: "Noida",
    salary: "8 LPA",
    jobType: "Internship",
    experience: "Fresher",
    description: "Internship for MERN Developers",
    skills: ["React", "Node.js", "MongoDB"],
    postedBy: "System",
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await Job.deleteMany();

    await Job.insertMany(jobs);

    console.log(" Sample jobs inserted");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedDatabase();