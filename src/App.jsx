import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Content from './components/Content'
import CollegesList from './components/CollegesList'
import CollegeDetail from './components/CollegeDetail'
import { AuthProvider } from './context/AuthContext'
import CollegePage from './components/Collegepage'
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import RequireAuth from './components/RequireAuth'

function HomePage() {
  return (
    <>
      <Content />
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Popular Colleges</h2>
        <CollegesList limit={3} />
      </section>
    </>
  )
}

function CollegesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Colleges</h1>
      <CollegesList />
    </div>
  )
}

function CollegeDetailPage() {
  const { id } = useParams()
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">College Details</h1>
      <div>
        {/* College details will be fetched in the component below */}
        <CollegeDetail id={id} />
      </div>
    </div>
  )
}

function ReviewFormPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CollegePage />
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/colleges" element={<CollegesPage />} />
            <Route path="/college/:id" element={<CollegeDetailPage />} />
            <Route path="/write-review" element={<RequireAuth><ReviewFormPage /></RequireAuth>} />
            <Route path="/write-review/:collegeId" element={<RequireAuth><ReviewFormPage /></RequireAuth>} />
          </Routes>
        </main>

        <Footer />
      </div>
      </AuthProvider>
    </Router>
  )
}

export default App;