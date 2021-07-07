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
                    userid: user._id,
                    username: user.name,
                    email: user.email,
                    avatar: user.avatar || null,
                    role: user.role || 'user'
                }

                let token = jwt.sign(userObj, process.env.JWT_SECRET, {
                    expiresIn: 3600000 * 3
                })

                //set cookie
                res.cookie(process.env.COOKIE_NAME, token, {
                    maxAge: 3600000 * 3,
                    httpOnly: true,
                    signed: true
                });

                res.locals.loggedInUser = userObj
                res.redirect('inbox');
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

const addUser = async (req, res, next) => {
    const hashPassword = await bcrypt.hash(req.body.password, 11);
    let newUser;
    // console.log(req.files);
    if (req.files && req.files.length > 0) {
        newUser = new User({
            ...req.body,
            password: hashPassword,
            avatar: req.files[0].filename
        })
    } else {
        newUser = new User({
            ...req.body,
            password: hashPassword,
        })
    }

    try {
        const result = await newUser.save()
        res.status(200).json({
            message: 'User added successfully'
        })
    } catch (err) {
        res.status(500).json({
            errors: {
                common: {
                    msg: 'Unknown error occured'
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
    logoutController,
    addUser
}