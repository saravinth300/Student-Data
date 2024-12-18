const Student = require('../models/StudentModel'); 
const Department = require('../models/DepartMentModel'); 


const createStudent = async (req, res) => {
    try {
        const { name, rollNumber, department } = req.body;

        
        const existingDepartment = await Department.findById(department);
        if (!existingDepartment) {
            return res.status(404).json({ message: "Department not found" });
        }

        
        const student = new Student({
            name,
            rollNumber,
            department,
        });

        await student.save();
        res.status(201).json({ message: "Student created successfully", student });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().populate('department', 'name'); // Populate department details
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('department', 'name'); // Populate department details

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updateStudent = async (req, res) => {
    try {
        const { name, rollNumber, department } = req.body;

        
        if (department) {
            const existingDepartment = await Department.findById(department);
            if (!existingDepartment) {
                return res.status(404).json({ message: "Department not found" });
            }
        }

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { name, rollNumber, department },
            { new: true } 
        ).populate('department', 'name');

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "Student updated successfully", student });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
};
