const express = require('express');
const router = express.Router();
const {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
} = require('../Controllers/StudentController'); 


router.post('/', createStudent);


router.get('/', getAllStudents);


router.get('/:id', getStudentById);


router.put('/:id', updateStudent);


router.delete('/:id', deleteStudent);

module.exports = router;
