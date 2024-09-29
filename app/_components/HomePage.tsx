// pages/index.js

import RecentBlogs from "./Blogs";
import Courses from "./Courses";
import Footer from "./Footer";
import Header from "./Header";
import Hero from "./Hero";
import JoinUs from "./JoinUs";


export default function HomePage() {
  return (
    <div>
      {/* <Header /> */}
      <Hero />
      <Courses />
      <RecentBlogs />
      <JoinUs />
      <Footer />
    </div>
  );
}