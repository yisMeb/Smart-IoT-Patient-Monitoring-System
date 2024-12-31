import {Link} from "react-router-dom"

export default function NoPage() {
  return (
    <div className="flex items-center min-h-screen px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="w-full space-y-6 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl animate-bounce">404</h1>
          <p className="text-gray-500">Lost in cloud! This page doesn't exist</p>
        </div>
        <Link
          to="/"
          className="inline-flex h-10 items-center rounded-md px-8 text-md font-medium shadow-md bg-black text-white hover:bg-gray-700 transition-all "
        >
          Take Me Home
        </Link>
      </div>
    </div>
  )
}