import {createApp} from 'vue'
import index from '../vue/index.vue'
import '../css/index.css'

const appRootContainer = document.querySelector(".app-root-container")

const APP = createApp(index)

APP.mount(appRootContainer)