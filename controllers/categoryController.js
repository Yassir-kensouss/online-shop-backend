const formidable = require("formidable");
const Category = require("../models/category");

exports.createCategory = (req, res) => {
  const category = new Category(req.body);

  category.save((err, category) => {
    if (err) {
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
        error: "Product Not found",
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

exports.updateCategory = (req, res) => {
  let category = req.category;

  category.name = req.body.name;

  category.save((err, category) => {
    if (err) {
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
    if (err) {
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
      _id: ids,
    },
    (err, result) => {
      if (err) {
        res.status(400).json({
          error: err
        });
      } else {
        res.json({
          result
        });
      }
    }
  );
};


exports.fetchAllCategories = (req, res) => {
  const perPage = 2;
  const page = Math.max(0,req.query.page);
  console.log('page', page)
  Category.find()
  .limit(perPage)
  .skip(perPage * page)
  .exec((err, categories) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }
    res.json({
      categories,
    });
  });
};

// Post multiple categories
exports.postMultipleCategories = (req,res) => {

  Category.insertMany(req.body,(err,cats) => {
    if(err){
      return res.status(400).json({
        error: err
      })
    }

    res.json({
      categories: cats,
    })
  })
}
