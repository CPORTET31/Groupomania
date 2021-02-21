import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import Wall from '../views/Wall.vue'
import Administration from '../views/Administration.vue'
import User from '../views/User.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    beforeEnter: (to, from, next) => {
      if(store.state.authenticated == false) {
          next({ name: 'Login' })
      } else {
        next({ name: 'Wall' })
      }
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/wall',
    name: 'Wall',
    component: Wall,
    beforeEnter: (to, from, next) => {
      if(store.state.authenticated == false) {
          next(false);
      } else {
          next();
      }
    }
  },
  {
    path: '/administration',
    name: 'Administration',
    component: Administration,
    beforeEnter: (to, from, next) => {
      if(store.state.authenticated == false) {
          next(false);
      } else {
        if(store.state.user.isAdmin == false) {
          next(false);
        } else {
          next();
        }
      }
    }
  },
  {
    path: '/user',
    name: 'User',
    component: User,
    beforeEnter: (to, from, next) => {
      if(store.state.authenticated == false) {
          next(false);
      } else {
          next();
      }
    }
  },
]

const router = new VueRouter({
  routes
})

export default router