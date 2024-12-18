const mongoose = require('mongoose');


const MarkSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Student',
        required: true, 
    },
    department: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Department',
        required: true, 
    },
    subjects: [{
        subject: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Subject',
            required: true, 
        },
        mark: {
            type: Number, 
            required: true,
            min: 0, 
            max: 100, 
        },
    }],
    percentage: {
        type: Number, 
        required: true,
    }
});


const Mark = mongoose.model("Mark", MarkSchema);

module.exports = Mark;
