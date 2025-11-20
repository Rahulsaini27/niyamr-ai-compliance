const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyzeDocument } = require('../controllers/scanController');
// Note: You can add 'protect' middleware here if you want only logged-in users to scan
// The frontend handles the check, but adding it here is safer.
// const { protect } = require('../middleware/authMiddleware'); 

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), analyzeDocument); 

module.exports = router;