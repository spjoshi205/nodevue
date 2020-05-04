const path = require('path');
const express = require('express');
const loginController = require('../controllers/login');
const notesController = require('../controllers/notes');
const router = express.Router();

router.post('/login', loginController.postLogin);
router.post('/notes', notesController.getNotes);
router.post('/addnote', notesController.postNote);
router.post('/deletenote', notesController.postDeleteNote);

module.exports = router;
