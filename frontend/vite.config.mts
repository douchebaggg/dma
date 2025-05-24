import path from "path"
import { defineConfig } from "vite"
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite"
import { lucideIcons } from 'frappe-ui/vite/lucideIcons.js'
//import { webserver_port } from "../../../sites/common_site_config.json"
export default defineConfig({
	plugins: [
		vue(),
		...lucideIcons(),
		VitePWA({ 
			registerType: 'autoUpdate',
			workbox: {
				globPatterns: ["**/*.{js,css,html,png,svg,ico,json,yaml}"],
			},
			manifest: {
				name: "DMA App",
				short_name: "DMA App",
  				start_url: "/dma/",
  				scope: "/dma/",
				display: "fullscreen",
				background_color: "#ffffff",
				theme_color: "#f4f5f6",
				icons: [
					{
						src: "/assets/icon/corn-icon-64.png",
						sizes: "64x64",
						type: "image/png",
						purpose: "any"
					},
					{
						src:"/assets/icon/corn-icon-72.png",
						sizes: "72x72",
						type: "image/png",
						purpose: "any"
					},
					{
						src: "/assets/icon/corn-icon-96.png",
						sizes: "96x96",
						type: "image/png",
						purpose: "any"
					},
					{
						src: "/assets/icon/corn-icon-144.png",
						sizes: "144x144",
						type: "image/png",
						purpose: "any"
					},
					{
						src: "/assets/icon/corn-icon-152.png",
						sizes: "152x152",
						type: "image/png",
						purpose: "any"
					},
					{
						src: "/assets/icon/corn-icon-167.png",
						sizes: "167x167",
						type: "image/png",
						purpose: " any"
					},
					{
						src: "/assets/icon/corn-icon-180.png",
						sizes: "180x180",
						type: "image/png",
						purpose: "any"
					},
					{
						src: "/assets/icon/corn-icon-192.png",
						sizes: "192x192",
						type: "image/png",
						purpose: "any"
					},
					{
						src: "/assets/icon/corn-icon-256.png",
						sizes: "256x256",
						type: "image/png",
						purpose: "any"
					},
					{
						src: "/assets/icon/corn-icon-512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any"
					},
					{
						src: "/assets/icon/corn-icon-1024.png",
						sizes: "1024x1024",
						type: "image/png",
						purpose: "any"
					},
				],
				screenshots: [
					{
						src: "/assets/screenshot/screenshot-1.png",
						sizes: "1290x2796",
						type: "image/png",
					}
				]
			},
			includeAssets: [
				"assets/icon/corn-icon-192.png",
				"assets/icon/corn-icon-512.png",
			  ],
			  devOptions: {
				enabled: true
			  }
		}),
		VueI18nPlugin({
			include: path.resolve(__dirname, "./src/locales/*.yaml"),
		}),
	],
	server: {
		port: 5173,
		//proxy: getProxyOptions({ port: webserver_port }),
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
	optimizeDeps: {
		include: [
			"frappe-ui > feather-icons",
			"showdown",
			"engine.io-client",
			"lowlight",
			"highlight.js/lib/core",
			
		],
	},
	build: {
		outDir: "../dma/public/frontend",
		emptyOutDir: true,
		target: "es2021",
		commonjsOptions: {
			include: [/tailwind.config.js/, /node_modules/],
			transformMixedEsModules: true,
		},
		sourcemap: true,
		rollupOptions: {
			output: {
				manualChunks: {
					"frappe-ui": ["frappe-ui"],
				},
			},
		},
	},

})

/*function getProxyOptions({ port }) {
    return {
      '^/(app|login|api|assets|files|private)': {
        target: `http://localhost:${port}`,
        ws: true,
        router: function (req) {
          const site_name = req.headers.host.split(':')[0]
          return `http://${site_name}:${port}`
        },
      },
    }
  }*/