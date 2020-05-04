const User = require('../models/user');
var jwt = require('jsonwebtoken');
var Bcrypt = require('bcryptjs');
var config = require('../config');

exports.postLogin = (req, res, next) => {
	User.findOne({ email: req.body.username }).then( user => {
		const errmsg = 'kindly provide valid login detail';
		if(!user) {
			return res.status(200).send({ success:false, message: errmsg });
		}
		if(!Bcrypt.compareSync(req.body.password, user.password)) {
			return res.status(200).send({ success:false, message: errmsg });
		}
		var token = jwt.sign({ id: user._id }, config.secret, {
		  expiresIn: 86400 // expires in 24 hours
		});
		res.status(200).send({ success:true, message: "Login sucessfully", token: token });
	});
}
