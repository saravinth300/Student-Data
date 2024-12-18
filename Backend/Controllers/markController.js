const Mark = require('../models/MarkModel');


const getMarks = async (req, res) => {
  try {
    const marks = await Mark.find()
      .populate('student', 'name')
      .populate('department', 'name')
      .populate('subjects.subject', 'name');
    res.status(200).json(marks);
  } catch (error) {
    console.error("Error fetching marks:", error.message);
    res.status(500).json({ message: 'Error fetching marks', error: error.message });
  }
};


const getMarkById = async (req, res) => {
  try {
    const mark = await Mark.findById(req.params.id)
      .populate('student', 'name')
      .populate('department', 'name')
      .populate('subjects.subject', 'name');
    if (!mark) {
      return res.status(404).json({ message: 'Mark not found' });
    }
    res.status(200).json(mark);
  } catch (error) {
    console.error("Error fetching mark:", error.message);
    res.status(500).json({ message: 'Error fetching mark', error: error.message });
  }
};


const createMark = async (req, res) => {
  try {
    const { student, department, subjects } = req.body;
    if (!student || !department || !subjects || !Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ message: 'Invalid input fields' });
    }

    
    for (const subject of subjects) {
      if (!subject.subject || typeof subject.mark !== 'number' || subject.mark < 0 || subject.mark > 100) {
        return res.status(400).json({ message: 'Invalid subject data' });
      }
    }

    const totalMarks = subjects.reduce((sum, subject) => sum + subject.mark, 0);
    const percentage = ((totalMarks / (subjects.length * 100)) * 100).toFixed(2);

    const newMark = new Mark({
      student,
      department,
      subjects,
      percentage,
    });

    await newMark.save();
    res.status(201).json({ message: 'Mark added successfully', newMark });
  } catch (error) {
    console.error("Error adding mark:", error.message);
    res.status(500).json({ message: 'Error adding mark', error: error.message });
  }
};


const updateMark = async (req, res) => {
  try {
    const { student, department, subjects } = req.body;
    if (!student || !department || !subjects || !Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ message: 'Invalid input fields' });
    }

    for (const subject of subjects) {
      if (!subject.subject || typeof subject.mark !== 'number' || subject.mark < 0 || subject.mark > 100) {
        return res.status(400).json({ message: 'Invalid subject data' });
      }
    }

    const totalMarks = subjects.reduce((sum, subject) => sum + subject.mark, 0);
    const percentage = ((totalMarks / (subjects.length * 100)) * 100).toFixed(2);

    const updatedMark = await Mark.findByIdAndUpdate(
      req.params.id,
      { student, department, subjects, percentage },
      { new: true }
    );

    if (!updatedMark) {
      return res.status(404).json({ message: 'Mark not found' });
    }

    res.status(200).json({ message: 'Mark updated successfully', updatedMark });
  } catch (error) {
    console.error("Error updating mark:", error.message);
    res.status(500).json({ message: 'Error updating mark', error: error.message });
  }
};


const deleteMark = async (req, res) => {
  try {
    const deletedMark = await Mark.findByIdAndDelete(req.params.id);
    if (!deletedMark) {
      return res.status(404).json({ message: 'Mark not found' });
    }
    res.status(200).json({ message: 'Mark deleted successfully' });
  } catch (error) {
    console.error("Error deleting mark:", error.message);
    res.status(500).json({ message: 'Error deleting mark', error: error.message });
  }
};

module.exports = {
  getMarks,
  getMarkById,
  createMark,
  updateMark,
  deleteMark,
};
