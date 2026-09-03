import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Detail from '../views/Detail.vue'

// Phase 5: trang admin cũ (src/admin/) đã bị gỡ — quản trị giờ nằm ở
// web_hub/admin (xem MERGE_PLAN.md). Site này chỉ còn giao diện công khai.
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/spa/:id', name: 'detail', component: Detail },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
