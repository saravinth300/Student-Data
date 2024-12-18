const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');


const subjects = require('./routes/subject');
const departments = require('./routes/department');
const students = require('./routes/student');
const marks = require('./routes/marks');
const reports = require('./routes/report'); 

dotenv.config();


app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);


app.use(bodyParser.json());


app.use("/api/v1/subjects", subjects);
app.use('/api/v1/departments', departments);
app.use('/api/v1/students', students);
app.use('/api/v1/marks', marks);
app.use('/api/v1/reports', reports); 


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`DB connected successfully. Listening on ${process.env.PORT || 9000}`);
    });
  })
  .catch((error) => console.log(error));
