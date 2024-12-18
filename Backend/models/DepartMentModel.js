const mongoose = require('mongoose');


const DepartmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
    },
  
    subjects: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Subject', 
    }]
});


const Department = mongoose.model("Department", DepartmentSchema);

module.exports = Department;
