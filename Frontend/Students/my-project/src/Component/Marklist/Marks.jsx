import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Marks = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState([]);
  const [formData, setFormData] = useState({
    student: '',
    department: '',
    subjects: [],
  });
  const [editingMarkId, setEditingMarkId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
    fetchMarks();
  }, []);

  
  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:7000/api/v1/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  
  const fetchMarks = async () => {
    try {
      const response = await axios.get('http://localhost:7000/api/v1/marks');
      setMarks(response.data);
    } catch (error) {
      console.error('Error fetching marks:', error);
    }
  };

  
  const fetchDepartmentSubjects = async (departmentId) => {
    try {
      const response = await axios.get(`http://localhost:7000/api/v1/departments/${departmentId}`);
      setSubjects(response.data.subjects);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  
  const handleStudentSelect = (studentId) => {
    const student = students.find((s) => s._id === studentId);
    if (student) {
      setSelectedStudent(student);
      setFormData({
        student: studentId,
        department: student.department._id,
        subjects: [],
      });
      fetchDepartmentSubjects(student.department._id);

      
      const existingMark = marks.find(
        (mark) => mark.student._id === studentId && mark.department._id === student.department._id
      );

      if (existingMark) {
        setFormData({
          ...formData,
          subjects: existingMark.subjects.map(sub => ({
            subject: sub.subject._id,
            mark: sub.mark
          }))
        });
        setEditingMarkId(existingMark._id);
      }
    }
  };

  
  const handleSubjectChange = (subjectId, mark) => {
    if (mark > 100 || mark < 0) {
      alert('Marks should be between 0 and 100');
      return;
    }

    const updatedSubjects = [...formData.subjects];
    const existingIndex = updatedSubjects.findIndex(sub => sub.subject === subjectId);
    
    if (existingIndex !== -1) {
      updatedSubjects[existingIndex].mark = parseInt(mark);
    } else {
      updatedSubjects.push({ subject: subjectId, mark: parseInt(mark) });
    }

    setFormData({ ...formData, subjects: updatedSubjects });
  };

  
  const calculatePercentage = () => {
    const totalMarks = formData.subjects.reduce((sum, sub) => sum + sub.mark, 0);
    const totalSubjects = formData.subjects.length;
    return totalSubjects ? ((totalMarks / (totalSubjects * 100)) * 100).toFixed(2) : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMarkId) {
        await axios.put(`http://localhost:7000/api/v1/marks/${editingMarkId}`, formData);
      } else {
        await axios.post('http://localhost:7000/api/v1/marks', formData);
      }
      setFormData({ student: '', department: '', subjects: [] });
      setSelectedStudent(null);
      setEditingMarkId(null);
      fetchMarks();
    } catch (error) {
      console.error('Error saving marks:', error);
    }
  };

  
  const handleEdit = (mark) => {
    const student = students.find(s => s._id === mark.student._id);
    setSelectedStudent(student);
    setFormData({
      student: mark.student._id,
      department: mark.department._id,
      subjects: mark.subjects.map(sub => ({
        subject: sub.subject._id,
        mark: sub.mark
      }))
    });
    setEditingMarkId(mark._id);
    fetchDepartmentSubjects(mark.department._id);
  };

  
  const handleDelete = async (markId) => {
    if (window.confirm('Are you sure you want to delete?')) {
      try {
        await axios.delete(`http://localhost:7000/api/v1/marks/${markId}`);
        fetchMarks();
      } catch (error) {
        console.error('Error deleting marks:', error);
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Marks Management</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <select
            value={formData.student}
            onChange={(e) => handleStudentSelect(e.target.value)}
            className="p-2 border rounded"
            required
          >
            <option value="">Select a student</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>

        {selectedStudent && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">
              Class: {selectedStudent.department.name}
            </h3>

            <h3 className="font-semibold mb-2">Subjects and Marks</h3>
            {subjects.length === 0 ? (
              <p>No subjects available for the selected Class</p>
            ) : (
              subjects.map((subject) => {
                const existingMark = formData.subjects.find(
                  (sub) => sub.subject === subject._id
                );
                return (
                  <div key={subject._id} className="flex items-center mb-2">
                    <span className="w-1/3">{subject.name}</span>
                    <input
                      type="number"
                      value={existingMark ? existingMark.mark : ''}
                      onChange={(e) => handleSubjectChange(subject._id, e.target.value)}
                      className="p-2 border rounded w-2/3"
                      max="100"
                      required
                    />
                  </div>
                );
              })
            )}

            <p className="mt-2">
              <strong>Percentage:</strong> {calculatePercentage()}%
            </p>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
              {editingMarkId ? 'Update Marks' : 'Add Marks'}
            </button>
          </div>
        )}
      </form>

      <table className="min-w-full table-auto border">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">Student</th>
            <th className="px-4 py-2 border">Class</th>
            <th className="px-4 py-2 border">Subjects & Marks</th>
            <th className="px-4 py-2 border">Percentage</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {marks.map((mark) => (
            <tr key={mark._id} className="border-b">
              <td className="px-4 py-2">{mark.student.name}</td>
              <td className="px-4 py-2">{mark.department.name}</td>
              <td className="px-4 py-2">
                {mark.subjects.map((sub) => (
                  <div key={sub.subject._id}>
                    {sub.subject.name}: {sub.mark}
                  </div>
                ))}
              </td>
              <td className="px-4 py-2">{mark.percentage}%</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleEdit(mark)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(mark._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Marks;
