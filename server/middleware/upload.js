import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    'image/jpeg': true,
    'image/jpg': true,
    'image/png': true,
    'image/gif': true,
    'video/mp4': true,
    'video/mpeg': true,
    'video/quicktime': true,
    'audio/mpeg': true,
    'audio/wav': true,
    'application/pdf': true
  };

  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, videos, audio, and PDFs are allowed.'), false);
  }
};

// Upload configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5000000 // 5MB default
  },
  fileFilter: fileFilter
});

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files uploaded.' });
    }
  }
  
  if (error.message === 'Invalid file type. Only images, videos, audio, and PDFs are allowed.') {
    return res.status(400).json({ message: error.message });
  }

  next(error);
};

export { upload, handleUploadError };
