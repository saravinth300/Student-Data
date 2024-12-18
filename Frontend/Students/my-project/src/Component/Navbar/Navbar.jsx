import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 shadow-lg w-screen ">
    <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
      <h1 className="text-white text-2xl font-bold mb-4 sm:mb-0">CRUD</h1>
      <ul className="flex flex-wrap justify-center space-x-4 sm:space-x-6">
        <li>
          <Link to="/" className="text-white hover:text-gray-300 transition duration-300">Student</Link>
        </li>
        <li>
          <Link to="/department" className="text-white hover:text-gray-300 transition duration-300">Department</Link>
        </li>
        <li>
          <Link to="/subject" className="text-white hover:text-gray-300 transition duration-300">Subject</Link>
        </li>
        <li>
          <Link to="/marks" className="text-white hover:text-gray-300 transition duration-300" >Marks</Link>
        </li>
        <li>
          <Link to="/reports" className='text-white hover:text-gray-300 transition duration-300' >Reports</Link>
        </li>
        
      </ul>
    </div>
  </nav>
  )
}

export default Navbar
