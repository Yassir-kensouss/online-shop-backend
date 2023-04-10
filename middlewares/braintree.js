exports.verifyProductStock = (req, res, next) => {
  
  req.body.products.map(product => {
    if(product.quantity <= 0) {
        return res.status(400).json({
          error: `Sorry ${product.name} is out of stock`,
        });
    }
  });

  next()

};
