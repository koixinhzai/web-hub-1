import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import VueViewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

createApp(App).use(router).use(VueViewer).mount('#app')
