import React, { useState, useEffect } from "react";
import axios from "axios";

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({ name: "", subjectIds: [] });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const apiUrl = "http://localhost:7000/api/v1/departments";
  const subjectApiUrl = "http://localhost:7000/api/v1/subjects";

  
  const fetchDepartments = async () => {
    try {
      const response = await axios.get(apiUrl);
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  
  const fetchSubjects = async () => {
    try {
      const response = await axios.get(subjectApiUrl);
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await axios.put(`${apiUrl}/${editId}`, formData);
        setIsEditing(false);
        setEditId(null);
      } else {
        await axios.post(apiUrl, formData);
      }

      setFormData({ name: "", subjectIds: [] });
      fetchDepartments();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      fetchDepartments();
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };


  const handleEdit = (department) => {
    setFormData({ name: department.name, subjectIds: department.subjects.map((sub) => sub._id) });
    setIsEditing(true);
    setEditId(department._id);
  };

  
  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  
  useEffect(() => {
    fetchDepartments();
    fetchSubjects();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Department Management</h1>

      
      <form onSubmit={handleFormSubmit} className="mb-6 bg-white p-4 shadow rounded">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Class Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Subjects</label>
          <select
            multiple
            className="w-full p-2 border rounded"
            value={formData.subjectIds}
            onChange={(e) =>
              setFormData({
                ...formData,
                subjectIds: Array.from(e.target.selectedOptions, (option) => option.value),
              })
            }
          >
            {subjects.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {isEditing ? "Update Class" : "Add Class"}
        </button>
      </form>

      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Class"
          className="w-full p-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      
      <table className="w-full bg-white shadow rounded overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="text-left p-4">Class Name</th>
            <th className="text-left p-4">Subjects</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDepartments.map((department) => (
            <tr key={department._id} className="border-b">
              <td className="p-4">{department.name}</td>
              <td className="p-4">
                {department.subjects.map((sub) => sub.name).join(", ")}
              </td>
              <td className="p-4">
                <button
                  onClick={() => handleEdit(department)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(department._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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

export default Department;
