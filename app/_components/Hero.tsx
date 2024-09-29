// components/Hero.js
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="bg-gray-300 py-32 flex px-4">
      <Image src={"/heroimage.webp"}
      alt='Hero Image'
      width={400}
      height={100}
      />
      <div className="container text-black mx-auto text-center flex flex-col justify-center items-center">
        <h2 className="text-4xl font-bold mb-4 ">Grow Your Knowledge</h2>
        <p className="text-lg mb-6">Explore a wide range of courses to enhance your skills and advance your career.</p>
        <Link href={'/search'}>
            <button className="bg-sky-400 text-white px-4 py-2 rounded-md">Search Courses</button>
        </Link>
      </div>
    </section>
  );
}