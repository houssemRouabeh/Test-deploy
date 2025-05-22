// middlewares/upload.js
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      "/Users/houssem.rouabeh/OneDrive - TOUCOMEX/Bureau/Study/sofien/Sofien-Houssem-GR/public/img"
    );
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + file.fieldname + ext);
  },
});

const upload = multer({ storage });

export default upload;
