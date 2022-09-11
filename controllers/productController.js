const Product = require("../models/product");
const Joi = require("joi");
const fs = require("fs");
const formidable = require("formidable");
const _ = require("lodash");
const { listenerCount } = require("process");

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();

  form.keepExtensions = true;
  form.multiples = true;

  form.parse(req, (error, fields, files) => {
    if (error) {
      return res.status(400).json({
        error: "Image could not upload",
      });
    }

    let product = new Product(fields);

    if (files.photo) {
      if (files.photo.size > Math.pow(10, 6)) {
        return res.json({
          error: "Image should be less than 1MB",
        });
      }

      product.photo.data = fs.readFileSync(files.photo.filepath);
      product.photo.contentType = files.photo.mimetype;
    }

    const validationSchema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().min(0).max(2500),
      price: Joi.number().required(),
      quantity: Joi.number().required(),
      category: Joi.required(),
    });

    const validationError = validationSchema.validate(fields);

    if (validationError.error) {
      return res.status(400).json({
        error: validationError.error.details[0].message,
      });
    }

    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Product not created",
        });
      }

      res.json({
        product,
      });
    });
  });
};

exports.getSingleProduct = (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
    if (err || !product) {
      return res.status(404).json({
        error: "Product not found!",
      });
    }

    req.product = product;

    next();
  });
};

exports.showSingleProduct = (req, res) => {
  res.send({
    product: req.product,
  });
};

exports.removeProduct = (req, res) => {
  const product = req.product;

  product.remove((err, product) => {
    if (err) {
      return res.status(400).json({
        error: "Some problems while removing the product",
      });
    }

    res.status(204).json({
      product,
    });
  });
};

exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();

  form.keepExtensions = true;
  form.multiples = true;

  form.parse(req, (error, fields, files) => {
    if (error) {
      return res.status(400).json({
        error: "Image could not upload",
      });
    }

    let product = req.product;

    product = _.extend(product, fields);

    if (files.photo) {
      if (files.photo.size > Math.pow(10, 6)) {
        return res.json({
          error: "Image should be less than 1MB",
        });
      }

      product.photo.data = fs.readFileSync(files.photo.filepath);
      product.photo.contentType = files.photo.mimetype;
    }

    const validationSchema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().min(0).max(2500),
      price: Joi.number().required(),
      quantity: Joi.number().required(),
    });

    const validationError = validationSchema.validate(fields);

    if (validationError.error) {
      return res.status(400).json({
        error: validationError.error.details[0].message,
      });
    }

    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Product not created",
        });
      }

      res.json({
        product,
      });
    });
  });
};

exports.fetchAllProduct = (req, res) => {
  const sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  const order = req.query.order ? req.query.order : "asc";
  const limit = req.query.limit ? req.query.limit : 6;

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((error, products) => {
      if (error) {
        return res.status(404).json({
          error: "Prodyc not founf",
        });
      }

      res.json({
        products,
      });
    });
};

exports.relatedProduct = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Product.find({
    category: req.product.category,
    _id: { $ne: req.product._id },
  })
    .limit(limit)
    .select("-photo")
    .populate("category", "_id name")
    .exec((err, products) => {
      if (err) {
        return res.status(404).json({
          error: "Products not found !",
        });
      }

      res.json({
        products,
      });
    });
};

exports.searchProdcut = (req, res) => {
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let order = req.query.order ? req.query.order : "asc";
  let limit = req.query.limit ? req.query.limit : 6;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      }
    }
  }

  Product.find(findArgs)
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .limit(limit)
    .skip(skip)
    .exec((error, products) => {
      if (error) {
        return res.status(404).json({
          error: "Prodyc not founf",
        });
      }

      res.json({
        products,
      });
    });
};

exports.getProductPhoto = (req, res) => {
  const { data, contentType } = req.product.photo;

  if (data) {
    res.set({ "Content-Type": contentType });

    return res.send(data);
  }
};
