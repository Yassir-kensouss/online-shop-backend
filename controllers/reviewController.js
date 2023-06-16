const Joi = require("joi");
const Review = require("../models/review");

exports.addProductReview = (req, res) => {
  const validationSchema = Joi.object({
    review: Joi.string().required(),
    rating: Joi.number().required(),
    productId: Joi.string().required(),
    userId: Joi.string().required(),
    username: Joi.string().required(),
  });

  const validationError = validationSchema.validate(req.body);

  if (validationError.error) {
    return res.status(400).json({
      error: validationError.error.details[0].message,
    });
  }

  const review = new Review(req.body);

  review.save((error, reviews) => {
    if (error || !reviews) {
      return res.status(400).json({
        error: error,
      });
    }

    return res.json({
      reviews,
    });
  });
};

exports.fetchReviews = (req, res) => {
  const productId = req.params.productId;

  Review.find({ productId: productId }).exec((error, reviews) => {
    if (error || !reviews) {
      return res.status(400).json({
        error: error,
      });
    }

    return res.json({
      reviews,
    });
  });
};
