import React, { useEffect, useState } from 'react'
import { request } from '../utils/api'

const CollegeDetail = ({ id }) => {
  const [college, setCollege] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    request(`/api/colleges/${id}`)
      .then((data) => {
        if (!mounted) return
        setCollege(data)
      })
      .catch((err) => {
        console.error(err)
        if (mounted) setError(err.message || 'Failed to load college')
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [id])

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-600">{error}</div>
  if (!college) return <div>College not found.</div>

  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-2">{college.name}</h2>
      {college.location && <p className="text-gray-600 mb-2">{college.location}</p>}
      {college.rating !== undefined && <p className="mb-4">Rating: {college.rating} ⭐</p>}
      {college.description && <div className="prose">
        <p>{college.description}</p>
      </div>}
    </div>
  )
}

export default CollegeDetail
