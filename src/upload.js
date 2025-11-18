import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    const newFilename = `${basename}-${Date.now()}${ext}`;
    cb(null, newFilename);
  },
});

const upload = multer({ storage: storage });

export default upload;
