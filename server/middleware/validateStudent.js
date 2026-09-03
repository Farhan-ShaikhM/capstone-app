const validateStudent = (req, res, next) => {
  const { name, email, branch, marks } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Name is required and must be at least 2 characters"
    });
  }

  if (!branch) {
    return res.status(400).json({
      success: false,
      message: "Branch is required"
    });
  }

  if (marks !== undefined && (marks < 0 || marks > 100)) {
    return res.status(400).json({
      success: false,
      message: "Marks must be between 0 and 100"
    });
  }

  if(email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Email must be a valid email address"
    });
  }

  next();   // all checks passed
};

module.exports = validateStudent;