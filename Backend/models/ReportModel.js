const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },

  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },

  subjects: [
    {
      subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
      },
      mark: {
        type: Number,
        required: true,
        min: 0,
        max: 100, 
      },
    },
  ],

  totalMarks: {
    type: Number,
    required: true, 
  },

  maxMark: {
    type: Number,
    required: true, 
  },

  minMark: {
    type: Number,
    required: true, 
  },

  percentage: {
    type: Number,
    required: true, 
  },

  grade: {
    type: String,
    required: true,
    enum: ["A+", "A", "B+", "B", "C", "D", "F"], 
  },
});

const Report = mongoose.model("Report", ReportSchema);
module.exports = Report;
