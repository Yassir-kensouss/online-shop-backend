const Category = require("../models/category");

exports.createCategory = (req, res) => {
  const category = new Category(req.body);

  category.save((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Bad request !",
      });
    }

    res.send({category})
  });
};

exports.getCategory = (req,res,next,id) => {

    Category.findById(id).exec((err, category) => {

        if(err || !category){
            return res.status(404).json({
                error: 'Product Not found'
            })
        }

        req.category = category;

        next()

    })

}

exports.getSingleCategory = (req,res) => {

  res.send({
    category: req.category
  })

}

exports.updateCategory = (req,res) => {

  let category = req.category;

  category.name = req.body.name;

  category.save((err,category) => {

    if(err) {
      return res.status(400).json({
        error: 'Bad request'
      })
    }

    res.json({
      category
    })

  })

}

exports.deleteCategory = (req,res) => {
  let category = req.category;

  category.remove((err, category) => {

    if(err){
      return res.status(404).json({
        error: 'Category not found'
      })
    }

    res.status(204).json({
      category
    })

  })
}

exports.fetchAllCategories = (req,res) => {

  Category.find().exec((err,categories) => {

    if(err){
      return res.status(500).json({
        error: err
      })
    }

    res.json({
      categories
    })

  })

}