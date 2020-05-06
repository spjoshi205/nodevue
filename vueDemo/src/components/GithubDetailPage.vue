<template>
  <div class="row app-mainDiv">
	<menu-content title="Github" currentpage="github"></menu-content>
	<div class="col-md-12 contentbox">
		<div class="myForm">
			<h2>{{ $route.params.id }} Commit Details</h2>
			<ul id="notelistingul">
				<li v-if="commits.length == 0">No Records found</li>
				<li v-for="commit in commits" class="noteList" :key="commit.sha">
					<div class="editNoteDiv">
						<div>
							<strong>{{ commit.sha }}</strong>
							<p>{{ commit.commit.message }}</p>
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
			commits : [],
            submitted : false
        }
    },
	components :{
		MenuContent
	},
    created () {
		const token = localStorage.getItem('usersec');
		axios.post(CONST.apiURL+'getrepositorycommit', {token:token,id:this.$route.params.id})
		.then(response => {
			if(response.data.success == true){
				this.commits = response.data.commitlist;
				console.log(this.commits);
			} else {
				if(response.data.auth == false){
					this.logout();
				}
			}
		})
		.catch(err => console.log(err));
    },
    methods: {
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