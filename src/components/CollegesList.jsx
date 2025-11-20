import React, { useEffect, useState } from 'react'
import CollegeCard from './Collegecards'
import { request } from '../utils/api'

const CollegesList = ({ limit }) => {
  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    request('/api/colleges')
      .then((data) => {
        if (!mounted) return
        setColleges(limit ? data.slice(0, limit) : data)
      })
      .catch((err) => {
        console.error(err)
        if (mounted) setError(err.message || 'Failed to load colleges')
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [limit])

  if (loading) return <div>Loading colleges...</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {colleges.map((c) => (
        <div key={c._id} className="flex justify-center">
          <CollegeCard college={c} />
        </div>
      ))}
    </div>
  )
}

export default CollegesList
