//Imports
const express = require('express');
const router = express.Router();
const commentCtrl = require('../controllers/comment');
const auth = require('../middleware/auth');

//Routage
router.put("/update", auth, commentCtrl.update);
router.post("/create", auth, commentCtrl.create);
router.delete("/delete", auth, commentCtrl.delete);

module.exports = router; 