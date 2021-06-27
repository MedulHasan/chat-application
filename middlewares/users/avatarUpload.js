const uploader = require('../../utils/singleUploader')

function avatarUpload(req, res, next) {
    const upload = uploader('avatars', ['image/jpeg', 'image/jpg', 'image/png'], 1000000, 'Only .jpeg, .jpg, .png format allowed');

    upload.any()(req, res, (err) => {
        if (err) {
            res.status(500).join({
                errors: {
                    avatar: {
                        msg: err.message
                    }
                }
            })
        } else {
            next()
        }
    })
}

module.exports = avatarUpload