<template>
  <div class="row app-mainDiv">
		<menu-content title="Profile" currentpage="profile"></menu-content>
		<div class="col-md-12 contentbox">
		<img v-show="profileImage" v-bind:src="profileImage" title="profile image" class="profileImagecls" />
		<div class="myForm">
			<h2>Update Profile</h2>
			<div v-show="sucMsg" class="alert alert-success" role="alert">{{sucMsg}}</div>
			<div v-show="errMsg" class="alert alert-danger" role="alert">{{errMsg}}</div>
			<div v-for="err in errMsgArr" v-bind:key="err.param" class="alert alert-danger" role="alert">{{err.msg}}</div>
			<form @submit="formSubmit" enctype="multipart/form-data">
				<div class="form-group">
					<label for="name">Name</label>
					<input type="text" v-model="name" id="name" name="name" class="form-control" :class="{ 'is-invalid': submitted && (!name) }" />
					<div v-show="submitted && (!name)" class="invalid-feedback">Name is required</div>
				</div>
				<div class="form-group">
					<label for="username">Email</label>
					<input type="email" v-model="username" id="username" name="username" class="form-control" :class="{ 'is-invalid': submitted && (!username || !emailvalidation) }" @change="validEmail" />
					<div v-show="submitted && (!username|| !emailvalidation)" class="invalid-feedback">{{emailMessage}}</div>
				</div>
				<div class="form-group">
					<label for="password">Password</label>
					<input type="password" v-model="password" name="password" id="password" class="form-control" />
				</div>
				<div class="form-group">
					<label for="password">Profile</label>
					<input type="file" class="form-control" v-on:change="onImageChange">
				</div>
				<div class="form-group">
					<label for="phone">Phone</label>
					<input type="text" v-model="phone" name="phone" id="phone" class="form-control" :class="{ 'is-invalid': submitted && !phone }" />
					<div v-show="submitted && !phone" class="invalid-feedback">Phone is required</div>
				</div>
				<div class="form-group">
					<button class="btn btn-primary">Update</button>
				</div>
			</form>
		</div>
	</div>
  </div>
</template>

<script>
import axios from 'axios';
import CONST from '../const'
import MenuContent from './menu'

export default {
    data () {
        return {
			username: '',
            password: '',
			name: '',
			phone: '',
			image: '',
			profileImage: '',
            submitted: false,
            errMsg : '',
			token : '',
			sucMsg : '',
            errMsgArr : [],
            emailvalidation : true,
            emailMessage : 'Username is required'
        }
    },
	components :{
		MenuContent
	},
    created () {
		const token = localStorage.getItem('usersec');
		this.token = token;
		this.loadProfileData();
    },
    methods: {
		onImageChange(e){
			console.log(e.target.files[0]);
			this.image = e.target.files[0];
		},
		formSubmit (e) {
			e.preventDefault();
			const config = {
				headers: { 'content-type': 'multipart/form-data' }
			}
			let username = this.username;
			let name = this.name;
			let phone = this.phone;
			let formData = new FormData();
			formData.append('image', this.image);
			formData.append('username',username);
			formData.append('password',this.password);
			formData.append('name',name);
			formData.append('phone',phone);
			formData.append('token',this.token);
            this.submitted = true;
			this.sucMsg = '';
			this.errMsg = '';
			if (username && name && phone) {
				axios.post(CONST.apiURL+'updateprofile', formData, config)
				.then(response => {
					console.log(response);
					if(response.data.success == true){
						this.sucMsg = response.data.message;
						this.loadProfileData();
					} else {
						if(response.data.auth == false){
							this.logout();
						} else {
							this.errMsg = response.data.message;
						}
					}
				})
				.catch(err => console.log(err));
			}
        },
        validEmail: function () {
			let email = this.username;
			var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			this.emailvalidation = re.test(email);
			if(!this.emailvalidation){
				this.emailMessage = 'Kindly provide valid email';
			}
		},
		loadProfileData : function(){
			axios.post(CONST.apiURL+'getProfile', {token:this.token})
			.then(response => {
				if(response.data.success == true){
					let userdetail = response.data.userdetail;
					this.username = userdetail.useremail;
					this.name = userdetail.name;
					this.phone = userdetail.phone;
					this.profileImage = CONST.apiURL+userdetail.image;
				} else {
					if(response.data.auth == false){
						this.logout();
					}
				}
			})
			.catch(err => console.log(err));
		},
		getprofileImage : function(){
			return this.profileImage;
		}
    }
};
</script>
<style>
#app{
	overflow:hidden
}
</style>
<style scoped>
.titleBox {
  background-color:#f8f8f8;
  padding:10px 30px;
  border-bottom:1px solid #999;
}
.contentbox{
	padding:0px 30px;
}
.pull-right{
	float:right;
}
.clear{
	clear:both;
}
.rightContentDiv{
	padding-top:10px;
	border-left:1px solid #999;
}
#description{
	height: 200px;
}
#notelistingul{
	margin: 0;
    padding: 0;
    list-style: none;
    max-height:500px;
    overflow:auto;
}
.noteList{
	position:relative;
	border-bottom:1px solid #999;
}
.editNoteDiv{
cursor:pointer;
}
.deleteNote{
	position:absolute;
	right:0;
	top:0;
	cursor:pointer;
}
.myForm {
  max-width: 400px;
  margin:auto;
}
.profileImagecls{
	max-width:150px;
}
</style>