<template>
	<div class="col-md-12 titleBox">
        <div class="row">
            <div class="col-md-8">
                <h1>{{title}}</h1>
            </div>
            <div class="col-md-4">
                <a href="/" class="menuelmcls" v-bind:class="{active:currentpage ==''}">Dashboard</a>
                <a href="/profile" class="menuelmcls" v-bind:class="{active:currentpage =='profile'}">Profile</a>
                <a href="/github" class="menuelmcls"  v-bind:class="{active:currentpage =='github'}">Github</a>
                <a href="javascript:;" class="menuelmcls" @click="logout">Logout</a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
        }
    },
    methods: {
        logout(){
			localStorage.clear();
			this.$router.push('/login');
		}
    },
	props:['title','currentpage']
};
</script>
<style scoped>
.menuelmcls{
    padding: 15px;
    line-height: 55px;
    color: #555;
}
.menuelmcls.active{
    color: #078e17;
}
</style>