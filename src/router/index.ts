import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/modules/auth/views/LoginView.vue'),
      meta: { layout: 'auth', requiresGuest: true },
    },
    {
      path: '/',
      component: () => import('@/layouts/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/modules/dashboard/views/DashboardView.vue'),
        },
        {
          path: 'cartorios',
          name: 'cartorios',
          component: () => import('@/modules/cartorios/views/CartorioListView.vue'),
        },
        {
          path: 'cartorios/novo',
          name: 'cartorios-novo',
          component: () => import('@/modules/cartorios/views/CartorioFormView.vue'),
        },
        {
          path: 'cartorios/:id/editar',
          name: 'cartorios-editar',
          component: () => import('@/modules/cartorios/views/CartorioFormView.vue'),
          props: true,
        },
        {
          path: 'imoveis',
          name: 'imoveis',
          component: () => import('@/modules/imoveis/views/ImovelListView.vue'),
        },
        {
          path: 'imoveis/novo',
          name: 'imoveis-novo',
          component: () => import('@/modules/imoveis/views/ImovelFormView.vue'),
        },
        {
          path: 'imoveis/:id/editar',
          name: 'imoveis-editar',
          component: () => import('@/modules/imoveis/views/ImovelFormView.vue'),
          props: true,
        },
        {
          path: 'usuarios',
          name: 'usuarios',
          component: () => import('@/modules/usuarios/views/UsuarioListView.vue'),
        },
        {
          path: 'usuarios/novo',
          name: 'usuarios-novo',
          component: () => import('@/modules/usuarios/views/UsuarioFormView.vue'),
        },
        {
          path: 'usuarios/:id/editar',
          name: 'usuarios-editar',
          component: () => import('@/modules/usuarios/views/UsuarioFormView.vue'),
          props: true,
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  authStore.restoreSession()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return { name: 'dashboard' }
  }
})

export default router
