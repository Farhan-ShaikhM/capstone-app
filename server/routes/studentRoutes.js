const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

const {
  getStudents, getStudent, createStudent, updateStudent, deleteStudent
} = require("../controllers/studentController");

router
  .route("/")
  .get(getStudents)                                  // public: anyone can browse
  .post(protect, createStudent);                     // must be logged in

router
  .route("/:id")
  .get(getStudent)                                   // public
  .put(protect, updateStudent)                       // must be logged in
  .delete(protect, authorize("admin"), deleteStudent); // admins only

module.exports = router;