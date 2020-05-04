const Note = require('../models/note');
var jwt = require('jsonwebtoken');
var Bcrypt = require('bcryptjs');
var config = require('../config');

exports.getNotes = (req, res, next) => {
	Note.find()
	.then(notes => {
		res.status(200).send({ success:true, auth: true, notes: notes });
	})
	.catch(err => console.log(err));
}
exports.postNote = (req, res, next) => {
	const title = req.body.title;
	const description = req.body.description;
	const token = req.body.token;
	jwt.verify(token, config.secret, function(err, decoded) {
		if (err){
			res.status(200).send({ success:false, auth: false, message: 'Failed to authenticate token.' });
		}
	});
	
	const id = req.body.id;
	if(id != ''){
		Note.findById(id).then(product => {
		product.title = title;
		product.description = description;
		product.save()
		.then((note)=>{
		  res.status(200).send({ success:true, auth: true, note: note,message:"Record save successfully" });
		})
		.catch(err => console.log(err));
	  });
	} else {
		const note = {title : title, description : description};
		let NewNote = new Note(note); // this is modal object.
		NewNote.save()
		  .then((note)=> {
			  res.status(200).send({ success:true, auth: true, note: note,message:"Record save successfully" });
		   })
		  .catch((err)=> {
			console.log(err);
		  })
	}	
}
exports.postDeleteNote = (req, res, next) => {
	const token = req.body.token
	jwt.verify(token, config.secret, function(err, decoded) {
		if (err){
			res.status(200).send({ success:false, auth: false, message: 'Failed to authenticate token.' });
		}
	});
	const id = req.body.id;
	if(id != ''){
		Note.findByIdAndRemove(id)
		.then((data) => {
			res.status(200).send({ success:true, auth: true, message:"Record delete successfully" });
		})
		.catch(err => console.log(err));
	}
}
