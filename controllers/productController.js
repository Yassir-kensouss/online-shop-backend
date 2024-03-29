const Product = require("../models/product");
const Joi = require("joi");
const _ = require("lodash");
const { cloudinary } = require("../utils/cloudinary");
const { redisClient } = require("./redis");

exports.createProduct = async (req, res) => {
  const validationSchema = Joi.object({
    name: Joi.string().max(200).required(),
    description: Joi.string().min(0).max(100000).allow(null),
    shortDescription: Joi.string().min(0).max(1000).required(),
    price: Joi.number().max(1000000).required(),
    oldPrice: Joi.number().allow(null),
    tags: Joi.array().items(Joi.string()),
    sku: Joi.string().max(30).allow(null),
    quantity: Joi.number().max(500000).required(),
    visibility: Joi.string().allow(null),
    category: Joi.object(),
    brand: Joi.object(),
    files: Joi.required(),
    variants: Joi.object(),
  });

  const validationError = validationSchema.validate(req.body);

  if (validationError.error) {
    return res.status(400).json({
      error: validationError.error.details[0].message,
    });
  }

  try {
    const pictureFiles = req.body.files;
    if (!pictureFiles) {
      return res.status(400).json({
        message: "No files attached",
      });
    }

    let multiplePicturesPromise = pictureFiles.map(picture => {
      return cloudinary.uploader.upload(picture);
    });

    let imagesResponse = await Promise.all(multiplePicturesPromise);
    let formateRes = [];

    imagesResponse.map(response => {
      formateRes = [
        ...formateRes,
        {
          url: response.secure_url,
          mediaType: response.resource_type,
          size: response.bytes,
          width: response.width,
          height: response.height,
          format: response.format,
        },
      ];
    });

    let product = new Product({
      ...req.body,
      photos: formateRes,
    });

    product.save((err, item) => {
      if (err) {
        res.status(400).json({
          error: err,
        });
        return;
      }

      res.status(200).json({
        product: item,
      });
      return;
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong, Please try again",
    });
  }
};

exports.duplicateProduct = (req, res) => {
  let product = new Product(req.body);

  product.save((err, item) => {
    if (err) {
      res.status(400).json({
        error: err,
      });
      return;
    }

    res.status(200).json({
      message: "Product Duplicated",
      product: item,
    });
    return;
  });
};

exports.scheduleProduct = async (req, res) => {
  // const {product} = req.body;

  const taskData = {
    taskType: "sms",
    details: {
      to: "Boss",
      message: "Still working :)",
    },
  };

  const scheduleProduct = await redisClient.zAdd("schedule", {
    score: 1,
    value: "value",
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

    res.status(200).json({
      product,
      message: "You have successfully deleted the product",
    });
  });
};

exports.deleteMultipleProducts = (req, res) => {
  const ids = req.body;

  Product.deleteMany({ _id: ids }, (err, result) => {
    if (err) {
      res.status(400).json({
        message: err,
      });
    } else {
      res.status(200).json({
        message: `You have successfully deleted ${ids?.length} products`,
        products: result,
      });
    }
  });
};

exports.updateProduct = async (req, res) => {
  const validationSchema = Joi.object({
    _id: Joi.string(),
    name: Joi.string().max(200).required(),
    description: Joi.string().min(0).max(100000).allow(null),
    shortDescription: Joi.string().min(0).max(1000).required(),
    price: Joi.number().max(1000000).required(),
    oldPrice: Joi.number().allow(null),
    tags: Joi.array().items(Joi.string()),
    sku: Joi.string().max(30).allow(null),
    quantity: Joi.number().max(500000).required(),
    visibility: Joi.string().allow(null),
    category: Joi.object(),
    brand: Joi.object(),
    photos: Joi.array().required(),
    variants: Joi.object().required(),
  });

  const validationError = validationSchema.validate(req.body);

  if (validationError.error) {
    return res.status(400).json({
      error: validationError.error.details[0].message,
    });
  }

  const newPhotos = req.body.photos.filter(el => el.url.includes("data"));
  const oldPhotos = req.body.photos.filter(el => el.url.includes("https"));

  if (
    req.body.photos.length > 0 &&
    newPhotos.length > 0 &&
    oldPhotos.length > 0
  ) {
    try {
      let multiplePicturesPromise = newPhotos.map(picture => {
        return cloudinary.uploader.upload(picture.url);
      });

      let imagesResponse = await Promise.all(multiplePicturesPromise);
      let formateRes = [];

      imagesResponse.map(response => {
        formateRes = [
          ...formateRes,
          {
            url: response.secure_url,
            mediaType: response.resource_type,
            size: response.bytes,
            width: response.width,
            height: response.height,
            format: response.format,
          },
        ];
      });

      Product.findOneAndUpdate(
        { _id: req.body._id },
        {
          $set: {
            ...req.body,
            photos: [...formateRes, ...oldPhotos],
          },
        },
        { new: true }
      )
        .then(data => {
          res.json({
            message: "Product updated successfully",
            product: data,
          });
        })
        .catch(error => {
          res.status(500).send(error);
        });
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong, Please try again",
      });
    }
  } else if (newPhotos.length > 0 && oldPhotos.length === 0) {
    try {
      const pictureFiles = req.body.photos;

      let multiplePicturesPromise = pictureFiles.map(picture => {
        return cloudinary.uploader.upload(picture.url);
      });

      let imagesResponse = await Promise.all(multiplePicturesPromise);
      let formateRes = [];

      imagesResponse.map(response => {
        formateRes = [
          ...formateRes,
          {
            url: response.secure_url,
            mediaType: response.resource_type,
            size: response.bytes,
            width: response.width,
            height: response.height,
            format: response.format,
          },
        ];
      });

      Product.findOneAndUpdate(
        { _id: req.body._id },
        {
          $set: {
            ...req.body,
            photos: formateRes,
          },
        },
        { new: true }
      )
        .then(data => {
          res.json({
            message: "Product updated successfully",
            product: data,
          });
        })
        .catch(error => {
          res.status(500).send(error);
        });
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    if (req.body.photos?.length === 0 || !req.body.photos) {
      return res.status(404).send("At least add one photo for the product");
    }

    Product.findOneAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          ...req.body,
        },
      },
      { new: true }
    )
      .then(data => {
        res.json({
          message: "Product updated successfully",
          product: data,
        });
      })
      .catch(error => {
        res.status(500).send(error);
      });
  }
};

exports.fetchAllProduct = async (req, res) => {
  const limit = req.query.limit ? req.query.limit : 10;
  const page = req.query.page ? req.query.page : 1;
  const total = await Product.countDocuments();
  const skip = page * limit;

  Product.find()
    .skip(skip)
    .limit(limit)
    .exec((error, products) => {
      if (error || !products) {
        return res.status(404).json({
          error: error,
        });
      }

      res.json({
        products,
        total,
      });
    });
};

exports.bestSellingProducts = async (req, res) => {
  const limit = req.query.limit ? req.query.limit : 10;
  const page = req.query.page ? req.query.page : 1;
  const skip = page * limit;
  const filters = {};
  req.query.price
    ? (filters["price"] = {
        $gte: req.query.price.split("-")[0],
        $lte: req.query.price.split("-")[1],
      })
    : null;
  const total = await Product.countDocuments(filters);

  Product.find(filters)
    .sort("-sold")
    .skip(skip)
    .limit(limit)
    .exec((error, products) => {
      if (error || !products) {
        return res.status(404).json({
          error: error,
        });
      }

      res.json({
        products,
        total,
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
      if (err || !products) {
        return res.status(404).json({
          error: "Products not found !",
        });
      }

      res.json({
        products,
      });
    });
};

exports.searchProduct = (req, res) => {
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
      if (error || !products) {
        return res.status(404).json({
          error: "Prodyc not founD",
        });
      }

      res.json({
        products,
      });
    });
};

exports.searchProductByName = async (req, res) => {
  const value = req.query.search;
  const limit = req.query.limit ? req.query.limit : 10;
  const page = req.query.page ? req.query.page : 1;
  const skip = page * limit;
  const matching = new RegExp(value, "i");
  const total = await Product.countDocuments({ name: value });

  Product.find({ name: { $regex: matching } })
    .skip(skip)
    .limit(limit)
    .exec((err, products) => {
      if (err || !products) {
        return res.status(400).json({
          message: "Something went wrong",
        });
      }

      res.json({
        products: products,
        total: total,
      });
    });
};

exports.mostUsedCategories = (req, res) => {
  Product.aggregate(
    [
      { $unwind: "$categories" },
      { $group: { _id: "$categories.name", totalSold: { $sum: "$sold" } } },
      { $sort: { totalSold: -1 } },
    ],
    (err, result) => {
      if (err) {
        return res.status(400).json({
          message: "Something went wrong",
        });
      }

      res.json({
        statistics: result,
      });
    }
  );
};

exports.getProductsByFilter = async (req, res) => {
  const limit = req.query.limit ? req.query.limit : 10;
  const page = req.query.page ? req.query.page : 0;
  const skip = page * limit;
  const sort = req.body.sort ? req.body.sort.code : "asc";

  let query = {};

  if (req.body.category?.length > 0) {
    query["category.name"] = { $in: req.body.category };
  }

  if (req.body.brand?.length > 0) {
    query["brand.name"] = { $in: req.body.brand };
  }

  if (req.body.size?.length > 0) {
    query["size.name"] = { $in: req.body.size };
  }

  if (req.body.price.maxPrice > 0) {
    query["price"] = {
      $gte: req.body.price.minPrice,
      $lte: req.body.price.maxPrice,
    };
  }

  if (req.body.search && req.body.search !== "") {
    const matching = new RegExp(req.body.search, "i");
    query["name"] = { $regex: matching };
  }

  const total = await Product.countDocuments(query);

  Product.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: sort })
    .exec((err, products) => {
      if (err || !products) {
        return res.status(400).json({
          error: "Product not found",
        });
      }

      res.json({
        products,
        total,
      });
    });
};
