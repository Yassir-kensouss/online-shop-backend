const User = require("../models/user");
const { cloudinary } = require("../utils/cloudinary");

exports.getOneUser = (req, res) => {
  res.json({
    user: req.profile,
  });
};

exports.fetchAllUsers = async (req,res) => {
  const limit = req.query.limit ? req.query.limit : 10; 
  const page = req.query.page ? req.query.page : 1; 
  const skip = limit * page; 
  const count = await User.countDocuments(); 
  User.find()
  .skip(skip)
  .limit(limit)
  .exec((error, users) => {
    if(error || !users){
      return res.status(400).json({
        message: error
      })
    }

    res.json({
      customers: users,
      count: count
    })
  })
}

exports.deleteCustomer = (req,res) => {

  const _id = req.query.userId

  User.deleteOne({_id: _id}).then((data) => {
    res.json({
      customer: data
    })
  }).catch((err) => {
    
      return res.status(400).json({
        message: err
      })
    
  })

}

exports.updateCustomerStatus = (req, res) => {

  const _id = req.query.userId 

  User.findOneAndUpdate({_id: _id},{
    $set: {
      ...req.body,
      state: req.body.state
    }
  }).then((data) => {
    res.json({
      message: 'Customer state updated successfully'
    })
  }).catch(err => {
    res.status(400).json({
      message: err
    })
  })
}

exports.deleteMultipleCustomers = (req, res) => {
  const ids = req.body;

  User.deleteMany({ _id: ids }, (err, result) => {
    if (err) {
      res.status(400).json({
        message: err,
      });
    } else {
      res.status(200).json({
        message: `You have successfully deleted ${ids?.length} customers`,
        customers: result,
      });
    }
  });
};

exports.searchCustomerByName = async (req, res) => {

  const value = req.query.search;
  const limit = req.query.limit ? req.query.limit : 10;
  const page = req.query.page ? req.query.page : 1;
  const skip = page * limit;
  const matching = new RegExp(value, 'i');
  const count = await User.countDocuments();
  
  User.find({name : {$regex: matching}})
  .skip(skip)
  .limit(limit)
  .exec((err, result) => {

    if(err || !result) {
      return res.status(400).json({
        message: 'Something went wrong'
      })
    }

    res.json({
      customers: result,
      count
    })

  })

}

exports.updateCustomerDetails = (req, res) => {

  if(req.body.avatar && !req.body.avatar.includes('https')){
    const file = req.body.avatar;
    cloudinary.uploader.upload(file, (error, result) => {

      if(error){
        return res.status(400).json({
          message: error
        })
      }

      User.findOneAndUpdate({_id: req.body.id},{$set: {
        avatar: result.secure_url,
        ...req.body
      }},{new: true})
      .then(data => {
        res.json({
          message: "Customer updated successfully",
          customer: data,
        });
      })
      .catch(error => {
        res.status(500).send(error);
      });

    });

  } else {

    User.findOneAndUpdate({_id: req.body.id},{$set: {
      ...req.body
    }},{new: true})
    .then(data => {
      res.json({
        message: "Customer updated successfully",
        customer: data,
      });
    })
    .catch(error => {
      res.status(500).send(error);
    });

  }
}

exports.saveUserHistory = async (userData) => {
  User.findById(userData.userId).exec((error, user) => {
    if (user) {
      User.findOneAndUpdate(
        { _id: userData.userId },
        { $set: { history: [...user.history, userData.userHistory] } }
      )
        .then(data => {
          // console.log("history data", data);
        })
        .catch(error => {
          // console.log("error", error);
        });
    }
  })
};