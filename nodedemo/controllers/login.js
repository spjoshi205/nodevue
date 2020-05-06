const User = require('../models/user');
var jwt = require('jsonwebtoken');
var Bcrypt = require('bcryptjs');
var config = require('../config');
var http = require('https');
const { validationResult } = require('express-validator/check');
const exptime = 43200;

exports.postLogin = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(200).send({ success:false, messageArr: errors.array() });
	}
	User.findOne({ email: req.body.username }).then( user => {
		const errmsg = 'kindly provide valid login detail';
		if(!user) {
			return res.status(200).send({ success:false, message: errmsg });
		}
		if(!Bcrypt.compareSync(req.body.password, user.password)) {
			return res.status(200).send({ success:false, message: errmsg });
		}
		var token = jwt.sign({ id: user._id }, config.secret, {
		  expiresIn: exptime // expires in 24 hours
		});
		res.status(200).send({ success:true, message: "Login sucessfully", token: token });
	});
}
exports.postRegister = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(200).send({ success:false, messageArr: errors.array() });
	}
	User.findOne({ email: req.body.username }).then( userDetail => {
		if(!userDetail) {
			var hashedPassword = Bcrypt.hashSync(req.body.password, 8);
			const userdata = new User({
				name : req.body.name,
				email : req.body.username,
				password : hashedPassword,
				phone : req.body.phone
			});
			userdata.save((function (_id) {
				var token = jwt.sign({ id: _id }, config.secret, {
					expiresIn: exptime // expires in 24 hours
				});
				return res.status(200).send({ success:true, message: "Register sucessfully", token: token });
			})(userdata._id));
		} else {
			return res.status(200).send({ success:false, message: 'Email Already Exist' });
		}
		
	});
}
exports.getProfile = (req, res, next) => {
	const token = req.body.token;
	jwt.verify(token, config.secret, function(err, decoded) {
		if (err){
			res.status(200).send({ success:false, auth: false, message: 'Failed to authenticate token.' });
		} else {
			userid = decoded.id;
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(200).send({ success:false, messageArr: errors.array() });
			}
			User.findById(userid)
			.then( userDetail => {
				if(userDetail) {
					console.log(userDetail);
					return res.status(200).send({
						success:true,
						userdetail:{
							name : userDetail.name,
							useremail : userDetail.email,
							phone : userDetail.phone,
							image : userDetail.profileImage
						}
					});
				} else {
					return res.status(200).send({ success:false, message: 'No record found' });
				}
			});
		}
	});
}

exports.updateprofile = (req, res, next) => {
	const token = req.body.token;
	jwt.verify(token, config.secret, function(err, decoded) {
		if (err){
			res.status(200).send({ success:false, auth: false, message: 'Failed to authenticate token.' });
		} else {
			userid = decoded.id;
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(200).send({ success:false, messageArr: errors.array() });
			}
			let image = req.file;
			User.findById(userid)
			.then( userDetail => {
				if(userDetail) {
					userDetail.name = req.body.name;
					userDetail.phone = req.body.phone;
					if(image){
						userDetail.profileImage = image.path;
					}
					if(req.body.phone != ''){
						var hashedPassword = Bcrypt.hashSync(req.body.password, 8);
						userDetail.password = hashedPassword;
					}
					if(userDetail.email != req.body.username){
						User.findOne({email : req.body.username})
						.then( existuser => {
							if(existuser){
								return res.status(200).send({ success:false, message: 'Email already exist' });
							} else {
								userDetail.email = req.body.username;
								userDetail.save()
								.then(()=>{
									return res.status(200).send({
										success:true,
										message : "Record save successfully"
									});
								})
								.catch((err)=> console.log(err));
							}
						})
					} else {
						userDetail.email = req.body.username;
						userDetail.save()
						.then(()=>{
							return res.status(200).send({
								success:true,
								message : "Record save successfully"
							});
						})
						.catch((err)=> console.log(err));
					}
				} else {
					return res.status(200).send({ success:false, message: 'No record found' });
				}
			});
		}
	});
}
