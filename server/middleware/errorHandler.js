const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error("💥", err);   // full detail for the developer

  // Bad ObjectId
  if (err.name === "CastError") {
    error.message = `Resource not found with id ${err.value}`;
    error.statusCode = 404;
  }

  // Mongoose validation failed
  if (err.name === "ValidationError") {
    error.message = Object.values(err.errors)
      .map(val => val.message)
      .join(", ");
    error.statusCode = 400;
  }

  // Duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error.message = `Duplicate value for field: ${field}`;
    error.statusCode = 400;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Server Error"
  });
};

module.exports = errorHandler;