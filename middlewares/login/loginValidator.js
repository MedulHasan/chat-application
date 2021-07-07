const { check, validationResult } = require('express-validator')

const doLoginValidator = [
    check('username')
        .notEmpty().withMessage('Email or Mobile must be Required')
    ,
    check('password')
        .notEmpty().withMessage('Password is Required')
];

const doLoginValidationHandler = (req, res, next) => {
    let errors = validationResult(req);
    let errorMapping = errors.mapped();
    // console.log(errorMapping);

    if (Object.keys(errorMapping).length === 0) {
        next()
    } else {
        res.render('index', {
            data: {
                username: req.body.username
            },
            errors: errorMapping
        })
    }
}

module.exports = {
    doLoginValidator,
    doLoginValidationHandler
}