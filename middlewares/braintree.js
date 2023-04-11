exports.verifyProductStock = (req, res, next) => {

  let inStock = true;

  req.body.products.map(product => {
    if (product.quantity <= 0) {
      inStock = false;
    }
  });

  if (!inStock) {
    return res.status(400).json({
      error: `Sorry product is out of stock`,
    });
  }

  next()

};
