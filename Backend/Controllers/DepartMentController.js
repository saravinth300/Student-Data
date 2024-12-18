const Department = require('../models/DepartMentModel');
const Subject = require('../models/SubjectModel'); 


const createDepartment = async (req, res) => {
    try {
        const { name, subjectIds } = req.body; 

        const department = new Department({
            name,
            subjects: subjectIds, 
        });

        await department.save();
        res.status(201).json({ message: "Department created successfully", department });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find().populate('subjects');
        res.status(200).json(departments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getDepartmentById = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id).populate('subjects'); 

        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }

        res.status(200).json(department);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updateDepartment = async (req, res) => {
    try {
        const { name, subjectIds } = req.body;

        const department = await Department.findByIdAndUpdate(
            req.params.id,
            { name, subjects: subjectIds }, 
            { new: true } 
        ).populate('subjects');

        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }

        res.status(200).json({ message: "Department updated successfully", department });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findByIdAndDelete(req.params.id);

        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }

        res.status(200).json({ message: "Department deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
};
