import { createRouter, createWebHistory } from "@ionic/vue-router"
import { RouteRecordRaw } from "vue-router"
import Home from "../views/Home.vue"
import accountRoutes from "./account"
import { session } from "../data/session"
import { userResource } from "../data/user"
import basketRoutes  from "./basket"
import seamRoutes from "./seam"
import sterilizerRoutes from "./sterilizer"
import palletsRoutes from "./pallets"
import docType from "./doctype"
import saleRotes from "./sales"

const routes: Array<RouteRecordRaw> = [
	{
		name: "Home",
		path: "/",
		redirect: "/tabs/dashboard",
	},
	{
		path: "/tabs/",
		component: Home,
		children: [
			{
				path: "",
				redirect: "/tabs/dashboard",
			},
			{
				path: "dashboard",
				component: () => import("@/views/Dashboard.vue"),
				//meta: { requiresAuth: true }
			},
			{
				name: "MyAccountPage",
				path: "Account",
				component: () => import("@/views/Account.vue"),
				//meta: { requiresAuth: true }
			},
			{
				path: "doctype",
				component:() => import("@/views/DocType.vue"),
				//meta: { requiresAuth: true }
			},
			{
				path: "qrscaner",
				component: () => import("@/views/QrScanner.vue")
			}
		],
	},
	...accountRoutes,
	...basketRoutes,
	...seamRoutes,
	...sterilizerRoutes,
	...palletsRoutes,
	...docType,
	...saleRotes
	
]

const router = createRouter({
	history: createWebHistory("/dma/"),
	routes,
})

router.beforeEach(async (to, from, next) => {
	let isLoggedIn = session.isLoggedIn
	/*try {
		userResource.reload()
		await userResource.promise
		console.log(userResource)
		
	} catch (error) {
		isLoggedIn.value = false
		userResource.reload()
		console.log(error,to, userResource)
	}

	if (to.name === "Login" && isLoggedIn) {
		next({ name: "Home" })
	} else if (to.name !== "Login" && !isLoggedIn) {
		next({ name: "Login" })
	} else {
		next()
	}*/
	if (to.matched.some(record => record.meta.requiresAuth)) {
		if (isLoggedIn) {
			try {
				await userResource.reload()			
			} catch (error) {
				session.user = null
				console.log(error,to, userResource)
			}
			next();
		} else {
			console.log("Login error")
			next({ name: 'Login' });
			
		}
		} else {
		next();
	}
})


export default router
