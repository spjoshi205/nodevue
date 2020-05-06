const path = require('path');
const express = require('express');
const loginController = require('../controllers/login');
const GitmasterController = require('../controllers/gitmaster');
const { check, body } = require('express-validator/check');
const router = express.Router();

router.post('/login', [
    body('username')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please enter a valid email address.'),
    body('password', 'Password has to be valid.')
    .isLength({ min: 5 })
],loginController.postLogin);
router.post('/register',[
    body('username','Please enter a valid email address.')
      .isEmail()
      .normalizeEmail(),
    body('password', 'Password has to be valid.')
    .isLength({ min: 1 }),
    body('name', 'Name has to be valid.')
    .isLength({ min: 1 }),
    body('phone', 'Phone has to be valid.')
      .isLength({ min: 1 })
      .isNumeric()
], loginController.postRegister);
router.post('/addgitkey', GitmasterController.addgitkey);
router.post('/getgitkey', GitmasterController.getgitkey);
router.post('/getProfile', loginController.getProfile);
router.post('/updateprofile', loginController.updateprofile);
router.post('/getrepository', GitmasterController.getrepository);
router.post('/getrepositorycommit', GitmasterController.getrepositorycommit);
router.post('/getrepositoryissues', GitmasterController.getrepositoryissues);
router.post('/addissue', GitmasterController.addissue);
router.post('/getissue', GitmasterController.getissue);

module.exports = router;
