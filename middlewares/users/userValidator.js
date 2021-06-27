const { check, validationResult } = require('express-validator')
const createError = require('http-errors')
const User = require('../../models/People')
const path = require('path')
const { unlink } = require('fs')

const addUserValidators = [
    check('name')
        .isLength({ min: 3 }).withMessage('Name Is Required')
        .isAlpha('en-US', { ignore: ' -' }).withMessage('Name must be only Char')
        .trim()
    ,
    check('email')
        .isEmail().withMessage('Invalid email address')
        .trim()
        .custom(async (value) => {
            try {
                const user = await User.findOne({ email: value });
                if (user) {
                    throw createError('Email already isused')
                }
            } catch (err) {
                throw createError(err.message)
            }
        })
    ,
    check('mobile')
        .isMobilePhone('bn-BD', {
            strictMode: true
        }).withMessage('Mobile must be a valid Bangladeshi mobile number')
        .custom(async (value) => {
            try {
                const mobile = await User.findOne({ mobile: value });
                if (mobile) {
                    throw createError('Mobile Number already is used!')
                }
            } catch (err) {
                throw createError(err.message)
            }
        })
    ,
    check('password')
        .isStrongPassword().withMessage('Password must be 8 char long and should contain 1 lowercase, 1 uppercase, 1 number and 1 symbol')
    ,

];

const addUserValidationHandler = (req, res, next) => {
    const errors = validationResult(req)
    const mappedErrors = errors.mapped()

    /*
    mappedErrors = {
        name: {

        },
        email: {

        }
    }
    */

    if (Object.keys(mappedErrors).length === 0) {
        next()
    } else {
        //remove upload files
        if (req.files.length > 0) {
            const { filename } = req.files[0]
            unlink(path.join(__dirname, `/../public/uploads/avatars/${filename}`), (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
        res.status(500).json({
            errors: mappedErrors
        })
    }
}

module.exports = {
    addUserValidators,
    addUserValidationHandler
}