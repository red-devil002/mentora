// components/Courses.js

import { CoursesList } from "@/components/CoursesList";
import CourseCard from "./CoursesCard";
import { getCourses } from "@/actions/getCourses";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";


interface SeachPageProps {
    searchParams: {
      title: string;
      categoryId: string;
    }
  }

export default async function Courses({searchParams}: SeachPageProps) {
    const { userId } = auth()
  
    if (!userId) {
      return redirect("/")
    }
  
    const courses = await getCourses({
        userId,
        ...searchParams
      })
    

  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center mb-8">Our Courses</h2>
      <div className="ml-5 mr-5">
        <CoursesList 
          items = {courses}
        />
      </div>
    </section>
  );
}