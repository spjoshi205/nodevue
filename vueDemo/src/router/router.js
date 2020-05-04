import Vue from 'vue'
import Router from 'vue-router';

import HomePage from '../components/HomePage'
import LoginPage from '../components/LoginPage'

Vue.use(Router);

export const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', component: HomePage },
    { path: '/home', component: HomePage },
    { path: '/login', component: LoginPage },
    // otherwise redirect to home
    { path: '*', redirect: '/' }
  ]
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('usersec');

  if (authRequired && !loggedIn) {
    return next('/login');
  } else if(!authRequired && loggedIn){
	return next('/');
  }
  
  next();
})
