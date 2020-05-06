<template>
  <div class="row app-mainDiv">
	<menu-content title="Github" currentpage="github"></menu-content>
	<div class="col-md-12 contentbox">
		<div class="myForm">
			<div>
				<h2>{{ $route.params.id }} Issues </h2>
				<a v-bind:href="'/addissue/'+$route.params.id+'/'+$route.params.owner+''" class="pull-right">Add new</a>
			</div>
			<div class="clear"></div>
			<ul id="notelistingul">
				<li v-if="issues.length == 0">No Records found</li>
				<li v-for="issue in issues" class="noteList" :key="issue.number">
					<div class="editNoteDiv col-md-12">
						<div class="row">
							<div class="col-md-8">
								<strong>{{ issue.title }}</strong>
								<p>{{ issue.body }}</p>
							</div>
							<div class="col-md-4">
								<a v-bind:href="'/addissue/'+$route.params.id+'/'+$route.params.owner+'/'+issue.number+''" class="pull-right detailpagelink">Edit</a>
							</div>
							<div class="clear"></div>
						</div>
					</div>
				</li>
			</ul>
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
			description:'',
            errMsg : '',
            sucMsg : '',
			issues : [],
            submitted : false
        }
    },
	components :{
		MenuContent
	},
    created () {
		const token = localStorage.getItem('usersec');
		axios.post(CONST.apiURL+'getrepositoryissues', {token:token,id:this.$route.params.id,owner:this.$route.params.owner})
		.then(response => {
			if(response.data.success == true){
				this.issues = response.data.issuelist;
				console.log(this.issues);
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
.detailpagelink{
	padding:0 5px;
}
</style>