const Cart = require("../models/cart");

exports.createNewCart = (req, res) => {
  const cart = new Cart(req.body);

  cart.save((err, cart) => {
    if (err) {
      return res.status(400).json({
        message: "Something went wrong, please try again",
      });
    }

    return res.json({
      cart,
    });
  });
};

exports.deleteCart = (req, res) => {
  const cartId = req.params.cartId;

  Cart.findByIdAndDelete(cartId).exec((error, cart) => {
    if (error || !cart) {
      return res.status(400).json({
        message: "Unable to delete this cart, please try again",
      });
    }

    return res.json({
      cart,
    });
  });
};
