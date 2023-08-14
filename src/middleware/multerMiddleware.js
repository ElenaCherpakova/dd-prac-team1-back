const multer = require('multer');
const CustomMulterError = require('../errors/multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dirPath = path.join(__dirname, '../../public/uploads');
    cb(null, dirPath);
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + '-' + file.originalname;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const MAX_SIZE = 1024 * 1024 * 5; // 5MB size of image

  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/avif'
  ) {
    if (file.size > MAX_SIZE) {
      cb(
        new CustomMulterError(
          'Image size too large, max 5MB allowed',
          'LIMIT_FILE_SIZE'
        ),
        false
      );
    }
    cb(null, true);
  } else {
    cb(new CustomMulterError('Invalid file type', 'INVALID_FILE_TYPE'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
}).single('recipeImage');

module.exports = upload;
