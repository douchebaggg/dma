import path from "path"
import { defineConfig } from "vite"
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite"
//import { webserver_port } from "../../../sites/common_site_config.json"
export default defineConfig({
	plugins: [
		vue(),
		VitePWA({ 
			registerType: 'autoUpdate',
			workbox: {
				globPatterns: ["**/*.{js,css,html,png,svg,ico,json}"],
			},
			manifest: {
				name: "DMA App",
				short_name: "DMA App",
				display: "standalone",
				background_color: "#ffffff",
				theme_color: "#42b883",
				icons: [
				  {
					src: "/assets/icon/corn-icon-192.png",
					sizes: "192x192",
					type: "image/png"
				  },
				  {
					src: "/assets/icon/corn-icon-512.png",
					sizes: "512x512",
					type: "image/png"
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
			"highlight.js": path.resolve(__dirname, "node_modules/highlight.js/lib/core"),
			"lowlight": path.resolve(__dirname, "node_modules/lowlight"),
			
		},
	},
	optimizeDeps: {
		include: [
			"frappe-ui > feather-icons",
			"showdown",
			"engine.io-client",
			"lowlight"

		],
		exclude: [
			"highlight.js",

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