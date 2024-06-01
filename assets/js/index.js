import { createApp } from 'vue'
import index from '../vue/index.vue'
import '../css/index.css'
import '../css/left-tabs.css'
import '../css/right-tabs.css'
import '../css/skeleton.css'
import '../css/media-query.css'

const appRootContainer = document.querySelector(".app-root-container")

const APP = createApp(index)

APP.mount(appRootContainer)