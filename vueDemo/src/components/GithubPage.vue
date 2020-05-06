<template>
  <div class="row app-mainDiv">
	<menu-content title="Github" currentpage="github"></menu-content>
	<div class="col-md-12 contentbox">
		<div class="myForm">
			<h2>All Repository</h2>
			<ul id="notelistingul">
			<li v-if="allrepos.length == 0">No Records found</li>
			<li v-for="note in allrepos" class="noteList" :key="note.id">
				<div class="editNoteDiv">
					<div>
						<strong>{{ note.name }}</strong>
						<a href="javascript:;" class="pull-right detailpagelink" @click="issueDetailPage(note.name,note.owner)">Issues</a>
						<a href="javascript:;" class="pull-right detailpagelink" @click="detailPage(note.name,note.owner)">Commits</a> 
						<div class="clear"></div>
					</div>
					<p>{{ note.description }}</p>
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
            errMsg : '',
            sucMsg : '',
			allrepos : [],
            submitted : false
        }
    },
	components :{
		MenuContent
	},
    created () {
		const token = localStorage.getItem('usersec');
		axios.post(CONST.apiURL+'getrepository', {token:token})
		.then(response => {
			if(response.data.success == true){
				this.allrepos = response.data.reposDetail;
			} else {
				if(response.data.auth == false){
					this.logout();
				}
			}
		})
		.catch(err => console.log(err));
    },
    methods: {
		detailPage(id,owner){
			this.$router.push('/GithubDetailPage/'+id+'/'+owner);
		},
		issueDetailPage(id,owner){
			this.$router.push('/IssueDetailPage/'+id+'/'+owner);
		},
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