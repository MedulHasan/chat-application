const router = require('express').Router()

//internal import
const {
    getInboxController,
    searchUser,
    addConversation,
    getMessage,
    sendMessage,
    removeConversation
} = require('../controller/inboxController')
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse')
const { checkLogin } = require('../middlewares/common/checkLogin')
const attachmentUpload = require('../middlewares/inbox/attachmentUpload')

router.get(
    '/',
    decorateHtmlResponse('Inbox'),
    checkLogin,
    getInboxController
);

router.post(
    '/search',
    checkLogin,
    searchUser
);

router.post(
    '/conversation',
    checkLogin,
    addConversation
);

router.get(
    '/messages/:conversation_id',
    checkLogin,
    getMessage
);

router.delete(
    '/messages/:conversation_id',
    checkLogin,
    removeConversation
);

router.post(
    '/message',
    checkLogin,
    attachmentUpload,
    sendMessage
);

module.exports = router