<template>
    <div>
		<div class="myForm">
			<h2>Register</h2>
			<div v-show="errMsg" class="alert alert-danger" role="alert">{{errMsg}}</div>
			<div v-for="err in errMsgArr" v-bind:key="err.param" class="alert alert-danger" role="alert">{{err.msg}}</div>
			<form @submit.prevent="handleSubmit">
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
					<input type="password" v-model="password" name="password" id="password" class="form-control" :class="{ 'is-invalid': submitted && !password }" />
					<div v-show="submitted && !password" class="invalid-feedback">Password is required</div>
				</div>
				<div class="form-group">
					<label for="phone">Phone</label>
					<input type="text" v-model="phone" name="phone" id="phone" class="form-control" :class="{ 'is-invalid': submitted && !phone }" />
					<div v-show="submitted && !phone" class="invalid-feedback">Phone is required</div>
				</div>
				<div class="form-group">
					<button class="btn btn-primary">Register</button>&nbsp;
					<a class="btn btn-primary" href="/login">Login</a>
				</div>
			</form>
		</div>
    </div>
</template>

<script>
import axios from 'axios';
import CONST from '../const'

export default {
    data () {
        return {
            username: '',
            password: '',
			name: '',
			phone: '',
            submitted: false,
            errMsg : '',
            errMsgArr : [],
            emailvalidation : null,
            emailMessage : 'Username is required'
        }
    },
    created () {
    },
    methods: {
        handleSubmit () {
            this.submitted = true;
            const { username, password,name,phone } = this;
            if (username && password && name && phone) {
				axios.post(CONST.apiURL+'register', {username:username,password:password,name:name,phone:phone})
				.then(response => {
					if(response.data.success == true){
						localStorage.setItem('usersec', response.data.token);
						this.$router.push('/')
					} else {
						this.errMsgArr = [];
						this.errMsg = '';
						if(response.data.messageArr){
							this.errMsgArr = response.data.messageArr;
						}
						if(response.data.message){
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
		}
    }
};
</script>
<style scoped>
.myForm {
  max-width: 400px;
  margin:auto;
}
</style>
