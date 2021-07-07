const router = require('express').Router()

const {
    getUsersController,
    // addUser,
    removeUser
} = require('../controller/usersController')

const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse')

// const avatarUpload = require('../middlewares/users/avatarUpload')

// const {
//     addUserValidators,
//     addUserValidationHandler
// } = require('../middlewares/users/userValidator')

const { checkLogin } = require('../middlewares/common/checkLogin')

router.get(
    '/',
    decorateHtmlResponse('Users'),
    checkLogin,
    getUsersController
)

// router.post(
//     '/',
//     checkLogin,
//     avatarUpload,
//     addUserValidators,
//     addUserValidationHandler,
//     addUser
// )

router.delete('/:id', removeUser)

module.exports = router