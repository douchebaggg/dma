import { RouteRecordRaw } from "vue-router"
import SterilizerPage from "@/views/sterilizer/Sterilizer.vue"

const routes: Array<RouteRecordRaw> = [
	{
		name: "Sterilizer",
		path: "/sterilizer",
		component: SterilizerPage,
	},
]

export default routes
