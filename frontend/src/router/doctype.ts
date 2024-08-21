import { RouteRecordRaw } from "vue-router"
import DoctypeCreate from "@/views/doctype/DoctypeCreate.vue"
const routes: Array<RouteRecordRaw> = [
	{
		name: "Doctype Create",
		path: "/doctype/create",
		component: DoctypeCreate,
	},
	
]

export default routes
