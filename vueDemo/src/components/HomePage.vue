<template>
  <div class="row app-mainDiv">
		<menu-content title="Dashborard" currentpage=""></menu-content>
		<div class="col-md-12 contentbox">
		<div class="myForm">
			<h2>Setup github</h2>
			<div v-show="errMsg" class="alert alert-danger" role="alert">{{errMsg}}</div>
			<div v-show="sucMsg" class="alert alert-success" role="alert">{{sucMsg}}</div>
			<form @submit.prevent="handleSubmit">
				<div class="form-group">
					<label for="name">Api Key *</label>
					<input type="hidden" v-model="id" id="id" name="id" />
					<input type="text" v-model="apikey" id="apikey" name="apikey" class="form-control" :class="{ 'is-invalid': submitted && (!apikey) }" />
					<div v-show="submitted && (!apikey)" class="invalid-feedback">Api Key is required</div>
				</div>
				<div class="form-group">
					<button class="btn btn-primary">Save</button>
				</div>
			</form>
		</div>
			<div class="row">
				<div class="col-md-12 col-sm-12">
					<h1></h1>
					<div class="row">
						<div class="col-md-12 col-sm-12">
							
						</div>
					</div>
				</div>
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
			apikey: '',
			id:'',
            errMsg : '',
            sucMsg : '',
            submitted : false
        }
    },
	components :{
		MenuContent
	},
    created () {
		const token = localStorage.getItem('usersec');
		axios.post(CONST.apiURL+'getgitkey', {token:token})
		.then(response => {
			if(response.data.success == true){
				this.apikey = response.data.apikey;
				this.id = response.data.id;
			} else {
				if(response.data.auth == false){
					this.logout();
				}
			}
		})
		.catch(err => console.log(err));
    },
    methods: {
         handleSubmit () {
            this.submitted = true;
			this.sucMsg = '';
			this.errMsg = '';
            const { apikey,id } = this;
			const token = localStorage.getItem('usersec');
            if (apikey) {
				axios.post(CONST.apiURL+'addgitkey', {token:token,apikey:apikey,id:id})
				.then(response => {
					if(response.data.success == true){
						this.sucMsg = response.data.message;
						//this.resetForm();
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
</style>