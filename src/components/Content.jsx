import React from 'react'
import { Link } from 'react-router-dom'

const Content = () => {
  return (
    <>
        <div>
      {/* Hero Section */}
      <section className="bg-linear-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Find Your Perfect College
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Read honest reviews from students and make informed decisions
          </p>
          <Link 
            to="/colleges"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Explore Colleges
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600">500+</div>
              <div className="text-gray-600 mt-2">Colleges</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600">10k+</div>
              <div className="text-gray-600 mt-2">Reviews</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600">50k+</div>
              <div className="text-gray-600 mt-2">Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600">100%</div>
              <div className="text-gray-600 mt-2">Verified</div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}

export default Content
