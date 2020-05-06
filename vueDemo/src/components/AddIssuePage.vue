<template>
  <div class="row app-mainDiv">
	<menu-content title="Github" currentpage="github"></menu-content>
	<div class="col-md-12 contentbox">
		<div class="myForm">
			<div v-show="sucMsg" class="alert alert-success" role="alert">{{sucMsg}}</div>
			<div v-show="errMsg" class="alert alert-danger" role="alert">{{errMsg}}</div>
			<div v-for="err in errMsgArr" v-bind:key="err.param" class="alert alert-danger" role="alert">{{err.msg}}</div>
			<form @submit.prevent="handleSubmit" enctype="multipart/form-data">
				<div class="form-group">
					<label for="title">Title</label>
					<input type="hidden" v-model="id" id="id" name="id" />
					<input type="text" v-model="title" id="title" name="title" class="form-control" :class="{ 'is-invalid': submitted && (!title) }" />
					<div v-show="submitted && (!title)" class="invalid-feedback">Title is required</div>
				</div>
				<div class="form-group">
					<label for="description">Body</label>
					<textarea v-model="body" id="body" name="body" class="form-control" :class="{ 'is-invalid': submitted && (!body) }"></textarea>
					<div v-show="submitted && (!body)" class="invalid-feedback">Body is required</div>
				</div>
				<div class="form-group">
					<label for="description">Labels</label>
					<select v-model="labels" id="labels" name="labels" multiple class="form-control" :class="{ 'is-invalid': submitted && (labels.length == 0) }"><option v-for="option in options" v-bind:key="option" v-bind:selected="selectedlabels.indexOf (option) != -1">{{option}}</option></select>
					<div v-show="submitted && (labels.length == 0)" class="invalid-feedback">labels is required</div>
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
			title: '',
			id:'',
			body:'',
			labels:[],
			selectedlabels:[],
            errMsg : '',
            sucMsg : '',
			errMsgArr : [],
			allrepos : [],
            submitted : false,
			options : ['bug','documentation','duplicate','enhancement','good first issue','help wanted','invalid','question','wontfix'],
        }
    },
	components :{
		MenuContent
	},
    created () {
		let repo = this.$route.params.id;
		let owner = this.$route.params.owner;
		if(this.$route.params.issueid){
			this.id = this.$route.params.issueid;
			const token = localStorage.getItem('usersec');
			axios.post(CONST.apiURL+'getissue', {token:token,repo:repo,owner:owner,id:this.id})
			.then(response => {
				if(response.data.success == true){
					this.title = response.data.issuedetail.title;
					this.id = response.data.issuedetail.number;
					this.body = response.data.issuedetail.body;
					this.labels = this.selectedlabels = response.data.issuedetail.labels;
				} else {
					if(response.data.auth == false){
						this.logout();
					}
				}
			})
			.catch(err => console.log(err));
		}
    },
    methods: {
         handleSubmit () {
            this.submitted = true;
			this.sucMsg = '';
			this.errMsg = '';
            const { title,id,body,labels } = this;
			const token = localStorage.getItem('usersec');
            if (title && body && labels) {
				axios.post(CONST.apiURL+'addissue', {token:token,title:title,id:id,body:body,labels:labels,repo:this.$route.params.id,owner:this.$route.params.owner})
				.then(response => {
					if(response.data.success == true){
						this.sucMsg = response.data.message;
						this.$router.push('/IssueDetailPage/'+this.$route.params.id+"/"+this.$route.params.owner);
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