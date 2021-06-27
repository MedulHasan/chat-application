const bcrypt = require('bcrypt');
const User = require('../models/People')
const { unlink } = require('fs')
const path = require('path')

const getUsersController = async (req, res, next) => {
    try {
        let users = await User.find();
        res.render('users', {
            users
        })
    } catch (err) {
        next(err)
    }
}

const addUser = async (req, res, next) => {
    const hashPassword = await bcrypt.hash(req.body.password, 11);
    let newUser;
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

const removeUser = async (req, res, next) => {
    let deleteId = req.params.id
    try {
        let user = await User.findByIdAndDelete({ _id: deleteId });

        if (user.avatar) {
            unlink(path.join(__dirname, `/../public/uploads/avatars/${user.avatar}`), (err) => {
                if (err) {
                    console.log(err);
                }
            })
        }

        res.status(200).json({
            message: "User Delete Successfully"
        })
    } catch (err) {
        res.status(500).json({
            errors: {
                common: {
                    msg: "Could not delete the user"
                }
            }
        })
    }
}

module.exports = {
    getUsersController,
    addUser,
    removeUser
}