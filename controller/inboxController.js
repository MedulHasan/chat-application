const createError = require('http-errors');

const Conversation = require('../models/Conversation')
const User = require('../models/People')
const Message = require('../models/Message')
const escape = require('../utils/escape')

const getInboxController = async (req, res, next) => {
    try {
        const conversation = await Conversation.find({
            $or: [
                { "creator.id": req.user.userid },
                { "participant.id": req.user.userid }
            ]
        });
        // console.log(conversation);
        res.locals.data = conversation;
        res.render('inbox');
    } catch (err) {
        next(err)
    }
}

const searchUser = async (req, res, next) => {

    const user = req.body.user;
    const searchQuery = user.replace('+88', '');

    const name_search_regex = new RegExp(escape(searchQuery), 'i');
    const mobile_search_regex = new RegExp("^" + escape('+88' + searchQuery));
    const email_search_regex = new RegExp("^" + escape(searchQuery) + "$", "i");

    try {
        if (searchQuery !== '') {
            const users = await User.find(
                {
                    $or: [
                        {
                            name: name_search_regex
                        },
                        {
                            mobile: mobile_search_regex
                        },
                        {
                            email: email_search_regex
                        }
                    ]
                }, "name avatar"
            );
            res.json(users);
        } else {
            throw createError("You must provide some text to search");
        }
    } catch (err) {
        res.status(500).json({
            errors: {
                common: {
                    msg: err.message
                }
            }
        });
    }
}

const addConversation = async (req, res, next) => {
    try {
        const newConversaton = new Conversation({
            creator: {
                id: req.user.userid,
                name: req.user.username,
                avatar: req.user.avatar || null
            },
            participant: {
                name: req.body.participant,
                id: req.body.id,
                avatar: req.body.avatar
            }
        });

        const result = await newConversaton.save();
        res.status(200).json({
            message: "Conversation was added successfully"
        });

    } catch (err) {
        res.status(500).json(
            {
                errors: {
                    common: {
                        msg: err.message
                    }
                }
            }
        )
    }
}

const getMessage = async (req, res, next) => {
    try {
        const messages = await Message.find({
            conversation_id: req.params.conversation_id
        }).sort("-createdAt");
        const { participant } = await Conversation.findById(
            req.params.conversation_id
        );
        let data = {
            messages: messages,
            participant
        }
        // console.log(data.messages[0].conversation_id);
        res.status(200).json({
            data,
            user: req.user.userid,
            conversation_id: req.params.conversation_id
        });


    } catch (err) {
        res.status(500).json({
            errors: {
                common: {
                    msg: "unknows error occured"
                }
            }
        });
    }
}

const sendMessage = async (req, res, next) => {
    if (req.body.message || (req.files && req.files.length > 0)) {
        // console.log(req.body.message);
        // console.log("File: ", req.files);
        try {
            let attachments = null;

            if (req.files && req.files.length > 0) {
                attachments = [];

                req.files.forEach((file) => {
                    attachments.push(file.fileName);
                });
            }
            // console.log(attachments);
            const newMessage = new Message({
                text: req.body.message,
                attachment: attachments,
                sender: {
                    id: req.user.userid,
                    name: req.user.username,
                    avatar: req.user.avatar || null
                },
                receiver: {
                    id: req.body.receiverId,
                    name: req.body.receiverName,
                    avatar: req.body.avatar || null
                },
                conversation_id: req.body.conversationId
            });

            const result = await newMessage.save();


            //emit socket event
            global.io.emit("new_message", {
                message: {
                    conversation_id: req.body.conversationId,
                    sender: {
                        id: req.user.userid,
                        name: req.user.username,
                        avatar: req.user.avatar || null
                    },
                    message: req.body.message,
                    attachment: attachments,
                    date_time: result.date_time
                }
            });


            res.status(200).json({
                message: "Successful!",
                data: result
            });
        } catch (err) {
            res.status(500).json({
                errors: {
                    common: {
                        msg: err.message
                    }
                }
            });
        }

    } else {
        res.ststus(500).json({
            errors: {
                common: "Message text or attachment is required"
            }
        });
    }
}

const removeConversation = async (req, res, next) => {

    try {
        let deleteConversation = await Conversation.findByIdAndDelete({
            _id: req.params.conversation_id
        })
        // let messageRemove = await Message.findByIdAndDelete({
        //     conversation_id: req.params.conversation_id
        // })

        res.status(200).json({
            message: "Conversation removed successfully"
        })
    } catch (err) {
        res.status(500).json({
            errors: {
                common: {
                    msg: "could not remove conversation"
                }
            }
        })
    }
}

module.exports = {
    getInboxController,
    searchUser,
    addConversation,
    getMessage,
    sendMessage,
    removeConversation
}