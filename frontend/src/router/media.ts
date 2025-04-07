import { RouteRecordRaw } from "vue-router"
import MediaListPage from "@/views/media/Media.vue"

const routes: Array<RouteRecordRaw> = [
	{
		name: "MediaEntry",
		path: "/media",
		component: MediaListPage,
	},
]

export default routes
