const mongoose = require('mongoose');


const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
    },
    rollNumber: {
        type: String,
        required: true, 
        unique: true,   
    },
    department: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Department', 
        required: true,    
    },

});

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;
