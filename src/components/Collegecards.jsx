import React from 'react'
import { Link } from 'react-router-dom'

const CollegeCard = ({ college }) => {
    if (!college) return null

    return (
        <div className="border rounded-lg shadow-md p-4 w-full max-w-sm">
            {college.image && (
                <img src={college.image} alt={college.name} className="w-full h-40 object-cover rounded" />
            )}

            <h2 className="text-xl font-semibold mt-3">{college.name}</h2>
            {college.location && <p className="text-gray-600">{college.location}</p>}
            <p className="text-black font-semibold">{(college.rating || 0).toFixed(1)} ⭐</p>

            <Link to={`/college/${college._id}`} className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                View Details
            </Link>
        </div>
    )
}

export default CollegeCard
