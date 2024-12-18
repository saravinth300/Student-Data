const Subject = require('../models/SubjectModel');


exports.createSubject = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Subject name is required" });
        }

        const subject = new Subject({ name });
        await subject.save();

        res.status(201).json({
            message: "Subject created successfully",
            data: subject,
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating subject", error });
    }
};


exports.getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find();
        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ message: "Error fetching subjects", error });
    }
};


exports.getSubjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const subject = await Subject.findById(id);

        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json({ message: "Error fetching subject", error });
    }
};


exports.updateSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Subject name is required" });
        }

        const subject = await Subject.findByIdAndUpdate(
            id,
            { name },
            { new: true, runValidators: true }
        );

        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        res.status(200).json({
            message: "Subject updated successfully",
            data: subject,
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating subject", error });
    }
};


exports.deleteSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const subject = await Subject.findByIdAndDelete(id);

        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        res.status(200).json({ message: "Subject deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting subject", error });
    }
};
