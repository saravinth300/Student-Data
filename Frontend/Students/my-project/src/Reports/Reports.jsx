import React, { useState, useEffect } from "react";

const Reports = () => {
  
  const [reports, setReports] = useState([]);
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  
  const [currentReport, setCurrentReport] = useState({
    student: "",
    department: "",
    subjects: [],
    totalMarks: 0,
    maxMark: 0,
    minMark: 0,
    percentage: 0,
    grade: ""
  });

  
  const API_BASE = "http://localhost:7000/api/v1";

  
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const responses = await Promise.all([
        fetch(`${API_BASE}/reports`),
        fetch(`${API_BASE}/students`),
        fetch(`${API_BASE}/departments`),
        fetch(`${API_BASE}/subjects`)
      ]);

      const [reportsData, studentsData, departmentsData, subjectsData] = 
        await Promise.all(responses.map(r => r.json()));

      setReports(reportsData);
      setStudents(studentsData);
      setDepartments(departmentsData);
      setSubjects(subjectsData);
    } catch (err) {
      setError("data get error");
    } finally {
      setLoading(false);
    }
  };

  
  const calculateMarks = (subjectMarks) => {
    const marks = subjectMarks.map(s => s.mark);
    return {
      totalMarks: marks.reduce((a, b) => a + b, 0),
      maxMark: Math.max(...marks),
      minMark: Math.min(...marks),
      percentage: (marks.reduce((a, b) => a + b, 0) / (marks.length * 100)) * 100
    };
  };

  
  const calculateGrade = (percentage) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";
    return "F";
  };

  
  const createReport = async (data) => {
    try {
      const response = await fetch(`${API_BASE}/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error("create errror");
      
      await fetchAllData();
      setShowForm(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateReport = async (id, data) => {
    try {
      const response = await fetch(`${API_BASE}/reports/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error("data update error");
      
      await fetchAllData();
      setShowForm(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteReport = async (id) => {
    if (!window.confirm("delete error")) return;
    
    try {
      const response = await fetch(`${API_BASE}/reports/${id}`, {
        method: "DELETE"
      });
      
      if (!response.ok) throw new Error("data delete error");
      
      await fetchAllData();
    } catch (err) {
      setError(err.message);
    }
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const markCalculations = calculateMarks(currentReport.subjects);
    const formData = {
      ...currentReport,
      ...markCalculations,
      grade: calculateGrade(markCalculations.percentage)
    };
    
    if (isEditing) {
      updateReport(currentReport._id, formData);
    } else {
      createReport(formData);
    }
  };

  const handleSubjectMarkChange = (subjectId, mark) => {
    const newSubjects = currentReport.subjects.map(s => 
      s.subject === subjectId ? { ...s, mark: Number(mark) } : s
    );
    
    if (!newSubjects.find(s => s.subject === subjectId)) {
      newSubjects.push({ subject: subjectId, mark: Number(mark) });
    }
    
    setCurrentReport({ ...currentReport, subjects: newSubjects });
  };

  const resetForm = () => {
    setCurrentReport({
      student: "",
      department: "",
      subjects: [],
      totalMarks: 0,
      maxMark: 0,
      minMark: 0,
      percentage: 0,
      grade: ""
    });
    setIsEditing(false);
  };

  const handleEdit = (report) => {
    setCurrentReport(report);
    setIsEditing(true);
    setShowForm(true);
  };

  
  const filteredReports = reports.filter(report => {
    const searchTerm = search.toLowerCase();
    return (
      report.student?.name?.toLowerCase().includes(searchTerm) ||
      report.department?.name?.toLowerCase().includes(searchTerm)
    );
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  if (loading) return <div className="p-4">sucess...</div>;
  if (error) return <div className="p-4 text-red-500">error: {error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Student Report Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showForm ? "delete" : "new data"}
        </button>
      </div>

      
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded bg-white shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2">Student:</label>
              <select
                value={currentReport.student}
                onChange={(e) => setCurrentReport({...currentReport, student: e.target.value})}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Student Select</option>
                {students.map(student => (
                  <option key={student._id} value={student._id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2">:</label>
              <select
                value={currentReport.department}
                onChange={(e) => setCurrentReport({...currentReport, department: e.target.value})}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Class Selecte</option>
                {departments.map(dept => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Subjects And Marks:</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {subjects.map(subject => (
                <div key={subject._id}>
                  <label className="block mb-1">{subject.name}</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={currentReport.subjects.find(s => s.subject === subject._id)?.mark || ""}
                    onChange={(e) => handleSubjectMarkChange(subject._id, e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            {isEditing ? "new" : "save"}
          </button>
        </form>
      )}

      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full md:w-1/3 p-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border shadow-sm rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              <th className="border p-3 text-left">Student</th>
              <th className="border p-3 text-left">Class</th>
              <th className="border p-3 text-center">Total Mark</th>
              <th className="border p-3 text-center">Max Mark</th>
              <th className="border p-3 text-center">Min Mark</th>
              <th className="border p-3 text-center">Percentage</th>
              <th className="border p-3 text-center">Grad</th>
              <th className="border p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <tr key={report._id} className="hover:bg-gray-50">
                  <td className="border p-3">{report.student?.name}</td>
                  <td className="border p-3">{report.department?.name}</td>
                  <td className="border p-3 text-center">{report.totalMarks}</td>
                  <td className="border p-3 text-center">{report.maxMark}</td>
                  <td className="border p-3 text-center">{report.minMark}</td>
                  <td className="border p-3 text-center">{report.percentage.toFixed(2)}%</td>
                  <td className="border p-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      report.grade === 'A+' || report.grade === 'A' 
                        ? 'bg-green-100 text-green-800'
                        : report.grade === 'B+' || report.grade === 'B'
                        ? 'bg-blue-100 text-blue-800'
                        : report.grade === 'C'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {report.grade}
                    </span>
                  </td>
                  <td className="border p-3 text-center">
                    <button
                      onClick={() => handleEdit(report)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteReport(report._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="border p-4 text-center text-gray-500">
                  data not found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;