exports.signUpValidaor = (req, res, next) => {
  req.check("name").notEmpty().withMessage("Name is required !");
  req.check("email").normalizeEmail().isEmail().withMessage("Email not valid");
  req
    .check("password")
    .notEmpty()
    .isLength({ min: 6, max: 10 })
    .withMessage("Password must between 6 and 10 chars");

  const errors = req.validationErrors();

  if(errors){
    return res.status(400).send(errors)
  }

  next()
};
