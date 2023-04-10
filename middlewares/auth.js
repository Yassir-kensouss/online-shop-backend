const expressJwt = require('express-jwt')
require('dotenv').config()

exports.requireSignIn = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: 'auth'
})

exports.isAuth = (req,res,next) => {

    let user = req.profile && req.auth && (req.profile._id == req.auth._id)

    if(req.auth.role == 1){
        return next()
    }

    if(!user){
        return res.status(403).json({
            error: 'Access Denied'
        })
    }

    next()
}

exports.isAdmin = (req,res, next) => {

    if(req.auth.role == 0){
        res.status(403).json({
            error: 'Admin resource, access denied'
        })
    }

    next()

}