import { RouteRecordRaw } from "vue-router"
import SeamListPage from "@/views/seam/Seam.vue"

const routes: Array<RouteRecordRaw> = [
	{
		name: "SeamEntry",
		path: "/seam",
		component: SeamListPage,
	},
]

export default routes
