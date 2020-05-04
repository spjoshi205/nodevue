const path = require('path');

const express = require('express');
var cors = require('cors')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/user');
var bcrypt = require('bcryptjs');

const app = express();

app.use(cors());

//app.set('view engine','ejs');
//app.set('views','views');

const apiRoutes = require('./routes/api');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRoutes);

app.use('/',(req, res, next) => {
	res.status(404).send({ status: false, message: "Invalid request" });
});

mongoose.connect('mongodb://127.0.0.1:27017/vuedemo')
.then(()=>{
    User.findOne()
    .then(userDetail => {
        if(!userDetail){
		  var hashedPassword = bcrypt.hashSync('Admin@123', 8);
            const user = new User({
                name : 'test',
                email : 'test@test.com',
                password : hashedPassword
            });
            user.save();
        }
        else {
             //console.log(userDetail);
        }
    });
    app.listen(3000)
})
.catch(err => console.log(err));
