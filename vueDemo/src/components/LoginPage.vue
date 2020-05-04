<template>
    <div>
		<div class="myForm">
			<h2>Login</h2>
			<div v-show="errMsg" class="alert alert-danger" role="alert">{{errMsg}}</div>
			<form @submit.prevent="handleSubmit">
				<div class="form-group">
					<label for="username">Username</label>
					<input type="email" v-model="username" id="username" name="username" class="form-control" :class="{ 'is-invalid': submitted && (!username || !emailvalidation) }" @change="validEmail" />
					<div v-show="submitted && (!username|| !emailvalidation)" class="invalid-feedback">{{emailMessage}}</div>
				</div>
				<div class="form-group">
					<label for="password">Password</label>
					<input type="password" v-model="password" name="password" id="password" class="form-control" :class="{ 'is-invalid': submitted && !password }" />
					<div v-show="submitted && !password" class="invalid-feedback">Password is required</div>
				</div>
				<div class="form-group">
					<button class="btn btn-primary">Login</button>
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
            submitted: false,
            errMsg : '',
            emailvalidation : null,
            emailMessage : 'Username is required'
        }
    },
    created () {
    },
    methods: {
        handleSubmit () {
            this.submitted = true;
            const { username, password } = this;
            if (username && password) {
				axios.post(CONST.apiURL+'login', {username:username,password:password})
				.then(response => {
					if(response.data.success == true){
						localStorage.setItem('usersec', response.data.token);
						this.$router.push('/')
					} else {
						this.errMsg = response.data.message;
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
