const Student = require("../models/Student");

// @desc    Get all students
// @route   GET /api/students
// @access  Public
const getStudents = async (req, res, next) => {
  try {
    const query = {};

    // GET /api/students?branch=CSE
    if (req.query.branch) {
      query.branch = req.query.branch;
    }

    // GET /api/students?minMarks=80
    if (req.query.minMarks) {
      query.marks = { $gte: Number(req.query.minMarks) };
    }

    // GET /api/students?search=aarav
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: "i" };  // i = case-insensitive
    }

    // Pagination: ?page=2&limit=10
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Sorting: ?sort=-marks  (minus = descending)
    const sortBy = req.query.sort || "-createdAt";

    const students = await Student.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    const total = await Student.countDocuments(query);

    res.status(200).json({
      success: true,
      count: students.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: students
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Public
const getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `No student found with id ${req.params.id}`
      });
    }

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);     // hand it to errorHandler
  }
};

// @desc    Create new student
// @route   POST /api/students
// @access  Public
const createStudent = async (req, res, next) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Public
const updateStudent = async (req, res, next) => {
  try {
    let student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Only the owner or an admin may update
    if (
      student.user &&
      student.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this record"
      });
    }

    student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Public
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `No student found with id ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      data: {}
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent
};