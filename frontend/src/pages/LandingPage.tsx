import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold text-gray-900 mb-4">
        AI Virtual Try-On
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-md text-center">
        Upload a photo of yourself and a clothing item to see how it looks on you — powered by AI.
      </p>
      <Link
        to="/upload"
        className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Get Started
      </Link>
    </div>
  )
}
