<template>
  <div class="row app-mainDiv">
	<div class="col-md-12 titleBox"><h1>Notes</h1><a href="javascript:;" class="pull-right" @click="logout">Logout</a></div>
	<div class="col-md-12 contentbox">
		<div class="row">
			<div class="col-md-4 col-sm-12 leftContentDiv">
			<ul id="notelistingul">
			<li v-if="allnotes.length == 0">No Records found</li>

			<li v-for="note in allnotes" class="noteList" :key="note._id">
				<div class="editNoteDiv" @click="editNote(note._id)">
					<div>
						<strong>{{ note.title }}</strong>
						<div class="clear"></div>
					</div>
					<p>{{ note.description }}</p>
				</div>
				<strong class="pull-right deleteNote" @click="deleteNote(note._id)">X</strong>
			</li>
			</ul>
			</div>
			<div class="col-md-8 col-sm-12 rightContentDiv">
					<button class="btn pull-right" @click="addNew">+ Add Note</button>
					<div class="clear"></div>
					<div v-show="errMsg" class="alert alert-danger" role="alert">{{errMsg}}</div>
					<div v-show="sucMsg" class="alert alert-success" role="alert">{{sucMsg}}</div>
					<form @submit.prevent="handleSubmit">
						<div class="form-group">
							<label for="title">Title</label>
							<input type="text" v-model="title" id="title" name="title" class="form-control" :class="{ 'is-invalid': submitted && !title }" />
							<div v-show="submitted && !title" class="invalid-feedback">Title is required</div>
							<input type="hidden" v-if="id" id="_id" name="_id" v-model="id" />
						</div>
						<div class="form-group">
							<label for="password">Body</label>
							<textarea v-model="description" name="description" id="description" class="form-control" :class="{ 'is-invalid': submitted && !description }"></textarea>
							<div v-show="submitted && !description" class="invalid-feedback">Description is required</div>
						</div>
						<div class="form-group">
							<button class="btn btn-primary pull-right">Save</button>
							<div class="clear"></div>
						</div>
					</form>
				</div>
			</div>
		</div>
  </div>
</template>

<script>
import axios from 'axios';
import CONST from '../const'

export default {
    data () {
        return {
			allnotes:[],
            title: '',
            description: '',
            id:'',
            errMsg : '',
            sucMsg : '',
            submitted : false
        }
    },
    created () {
		const token = localStorage.getItem('usersec');
		axios.post(CONST.apiURL+'notes', {token:token})
		.then(response => {
			this.allnotes = response.data.notes;
		})
		.catch(err => console.log(err));
    },
    methods: {
         handleSubmit () {
            this.submitted = true;
            const { title, description } = this;
			const token = localStorage.getItem('usersec');
            if (title && description) {
				axios.post(CONST.apiURL+'addnote', {token:token,title:title,description:description,id : this.id})
				.then(response => {
					if(response.data.success == true){
						const allNotes = [...this.allnotes];
						if(this.id != ''){
							const fid = this.id;
							const noteindex = allNotes.findIndex(note => note._id == fid);
							allNotes[noteindex] = response.data.note;
						} else {
							allNotes.push(response.data.note);
						}
						this.allnotes = allNotes;
						this.sucMsg = 'record save successfully';
						this.resetForm();
					} else {
						if(response.data.auth == false){
							this.logout();
						} else {
							this.errMsg = "Server error";
						}
					}
				})
				.catch(err => console.log(err));
            }
        },
        addNew(){
			this.resetForm();
            this.errMsg = '';
            this.sucMsg = '';
        },
        resetForm(){
			this.title =  '';
            this.description = '';
            this.id = '';
            this.submitted = false;
        },
        editNote(fid){
			const allNotes = [...this.allnotes];
			const dataval = allNotes.find(note => note._id == fid);
			if(dataval){
				this.title =  dataval.title;
				this.description = dataval.description;
				this.id = dataval._id;
				
			}
        },
        deleteNote(fid){
			const token = localStorage.getItem('usersec');
			axios.post(CONST.apiURL+'deletenote', {token:token,id:fid})
			.then(response => {
				if(response.data.success == true){
					const allNotes = [...this.allnotes];
					const noteindex = allNotes.findIndex(note => note._id == fid);
					if (noteindex > -1) {
					allNotes.splice(noteindex, 1);
					}
					this.allnotes = allNotes;
					this.sucMsg = response.data.message;
					this.resetForm();
				} else {
					if(response.data.auth == false){
						this.logout();
					} else {
						this.errMsg = "Server error";
					}
				}
			})
			.catch(err => console.log(err));
        },
        logout(){
			localStorage.clear();
			this.$router.push('/login');
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
</style>
