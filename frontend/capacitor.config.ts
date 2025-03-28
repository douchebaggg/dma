import { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
	appId: "io.frappe.dma",
	appName: "DMA",
	webDir: "../dma/public/frontend",
	plugins: {
		CapacitorHttp: {
			enabled: true,
		},
	},
}

export default config
