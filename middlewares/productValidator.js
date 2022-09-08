exports.productValidator = (req, res, next) => {
  req.check("name").notEmpty().withMessage("Name is required !");

  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  next()
  
};
