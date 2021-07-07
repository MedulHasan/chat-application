const multer = require('multer');
const path = require('path');
const createError = require('http-errors');

function uploader(subfolder_path, allowed_file_type, max_fileSize, max_number_of_file, error_msg) {
    const UPLOAD_FOLDER = `${__dirname}/../public/uploads/${subfolder_path}/`;

    //define the folder
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, UPLOAD_FOLDER);
        },
        filename: (req, file, cb) => {
            const fileExt = path.extname(file.originalname);
            const fileName = file.originalname.replace(fileExt, "").toLowerCase().split(" ").join("-") + "-" + Date.now();
            cb(null, fileName + fileExt);
        }
    });

    const upload = multer({
        storage,
        limits: {
            fileSize: max_fileSize
        },
        fileFilter: (req, file, cb) => {
            if (req.files.length > max_number_of_file) {
                cb(createError(`Maximum ${max_number_of_file} files are allowed to upload`));
            } else {
                if (allowed_file_type.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(createError(error_msg))
                }
            }
        }
    });

    return upload
}

module.exports = uploader;