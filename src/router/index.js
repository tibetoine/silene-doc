import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Diags from '../views/Diags.vue'
import Sharepoint from '../views/Sharepoint-patrimoine.vue'
import Plans from '../views/Sharepoint-plans.vue'
import help from '../views/help.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      icon: 'home'
    }
  },
  {
    path: '/diags',
    name: 'Diagnostics',
    component: Diags,
    meta: {
      icon: 'bug_report'
    }
  },
  {
    path: '/tech',
    name: 'Docs Sharepoint',
    component: Sharepoint,
    meta: {
      icon: 'menu_book'
    }
  },
  {
    path: '/plans',
    name: 'Planothèque',
    component: Plans,
    meta: {
      icon: 'map'
    }
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/help',
    name: 'Aide',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: help,
    meta: {
      icon: 'live_help'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
