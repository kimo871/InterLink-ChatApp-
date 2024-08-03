import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/DashBoard.vue'
import Login from '@/views/Login.vue'
import SignUp from '@/views/SignUp.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/firebaseConfig'

const guardRoute = async (to, from, next) => {
  console.log('Entering beforeEnter guard')
  try {
    console.log(to)
    const user = await new Promise((resolve) => {
      console.log('Waiting for auth state change')
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log('Auth state changed:', user)
        resolve(user)
        unsubscribe()
      })
    })

    if (user) {
      console.log('User is authenticated, proceeding to route')
      console.log('form url', from)
      next()
    } else {
      console.log('User not authenticated, redirecting to signup')
      next('/login')
    }
  } catch (error) {
    console.error('Error during authentication check:', error)
    next('/login')
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // empty for now
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      beforeEnter: guardRoute
    },
    {
      path: '/',
      name: 'login',
      component: Login
    }
  ]
})

export default router
