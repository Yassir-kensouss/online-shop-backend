const REQUIRED_SIZE = 1024 * 1024 * 2;
const FILE_TYPES = ['image/jpeg','image/png','image/webp','video/mp4'];

/**
 * @name isValidateFile
 * @description Checks if uploaded files valid or not and 
 * returns the error and its type (size,mimetype)
 * @param {*} files 
 * @returns error:Object - isValid:boolean
 */

exports.isValidateFile = (files) => {

    let errors = [];
    let isValid = true;

    files.map(file => {
        const size = file.size;

        if(size > REQUIRED_SIZE){
            const error = {
                type: 'size',
                message: 'File can not be greater than 2MB'
            }

            errors.push(error)
            isValid = false;
        }

        if(!FILE_TYPES.includes(file.mimetype)){
            const error = {
                type: 'mimetype',
                message: 'Invalid file type'
            }

            errors.push(error)
            isValid = false;
        }

    })

    return {errors,isValid}

}