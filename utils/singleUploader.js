const multer = require('multer')
const path = require('path')
const createError = require('http-errors')


function uploader(subfolder_path, file_types, file_size, error_msg) {
    const UPLOAD_FOLDER = `${__dirname}/../public/uploads/${subfolder_path}`;

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, UPLOAD_FOLDER)
        },
        filename: (req, file, cb) => {
            const extName = path.extname(file.originalname)
            const fileName = file.originalname.replace(extName, '').toLocaleLowerCase().split(' ').join('-') + '-' + Date.now();

            cb(null, fileName + extName)
        }

    });

    const upload = multer({
        storage: storage,
        limits: file_size,
        fileFilter: (req, file, cb) => {
            if (file_types.includes(file.mimetype)) {
                cb(null, true)
            } else {
                cb(createError(error_msg))
            }
        }
    });

    return upload
}

module.exports = uploader