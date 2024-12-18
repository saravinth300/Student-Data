const express = require("express");
const {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport,
  aggregateReports,
} = require("../Controllers/ReportController");

const router = express.Router();


router.post("/", createReport);
router.get("/", getAllReports);
router.get("/:id", getReportById);
router.put("/:id", updateReport);
router.delete("/:id", deleteReport);


router.get("/aggregate", aggregateReports);

module.exports = router;
