const File = require('../models/fileStorage');
const { isValidateFile } = require('../utils/validateFileStorage');

exports.uploadFile = (req, res) => {

    const files = [];

    req.files.map(file => {
        files.push({
            file: file.path
        })
    })

    const {errors, isValid} = isValidateFile(req.files);

    if(errors.length > 0 && !isValid){
        return res.status(400).json({
            errors
        })
    }

    File.insertMany(files,(err,file) => {
        if(err){
            return res.status(400).json({
                error: 'Something went wrong, Please try again'
            })
        }
        res.json({
            file
        })
    })

}