require("dotenv").config();
const connectDB = require("./config/db");
const Student = require("./models/student");

const seedData = [
  { name: "Pranit Supe", email: "pranit@college.edu", branch: "CSE", marks: 88, subjects: ["DSA", "DBMS"] },
  { name: "Priya Bhosale",   email: "priya@college.edu",  branch: "IT",   marks: 92, subjects: ["Web Dev", "OS"] },
  { name: "Anish Imade",  email: "anish@college.edu", branch: "CSE",  marks: 75, subjects: ["DSA"] },
  { name: "Hitesh Zambre", email: "hitesh@college.edu", branch: "ENTC", marks: 81, subjects: ["Signals"] }
];

const importData = async () => {
  try {
    await connectDB();
    await Student.deleteMany();        // clear existing records
    await Student.insertMany(seedData);
    console.log("✅ Data imported successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Import failed:", error.message);
    process.exit(1);
  }
};

importData();