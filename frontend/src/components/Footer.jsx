import React from 'react'

const Footer = () => {
  return (
    <>
        {/* Footer */}
        <footer className="bg-gray-800 text-white mt-20">
            <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                <h3 className="text-lg font-bold mb-4">College Dekho</h3>
                <p className="text-gray-400">Your trusted platform for honest college reviews and information.</p>
                </div>
                <div>
                <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white">About Us</a></li>
                    <li><a href="#" className="hover:text-white">Contact</a></li>
                    <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                </ul>
                </div>
                <div>
                <h3 className="text-lg font-bold mb-4">Contact</h3>
                <p className="text-gray-400">Email: info@collegedekho.com</p>
                <p className="text-gray-400">Phone: +91 1234567890</p>
                </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2025 College Dekho. All rights reserved.</p>
            </div>
            </div>
        </footer>
    </>
  )
}

export default Footer
