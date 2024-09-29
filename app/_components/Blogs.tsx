import BlogCard from "./BlogCard";

// components/RecentBlogs.js
export default function RecentBlogs() {
  const blogs = [
    {
      title: 'Learning New Skills',
      image: '/b1.png',
    },
    // ... other blogs
  ];

  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center mb-8">Recent Blogs</h2>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {blogs.map((blog) => (
          <BlogCard key={blog.title} blog={blog} />
        ))}
      </div>
    </section>
  );
}