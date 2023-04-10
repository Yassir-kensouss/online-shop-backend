const Category = require("../models/category");

exports.categoryValidator = (req, res, next) => {
  
    Category.findOne({name: new RegExp('^'+ req.body.name +'$', "i")}, (err,cat) => {

        if(cat){
            // console.log('category exist', cat)
            res.status(400).json({
                error: 'exists'
            })
        }

        next()

    })

};
