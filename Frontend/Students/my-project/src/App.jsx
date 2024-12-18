import React from 'react'
import Student from './Component/Student/Student'
import Subject from './Component/Subject/Subject'
import Department from './Component/Department/Department'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Navbar from './Component/Navbar/Navbar'
import Marks from './Component/Marklist/Marks'
import Reports from './Reports/Reports'


const App = () => {
  return (
    <>
    <BrowserRouter>
    <Navbar />

    <Routes>

      <Route path="/" element={<Student />} />
      <Route path="/department" element={<Department />} />
      <Route path="/Subject" element={<Subject />} />
      <Route path="/marks" element={<Marks />} />
      <Route path='/reports' element={<Reports /> } />
      
    </Routes>
    
    </BrowserRouter>
    
    </>
  )
}

export default App
