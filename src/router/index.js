import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import SendTx from '../pages/SendTx.vue'
import MultiSend from '../pages/MultiSend.vue'
import ImportWallet from '../pages/ImportWallet.vue'
import Settings from '../pages/Settings.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Octra Wallet - Dashboard'
    }
  },
  {
    path: '/send',
    name: 'SendTx',
    component: SendTx,
    meta: {
      title: 'Octra Wallet - Send Transaction'
    }
  },
  {
    path: '/multisend',
    name: 'MultiSend',
    component: MultiSend,
    meta: {
      title: 'Octra Wallet - Multi-Send'
    }
  },
  {
    path: '/import',
    name: 'ImportWallet',
    component: ImportWallet,
    meta: {
      title: 'Octra Wallet - Import Wallet'
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: {
      title: 'Octra Wallet - Settings'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Change document title based on route meta
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Octra Web Wallet'
  next()
})

export default router