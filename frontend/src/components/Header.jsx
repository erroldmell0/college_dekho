import React from 'react'
import "tailwindcss";
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Header = () => {
    const auth = useAuth()
    return (
        <>
            {/* Header */}
            <header className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-800">College Dekho</h1>
                    </Link>
                                        <nav className="flex gap-6 items-center">
                                        <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium">Home</Link>
                                        <Link to="/colleges" className="text-gray-600 hover:text-blue-600 font-medium">Colleges</Link>
                                        <Link to="/write-review" className="text-gray-600 hover:text-blue-600 font-medium">Write Review</Link>
                                        <div className="ml-4 flex items-center gap-3">
                                                                                        {/** show login/signup when not authenticated, otherwise show name + logout */}
                                                                                        {!auth.loading && auth.user ? (
                                                                                            <>
                                                                                                <span className="text-gray-700">Hi, {auth.user.name}</span>
                                                                                                <button onClick={auth.logout} className="bg-gray-200 text-gray-800 px-3 py-1 rounded">Logout</button>
                                                                                            </>
                                                                                        ) : (
                                                                                            <>
                                                                                                <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
                                                                                                <Link to="/signup" className="bg-blue-600 text-white px-3 py-1 rounded">Sign up</Link>
                                                                                            </>
                                                                                        )}
                                        </div>
                                        </nav>
                </div>
                </div>
            </header>
        </>
  )
}

export default Header
