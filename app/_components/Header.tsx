import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-100 p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold">MENTORA</h1>
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/courses">Courses</Link>
          </li>
          <li>
            <Link href="/blog">Blog</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}