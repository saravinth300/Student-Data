import React, { useState, useEffect } from "react";
import axios from "axios";

const Student = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    department: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingStudentId, setEditingStudentId] = useState(null);

  
  useEffect(() => {
    fetchStudents();
    fetchDepartments();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:7000/api/v1/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error.message);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:7000/api/v1/departments"
      );
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error.message);
    }
  };

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingStudentId) {
      
      try {
        const response = await axios.put(
          `http://localhost:7000/api/v1/students/${editingStudentId}`,
          formData
        );
        console.log("Updated:", response.data);
        fetchStudents();
        setEditingStudentId(null);
        setFormData({ name: "", rollNumber: "", department: "" });
      } catch (error) {
        console.error("Error updating student:", error.message);
      }
    } else {
      
      try {
        const response = await axios.post(
          "http://localhost:7000/api/v1/students",
          formData
        );
        console.log("Added:", response.data);
        fetchStudents();
        setFormData({ name: "", rollNumber: "", department: "" });
      } catch (error) {
        console.error("Error adding student:", error.message);
      }
    }
  };

  
  const handleEdit = (student) => {
    setEditingStudentId(student._id);
    setFormData({
      name: student.name,
      rollNumber: student.rollNumber,
      department: student.department?._id || "",
    });
  };

  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:7000/api/v1/students/${id}`);
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error.message);
    }
  };

  
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Management</h1>

      
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div className="flex flex-col">
          <label className="font-medium">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded p-2"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-medium">Roll Number:</label>
          <input
            type="text"
            name="rollNumber"
            value={formData.rollNumber}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded p-2"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-medium">Class:</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded p-2"
          >
            <option value="">Select Class</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white rounded px-4 py-2"
        >
          {editingStudentId ? "Update Student" : "Add Student"}
        </button>
      </form>

      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full"
        />
      </div>

    
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border border-gray-300">Name</th>
            <th className="p-2 border border-gray-300">Roll Number</th>
            <th className="p-2 border border-gray-300">Class Name</th>
            <th className="p-2 border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student._id} className="text-center">
              <td className="p-2 border border-gray-300">{student.name}</td>
              <td className="p-2 border border-gray-300">{student.rollNumber}</td>
              <td className="p-2 border border-gray-300">
                {student.department?.name || "N/A"}
              </td>
              <td className="p-2 border border-gray-300">
                <button
                  onClick={() => handleEdit(student)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(student._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
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

export default Student;
