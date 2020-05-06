import Vue from 'vue'
import Router from 'vue-router';

import HomePage from '../components/HomePage'
import LoginPage from '../components/LoginPage'
import RegisterPage from '../components/RegisterPage'
import ProfilePage from '../components/ProfilePage'
import GithubPage from '../components/GithubPage'
import AddIssuePage from '../components/AddIssuePage'
import GithubDetailPage from '../components/GithubDetailPage'
import IssueDetailPage from '../components/IssueDetailPage'

Vue.use(Router);

export const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', component: HomePage },
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage },
    { path: '/profile', component: ProfilePage },
    { path: '/github', component: GithubPage },
    { path: '/addissue/:id/:owner/:issueid?', component: AddIssuePage },
    { path: '/GithubDetailPage/:id/:owner', component: GithubDetailPage },
    { path: '/IssueDetailPage/:id/:owner', component: IssueDetailPage },
    // otherwise redirect to home
    { path: '*', redirect: '/' }
  ]
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login','/register'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('usersec');
  if (authRequired && !loggedIn) {
    return next('/login');
  } else if(!authRequired && loggedIn){
	return next('/');
  }
  
  next();
})