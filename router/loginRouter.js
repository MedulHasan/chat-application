const router = require('express').Router()

const {
    getLoginController,
    loginPostController,
    logoutController
} = require('../controller/loginController')
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse')
const {
    doLoginValidator,
    doLoginValidationHandler
} = require('../middlewares/login/loginValidator')
const { redirectLoggedIn } = require('../middlewares/common/checkLogin')

const page_title = 'Login'

router.get(
    '/',
    decorateHtmlResponse(page_title),
    redirectLoggedIn,
    getLoginController
)

router.post(
    '/',
    decorateHtmlResponse(page_title),
    doLoginValidator,
    doLoginValidationHandler,
    loginPostController
)

router.delete('/', logoutController)

module.exports = router