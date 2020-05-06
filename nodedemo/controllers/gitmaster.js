const User = require('../models/user');
const Gitmaster = require('../models/gitmaster');
var jwt = require('jsonwebtoken');
var Bcrypt = require('bcryptjs');
var config = require('../config');
var http = require('https');
const { validationResult } = require('express-validator/check');

exports.addgitkey = (req, res, next) => {
	const token = req.body.token;
	jwt.verify(token, config.secret, function(err, decoded) {
		if (err){
			res.status(200).send({ success:false, auth: false, message: 'Failed to authenticate token.' });
		}
		userid = decoded.id;
	});
	var apikeyval = req.body.apikey;
	const id = req.body.id;
	let optionsget = {
		host : config.gitapilink,
		path : '/user', // the rest of the url with parameters if needed
		method : 'GET', // do GET
		headers : {
			'Authorization' : 'token '+apikeyval,
			'user-agent': 'node.js',
		}
	};
	var reqGet = http.request(optionsget, function(response) {
		response.setEncoding('utf8');
		var body = '';
		response.on('data', (chunk) => {
			body += chunk.toString('utf8');
		});
		response.on("end", function(){
			const responsedata = JSON.parse(body);
			if(responsedata.login){
				if(id != ''){
					Gitmaster.findById(id).then(git_master => {
						git_master.apikey = apikeyval;
						git_master.gitusername = responsedata.login;
						git_master.userId = userid;
						git_master.save();
					});
				} else {
					const gitmasterdata = new Gitmaster({
						apikey : apikeyval,
						gitusername : responsedata.login,
						userId : userid
					});
					gitmasterdata.save();
				}
				return res.status(200).send({ success:true, message: 'Key Save successfully' });
			} else {
				return res.status(200).send({ success:false, message: 'Provide valid api key' });
			}
		});
	});
	reqGet.end();
	reqGet.on('error', function(e) {
		console.error('error');
		console.error(e);
	});
}

exports.getgitkey = (req, res, next) => {
	const token = req.body.token;
	jwt.verify(token, config.secret, function(err, decoded) {
		if (err){
			res.status(200).send({ success:false, auth: false, message: 'Failed to authenticate token.' });
		} else {
			userid = decoded.id;
			Gitmaster.findOne({userId : userid})
			.then(masterdata => {
				if(masterdata){
					return res.status(200).send(
						{
							success :true, 
							apikey : masterdata.apikey,
							id : masterdata._id
						}
					);
				} else {
					return res.status(200).send({ success:true, apikey: "",id:"" });
				}
			});
			
		}
	});
}

exports.getrepository = (req, res, next) => {
	const token = req.body.token;
	jwt.verify(token, config.secret, function(err, decoded) {
		if (err){
			res.status(200).send({ success:false, auth: false, message: 'Failed to authenticate token.' });
		} else {
			userid = decoded.id;
			Gitmaster.findOne({userId : userid})
			.then(masterdata => {
				var apikeyval = masterdata.apikey;
				const gitusername = masterdata.gitusername;
				let optionsget = {
					host : config.gitapilink,
					path : '/user/repos', // the rest of the url with parameters if needed
					method : 'GET', // do GET
					headers : {
						'Authorization' : 'token '+apikeyval,
						'user-agent': 'node.js',
					}
				};
				var reqGet = http.request(optionsget, function(response) {
					response.setEncoding('utf8');
					var body = '';
					response.on('data', (chunk) => {
						body += chunk.toString('utf8');
					});
					response.on("end", function(){
						const responsedata = JSON.parse(body);
						let reposDetail = [];
						responsedata.map((val,index)=>{
							repodata = {id: val.id,node_id:val.node_id,name: val.name,full_name:val.full_name,owner:val.owner.login};
							reposDetail.push(repodata);
						});
						return res.status(200).send({ success:true, reposDetail: reposDetail});
					});
				});
				reqGet.end();
				reqGet.on('error', function(e) {
					console.error('error');
					console.error(e);
				});
				
			});
			
		}
	});
}

exports.getrepositorycommit = (req, res, next) => {
	const token = req.body.token;
	jwt.verify(token, config.secret, function(err, decoded) {
		if (err){
			res.status(200).send({ success:false, auth: false, message: 'Failed to authenticate token.' });
		} else {
			userid = decoded.id;
			Gitmaster.findOne({userId : userid})
			.then(masterdata => {
				var apikeyval = masterdata.apikey;
				const gitusername = masterdata.gitusername;
				let optionsget = {
					host : config.gitapilink,
					path : '/repos/'+gitusername+'/'+req.body.id+'/commits', // the rest of the url
					method : 'GET', // do GET
					headers : {
						'Authorization' : 'token '+apikeyval,
						'user-agent': 'node.js',
					}
				};
				var reqGet = http.request(optionsget, function(response) {
					response.setEncoding('utf8');
					var body = '';
					response.on('data', (chunk) => {
						body += chunk.toString('utf8');
					});
					response.on("end", function(){
						const responsedata = JSON.parse(body);
						let commitlist = [];
						responsedata.map((val,index)=>{
							commitdata = {sha: val.sha,commit:val.commit};
							commitlist.push(commitdata);
						});
						return res.status(200).send({ success:true, commitlist: commitlist});
					});
				});
				reqGet.end();
				reqGet.on('error', function(e) {
					console.error('error');
					console.error(e);
				});
				
			});
			
		}
	});
}

exports.getrepositoryissues = (req, res, next) => {
	const token = req.body.token;
	jwt.verify(token, config.secret, function(err, decoded) {
		if (err){
			res.status(200).send({ success:false, auth: false, message: 'Failed to authenticate token.' });
		} else {
			userid = decoded.id;
			Gitmaster.findOne({userId : userid})
			.then(masterdata => {
				var apikeyval = masterdata.apikey;
				const gitusername = masterdata.gitusername;
				let optionsget = {
					host : config.gitapilink,
					path : '/repos/'+req.body.owner+'/'+req.body.id+'/issues', // the rest of the url
					method : 'GET', // do GET
					headers : {
						'Authorization' : 'token '+apikeyval,
						'user-agent': 'node.js',
					}
				};
				var reqGet = http.request(optionsget, function(response) {
					response.setEncoding('utf8');
					var body = '';
					response.on('data', (chunk) => {
						body += chunk.toString('utf8');
					});
					response.on("end", function(){
						const responsedata = JSON.parse(body);
						let issuelist = [];
						responsedata.map((val,index)=>{
							issuedata = {number: val.number,title:val.title,body:val.body};
							issuelist.push(issuedata);
						});
						return res.status(200).send({ success:true, issuelist: issuelist});
					});
				});
				reqGet.end();
				reqGet.on('error', function(e) {
					console.error('error');
					console.error(e);
				});
				
			});
			
		}
	});
}

exports.addissue = (req, res, next) => {
	const token = req.body.token;
	jwt.verify(token, config.secret, function(err, decoded) {
		if (err){
			res.status(200).send({ success:false, auth: false, message: 'Failed to authenticate token.' });
		} else {
			userid = decoded.id;
			Gitmaster.findOne({userId : userid})
			.then(masterdata => {
				var apikeyval = masterdata.apikey;
				const gitusername = masterdata.gitusername;
				let postdata =  JSON.stringify({
					"title": req.body.title,
					"body": req.body.body,
					"assignees": [
						req.body.owner
					],
					"labels": req.body.labels
				  });
				let apipath = '/repos/'+req.body.owner+'/'+req.body.repo+'/issues';
				if(req.body.id != ''){
					apipath += '/'+req.body.id;
				}
				let optionsget = {
					host : config.gitapilink,
					path : apipath, // the rest of the url
					method : 'POST', // do GET
					headers : {
						'Content-Type': 'application/json',
						'Authorization' : 'token '+apikeyval,
						'user-agent': 'node.js',
					}
				};
				var reqGet = http.request(optionsget, function(response) {
					response.setEncoding('utf8');
					var body = '';
					response.on('data', (chunk) => {
						body += chunk.toString('utf8');
					});
					response.on("end", function(){
						const responsedata = JSON.parse(body);
						if(responsedata.number){
							return res.status(200).send({ success:true, message: "Issue save successfully"});
						} else {
							return res.status(200).send({ success:false, message: responsedata.message});
						}
					});
				});
				reqGet.write(postdata);
				reqGet.end();
				reqGet.on('error', function(e) {
					console.error('error');
					console.error(e);
				});
				
			});
			
		}
	});
}

exports.getissue = (req, res, next) => {
	const token = req.body.token;
	jwt.verify(token, config.secret, function(err, decoded) {
		if (err){
			res.status(200).send({ success:false, auth: false, message: 'Failed to authenticate token.' });
		} else {
			userid = decoded.id;
			Gitmaster.findOne({userId : userid})
			.then(masterdata => {
				var apikeyval = masterdata.apikey;
				const gitusername = masterdata.gitusername;
				let optionsget = {
					host : config.gitapilink,
					path : '/repos/'+req.body.owner+'/'+req.body.repo+'/issues/'+req.body.id, // the rest of the url
					method : 'GET', // do GET
					headers : {
						'Authorization' : 'token '+apikeyval,
						'user-agent': 'node.js',
					}
				};
				var reqGet = http.request(optionsget, function(response) {
					response.setEncoding('utf8');
					var body = '';
					response.on('data', (chunk) => {
						body += chunk.toString('utf8');
					});
					response.on("end", function(){
						const responsedata = JSON.parse(body);
						let labels = [];
						responsedata.labels.map((val,index)=>{
							labels.push(val.name);
						});
						if(responsedata.number){
							issuedetail = {
								title: responsedata.title,
								labels: labels,
								body: responsedata.body,
								number: responsedata.number
							};
							return res.status(200).send({ success:true, issuedetail: issuedetail});
						} else {
							return res.status(200).send({ success:false, message: 'No record Found'});
						}
					});
				});
				reqGet.end();
				reqGet.on('error', function(e) {
					console.error('error');
					console.error(e);
				});
				
			});
			
		}
	});
}
