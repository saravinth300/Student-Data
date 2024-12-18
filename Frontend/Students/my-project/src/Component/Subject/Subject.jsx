import React, { useState, useEffect } from "react";
import axios from "axios";

const Subject = () => {
  const [subjects, setSubjects] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [newSubject, setNewSubject] = useState(""); 
  const [editSubject, setEditSubject] = useState(null); 
  const [updatedName, setUpdatedName] = useState(""); 

  
  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get("http://localhost:7000/api/v1/subjects");
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  
  const addSubject = async () => {
    if (!newSubject.trim()) return alert("Subject name cannot be empty!");
    try {
      await axios.post("http://localhost:7000/api/v1/subjects", {
        name: newSubject,
      });
      setNewSubject("");
      fetchSubjects(); 
    } catch (error) {
      console.error("Error adding subject:", error);
    }
  };

  
  const deleteSubject = async (id) => {
    try {
      await axios.delete(`http://localhost:7000/api/v1/subjects/${id}`);
      fetchSubjects(); 
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
  };

  
  const startEdit = (subject) => {
    setEditSubject(subject._id);
    setUpdatedName(subject.name);
  };

  const updateSubject = async () => {
    if (!updatedName.trim()) return alert("Updated name cannot be empty!");
    try {
      await axios.put(`http://localhost:7000/api/v1/subjects/${editSubject}`, {
        name: updatedName,
      });
      setEditSubject(null);
      setUpdatedName("");
      fetchSubjects(); 
    } catch (error) {
      console.error("Error updating subject:", error);
    }
  };

  
  const filteredSubjects = subjects.filter((subject) =>
    (subject?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Subject Management</h1>

      
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          className="p-2 border border-gray-300 rounded"
          placeholder="Add a new subject"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={addSubject}
        >
          Add Subject
        </button>
      </div>

      
      <div className="mb-6">
        <input
          type="text"
          className="p-2 border border-gray-300 rounded w-full"
          placeholder="Search subjects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="text-left p-4">Subject Name</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSubjects.map((subject) => (
            <tr key={subject._id} className="border-b">
              <td className="p-4">
                {editSubject === subject._id ? (
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded"
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                  />
                ) : (
                  subject.name
                )}
              </td>
              <td className="p-4">
                {editSubject === subject._id ? (
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                    onClick={updateSubject}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                    onClick={() => startEdit(subject)}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => deleteSubject(subject._id)}
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

export default Subject;
