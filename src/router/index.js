import { createRouter, createWebHistory } from 'vue-router'
import Login from "../views/Login.vue"
import SignUp from "../views/SignUp.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:"/",
      name:"login",
      component : Login
    },
    {
      path:"/login",
      name : "login",
      component :  Login
    },
    {
      path:"/signup",
      name:"signup",
      component : SignUp
    },
    {
      path: '/:pathMatch(.*)*', // Catch-all route for 404 pages
      name: 'NotFound',
      component: Login,
    }
    
  ]
})

export default router
