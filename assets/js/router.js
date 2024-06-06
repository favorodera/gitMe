import { createRouter, createWebHistory } from 'vue-router'
import FetchInfo from '../vue/components/FetchInfo.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'home',
      component: FetchInfo,
      children: [
        {
          path: ':repositoryOwner/repos/:repositoryName',
          name: 'repository-details',
          component: FetchInfo
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (!router.resolve(to.fullPath)) {
    next('/') 
  } else {
    next() 
  }
})

export default router
