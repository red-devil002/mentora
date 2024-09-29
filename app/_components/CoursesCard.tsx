// components/CourseCard.js
import Image from 'next/image';

export default function CourseCard({ course }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <Image src={course.image} alt={course.title} width={200} height={150} className="rounded-lg mb-4" />
      <h3 className="text-lg font-bold mb-2">{course.title}</h3>
      <p className="text-gray-700">{course.description}</p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2">Enroll Now</button>
    </div>
  );
}