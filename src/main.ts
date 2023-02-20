import { createApp } from 'vue'
import App from '@/app/index.vue'
import globalFilter from '@/helpers/filters'
import 'uno.css'
import '@unocss/reset/tailwind.css'
import 'src/styles/main.scss'

const app = createApp(App)
const modules = import.meta.glob<any>('/src/modules/*.ts', { eager: true })

// install all modules under `modules/`
Object.values(modules).forEach((module: any) => module.install?.(app))
app.config.globalProperties.$filters = globalFilter

app.mount('#app')
