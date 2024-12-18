const Report = require("../models/ReportModel");


exports.createReport = async (req, res) => {
  try {
    const { student, department, subjects } = req.body;

    
    const totalMarks = subjects.reduce((sum, sub) => sum + sub.mark, 0);
    const maxMark = Math.max(...subjects.map((sub) => sub.mark));
    const minMark = Math.min(...subjects.map((sub) => sub.mark));
    const percentage = (totalMarks / (subjects.length * 100)) * 100;

    
    let grade = "F";
    if (percentage >= 90) grade = "A+";
    else if (percentage >= 80) grade = "A";
    else if (percentage >= 70) grade = "B+";
    else if (percentage >= 60) grade = "B";
    else if (percentage >= 50) grade = "C";
    else if (percentage >= 40) grade = "D";

    
    const report = new Report({
      student,
      department,
      subjects,
      totalMarks,
      maxMark,
      minMark,
      percentage,
      grade,
    });

    const savedReport = await report.save();
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(500).json({ message: "Error creating report", error });
  }
};


exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("student", "name")
      .populate("department", "name")
      .populate("subjects.subject", "name");

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports", error });
  }
};


exports.getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id)
      .populate("student", "name")
      .populate("department", "name")
      .populate("subjects.subject", "name");

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: "Error fetching report", error });
  }
};


exports.updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { student, department, subjects } = req.body;

    
    const totalMarks = subjects.reduce((sum, sub) => sum + sub.mark, 0);
    const maxMark = Math.max(...subjects.map((sub) => sub.mark));
    const minMark = Math.min(...subjects.map((sub) => sub.mark));
    const percentage = (totalMarks / (subjects.length * 100)) * 100;

    let grade = "F";
    if (percentage >= 90) grade = "A+";
    else if (percentage >= 80) grade = "A";
    else if (percentage >= 70) grade = "B+";
    else if (percentage >= 60) grade = "B";
    else if (percentage >= 50) grade = "C";
    else if (percentage >= 40) grade = "D";

    const updatedReport = await Report.findByIdAndUpdate(
      id,
      {
        student,
        department,
        subjects,
        totalMarks,
        maxMark,
        minMark,
        percentage,
        grade,
      },
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json(updatedReport);
  } catch (error) {
    res.status(500).json({ message: "Error updating report", error });
  }
};


exports.deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReport = await Report.findByIdAndDelete(id);

    if (!deletedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting report", error });
  }
};


exports.aggregateReports = async (req, res) => {
  try {
    const aggregation = await Report.aggregate([
      {
        $group: {
          _id: "$department",
          totalStudents: { $sum: 1 },
          averagePercentage: { $avg: "$percentage" },
          highestPercentage: { $max: "$percentage" },
          lowestPercentage: { $min: "$percentage" },
        },
      },
      {
        $lookup: {
          from: "departments",
          localField: "_id",
          foreignField: "_id",
          as: "departmentDetails",
        },
      },
    ]);

    res.status(200).json(aggregation);
  } catch (error) {
    res.status(500).json({ message: "Error aggregating reports", error });
  }
};
