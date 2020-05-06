const path = require('path');

const express = require('express');
var cors = require('cors')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/user');
var bcrypt = require('bcryptjs');
const multer = require('multer');

const app = express();

app.use(cors());

const fileStorage = multer.diskStorage({
    destination : (req,file,cb) =>{
        cb(null,'profile');
    },
    filename :  (req,file,cb) =>{
        cb(null, new Date().toISOString() + "-" + file.originalname);
    }
});

const fileFilter = (req,file,cb) => {
    if(
        file.mimetype == 'image/png' || 
        file.mimetype == 'image/jpg' || 
        file.mimetype == 'image/jpeg' || 
        file.mimetype == 'image/gif '
    ){
        cb(null,true);
    } else {
        cb(null,false);
    }
}
//app.set('view engine','ejs');
//app.set('views','views');

const apiRoutes = require('./routes/api');

app.use(bodyParser.json());
app.use(multer({storage:fileStorage/*,fileFilter : fileFilter*/ }).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/profile',express.static(path.join(__dirname, 'profile')));

app.use('/api', apiRoutes);

app.use('/',(req, res, next) => {
	res.status(404).send({ status: false, message: "Invalid request" });
});

mongoose.connect('mongodb://127.0.0.1:27017/nodevue')
.then(()=>{
    app.listen(3000)
})
.catch(err => console.log(err));
