const validateRequest = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: "Validation Error",
      errors: error.errors,
    });
  }
};

export default validateRequest;
