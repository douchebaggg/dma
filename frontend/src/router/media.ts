import { RouteRecordRaw } from "vue-router"
import MediaListPage from "@/views/media/List.vue"
import MediaFormView from "@/views/media/Details.vue"
import MediaDetailsView from "@/views/media/Form.vue"

const routes: Array<RouteRecordRaw> = [
	{
		name: "MediaEntry",
		path: "/media",
		component: MediaListPage,
	},
	{
		name: "NewMediaForm",
		path: "/media/new",
		component: MediaFormView,
	},
	{
		name: "MediaForm",
		path: "/media/:id",
		props: true,
		component: MediaDetailsView,
	},
]

export default routes
