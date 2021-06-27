const User = require('../models/People')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const createError = require('http-errors')

const getLoginController = (req, res, next) => {
    res.render('index')
}

const loginPostController = async (req, res, next) => {
    try {
        //find user
        let user = await User.findOne({
            $or: [{ email: req.body.username }, { mobile: req.body.username }]
        })

        if (user) {
            //check password
            let validPassword = await bcrypt.compare(req.body.password, user.password)

            if (validPassword) {
                //token generate
                let userObj = {
                    username: user.name,
                    email: user.email,
                    mobile: user.mobile,
                    role: 'user'
                }

                let token = jwt.sign(userObj, process.env.JWT_SECRET, {
                    expiresIn: 86400000
                })

                //set cookie
                res.cookie(process.env.COOKIE_NAME, token, {
                    maxAge: 86400000,
                    httpOnly: true,
                    signed: true
                });

                res.locals.loggedInUser = userObj
                res.render('inbox')
            } else {
                throw createError('Login Failed');
            }
        } else {
            throw createError('Login Failed');
        }
    } catch (err) {
        res.render('index', {
            data: {
                username: req.body.username
            },
            errors: {
                common: {
                    msg: err.message
                }
            }
        })
    }
}

const logoutController = (req, res, next) => {
    res.clearCookie(process.env.COOKIE_NAME);
    res.send('logged out')
}

module.exports = {
    getLoginController,
    loginPostController,
    logoutController
}