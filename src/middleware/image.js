const multer = require('multer');
var path = require('path');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadsDir = path.resolve(__dirname, '../../public/uploads');
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});


const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {

        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {

            cb(null, true);
        } else {

            cb(new Error('Only JPEG and PNG files are allowed'));
        }
    }
}
);

module.exports={upload}

