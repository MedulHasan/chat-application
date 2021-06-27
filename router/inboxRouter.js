const router = require('express').Router()

const { getInboxController } = require('../controller/inboxController')
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse')
const { checkLogin } = require('../middlewares/common/checkLogin')

router.get('/', decorateHtmlResponse('Inbox'), checkLogin, getInboxController)

module.exports = router