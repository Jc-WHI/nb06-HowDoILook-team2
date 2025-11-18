import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = 'uploads';

if (!fs.existsSync(uploadDir)) {
  // uploadDir 디렉토리가 없으면
  fs.mkdirSync(uploadDir); // 만들어뿌
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    const newFilename = `${basename}-${Date.now()}${ext}`;
    cb(null, newFilename);
  },
});

const fileFilter = (req, file, cb) => {
  // 확장자를 정할 수 있음
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg']; // 허용 확장자

  if (allowedMimeTypes.includes(file.mimetype)) {
    // 파일의 확장자가 허용확장자에 포함된다면
    cb(null, true); // 허용
  } else {
    cb(null, false); // 거부
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 최대 10MB
  fileFilter,
});

export default upload;
