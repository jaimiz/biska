import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";
import eslintPlugin from "@nabla/vite-plugin-eslint";
import jotaiDebugLabel from "jotai/babel/plugin-debug-label";
import jotaiReactRefresh from "jotai/babel/plugin-react-refresh";
import pluginRewriteAll from "vite-plugin-rewrite-all";
import checkerPlugin from "vite-plugin-checker";

const vercelEnv = process.env.VERCEL_ENV ?? false;
const isProduction = vercelEnv
	? vercelEnv === "production"
	: process.env.NODE_ENV === "production";

const vercelPreviewVersion = process.env.VERCEL_GIT_COMMIT_SHA
	? `${
			process.env.npm_package_version
	  } (${process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 8)})`
	: process.env.npm_package_version;

const productionVersion = isProduction
	? process.env.npm_package_version
	: vercelPreviewVersion;

const getVersion = async () => {
	if (vercelEnv) {
		return vercelPreviewVersion;
	}
	if (isProduction) {
		return process.env.npm_package_version;
	}

	return import("child_process").then((child_process) => {
		const gitSha = child_process
			.execSync("git rev-parse --short HEAD")
			.toString()
			.trim();
		return `${productionVersion} (${gitSha})`;
	});
};

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		port: 3000,
	},
	define: {
		YABC_VERSION: JSON.stringify(await getVersion()),
	},
	plugins: [
		pluginRewriteAll(),
		tsconfigPaths(),
		react({
			babel: {
				plugins: [jotaiDebugLabel, jotaiReactRefresh],
			},
		}),
		VitePWA({ registerType: "autoUpdate" }),
		eslintPlugin(),
		checkerPlugin({
			typescript: true
		})
	],
});
