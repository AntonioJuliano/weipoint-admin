const express = require('express');
const router = express.Router();

router.use('/metadata', require('./metadataController'));

module.exports = router;
