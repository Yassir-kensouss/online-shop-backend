const formidable = require("formidable");
const Category = require("../models/category");
const Product = require("../models/product");
const { cloudinary } = require("../utils/cloudinary");

exports.createCategory = async (req, res) => {
  let result = null;

  if (req.body.image) {
    const file = req.body.image;
    result = await cloudinary.uploader.upload(file, {
      crop: "fill",
      width: 350, // set your desired width here
      height: 350, // set your desired height here
      gravity: "center",
      format: "jpg",
      quality: "auto",
      secure: true,
      cropMode: "limit",
    });
  }

  const category = new Category({
    ...req.body,
    image: result ? result.secure_url : null,
  });

  category.save((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Bad request !",
      });
    }

    res.send({ category });
  });
};

exports.getCategory = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err || !category) {
      return res.status(404).json({
        error: "Category Not found",
      });
    }

    req.category = category;

    next();
  });
};

exports.getSingleCategory = (req, res) => {
  res.send({
    category: req.category,
  });
};

exports.updateCategory = async (req, res) => {
  let category = req.category;

  let result = null;

  if (!req.body.image.includes("https")) {
    const file = req.body.image;
    result = await cloudinary.uploader.upload(file, {
      crop: "fill",
      width: 350, // set your desired width here
      height: 350, // set your desired height here
      gravity: "center",
      format: "jpg",
      quality: "auto",
      secure: true,
      cropMode: "limit",
    });

    req.body.image = result.secure_url;
  }

  category.name = req.body.name;
  category.image = req.body.image;

  category.save((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Bad request",
      });
    }

    res.json({
      category,
    });
  });
};

// Delete a single category

exports.deleteCategory = (req, res) => {
  let category = req.category;

  category.remove((err, category) => {
    if (err || !category) {
      return res.status(404).json({
        error: "Category not found",
      });
    }

    res.status(204).json({
      category,
    });
  });
};

// Delete multiple categories

exports.deleteMultiCategories = (req, res) => {
  const ids = req.body.ids;

  Category.deleteMany(
    {
      _id: { $in: ids },
    },
    (err, result) => {
      if (err) {
        res.status(400).json({
          error: err,
        });
      } else {
        res.json({
          result,
        });
      }
    }
  );
};

exports.fetchAllCategories = async (req, res) => {
  const limit = req.query.limit ? req.query.limit : 10;
  const page = req.query.page ? req.query.page : 1;
  const skip = limit * page;

  const productGroup = await Product.aggregate([
    { $unwind: "$categories" },
    {
      $group: {
        _id: "$categories",
        count: { $sum: 1 },
      },
    },
  ]);

  Category.countDocuments({}, (err, count) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    } else {
      Category.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: "desc" })
        .exec((err, categories) => {
          const categoriesCount = categories.map(category => {
            const count =
              productGroup.find(
                el => el._id.name.toString() === category.name.toString()
              )?.count || 0;
            return {
              ...category.toObject(),
              linkedProduct: count,
            };
          });

          if (err || !categories) {
            return res.status(400).json({
              error: err,
            });
          }
          res.json({
            categories: categoriesCount,
            count: count,
          });
        });
    }
  });
};

// Post multiple categories
exports.postMultipleCategories = (req, res) => {
  Category.insertMany(req.body, (err, cats) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    res.json({
      categories: cats,
    });
  });
};

// Search category

exports.searchCategory = async (req, res) => {
  const limit = req.query.limit ? req.query.limit : 10;
  const page = req.query.page ? req.query.page : 1;
  const skip = limit * page;
  const searchValue = req.query.searchValue;
  const matching = new RegExp(searchValue, "i");

  const count = await Category.countDocuments({ name: { $regex: matching } });

  Category.find({ name: { $regex: matching } }).exec((err, categories) => {
    if (err || !categories) {
      res.status(400).json({
        error: "Categories not found",
      });
    }

    res.json({
      categories,
      count,
    });
  });
};

exports.fetchCategories = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err || !categories) {
      res.status(400).json({
        error: "Categories not found",
      });
    }

    res.json({
      categories,
    });
  });
};
