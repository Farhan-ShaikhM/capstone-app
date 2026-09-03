const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a student name"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"]
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true
    },
    branch: {
      type: String,
      required: true,
      enum: {
        values: ["CSE", "IT", "ENTC", "MECH", "CIVIL"],
        message: "{VALUE} is not a valid branch"
      }
    },
    marks: {
      type: Number,
      default: 0,
      min: [0, "Marks cannot be negative"],
      max: [100, "Marks cannot exceed 100"]
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true   // auto-adds createdAt and updatedAt
  }
);

// "Student" (singular, capitalised) → collection becomes "students"
const Student = mongoose.model("Student", studentSchema);

module.exports = Student;