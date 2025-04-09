import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import { session } from "./data/session"
import dayjs from "@/utils/dayjs"
import {
	Button,
	Badge,
	setConfig,
	frappeRequest,
	pageMetaPlugin,
	resourcesPlugin,
	Card,
	Select
} from "frappe-ui"
import  Input  from "./components/Input.vue"
//import TextInput from "../node_modules/frappe-ui/src/components/TextInput.vue"
import { IonicVue } from "@ionic/vue"

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css"
// Optional CSS utils
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'

// Optional CSS utils
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/float-elements.css'
import '@ionic/vue/css/text-alignment.css'
import '@ionic/vue/css/text-transformation.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/display.css'
import '@ionic/vue/css/palettes/dark.class.css';
// /* Theme variables */
import "./theme/variables.css"

import "./main.css"
import { userResource } from "./data/user"
import {
	dayjsInjectionKey,
	sessionInjectionKey,
	userResourceInjectionKey,
} from "./typing/InjectionKeys"

import { createI18n } from "vue-i18n"
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
// Import messages from yaml files
import messages from "@intlify/unplugin-vue-i18n/messages"
const i18n = createI18n({
	legacy: false,
	locale: "en", // TODO: fetch from preferences later
	fallbackLocale: "en",
	messages,
})

const app = createApp(App)

// FrappeUI Config
setConfig("resourceFetcher", frappeRequest)
app.use(resourcesPlugin)
app.use(pageMetaPlugin)
app.component("Button", Button)
app.component("Badge", Badge)
app.component("Input", Input)
app.component("Card", Card)
app.component("Select",Select)
app.component('VueDatePicker', VueDatePicker);
app.use(router)
app.use(IonicVue, { mode: "md" })

// Globals
app.provide(sessionInjectionKey, session)
app.provide(userResourceInjectionKey, userResource)
app.provide(dayjsInjectionKey, dayjs)

app.config.globalProperties.$dayjs = dayjs

// Mount App
router.isReady().then(() => {
	app.mount("#app")
})
// Internationalization
app.use(i18n)
