import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

const generatedClassNames = () => {
	// return "[hash:base64:18]";
};

export default defineConfig({
	plugins: [react(), svgr()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src/"),
			"@components": path.resolve(__dirname, "src/components"),
			"@database": path.resolve(__dirname, "src/database"),
			"@media": path.resolve(__dirname, "src/media"),
			"@pages": path.resolve(__dirname, "src/pages"),
			"@popups": path.resolve(__dirname, "src/popups"),
			"@reducers": path.resolve(__dirname, "src/reducers"),
			"@stores": path.resolve(__dirname, "src/stores"),
			"@styles": path.resolve(__dirname, "src/styles"),
			"@utils": path.resolve(__dirname, "src/utils"),
		},
		extensions: [".json", ".js", ".jsx", ".css", ".scss", ".svg"],
	},
	css: {
		modules: {
			generateScopedName: generatedClassNames(),
		},
		preprocessorOptions: {
			scss: {
				api: "modern-compiler",
			},
		},
	},
	base: "/",
	publicDir: "public",
	build: {
		minify: "terser",
		terserOptions: {
			format: {
				comments: false,
			},
		},
		outDir: "dist",
		rollupOptions: {
			output: {
				compact: true,
				entryFileNames: `assets/js/script-[name].js`,
				chunkFileNames: `assets/js/script-[name].js`,
				assetFileNames: (assetInfo) => {
					if (assetInfo.name.endsWith(".css")) {
						return "assets/css/styles-[name].css";
					}

					if (assetInfo.name.endsWith(".js")) {
						return "assets/js/script-[name].js";
					}

					return "assets/[ext]/[name].[ext]";
				},
				manualChunks(id) {
					if (id.includes("node_modules")) {
						return "vendor";
					}
				},
			},
		},
	},
	server: {
		open: true,
		port: 6969,
	},
	define: {
		global: "globalThis",
	},
});
