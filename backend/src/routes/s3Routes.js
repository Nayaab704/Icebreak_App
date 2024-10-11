const express = require('express');
const s3Controller = require('../controllers/s3Controller');
const router = express.Router();

router.post("/video_upload_pre_signed_url", s3Controller.videoUploadPreSignedUrl)

module.exports = router