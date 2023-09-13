import { rmSync } from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import pkg from './package.json';
import tsConfigPaths from 'vite-tsconfig-paths';
import fs from 'fs-extra';
//Optional properties of the component, if anyhttps://vitejs.dev/config/

const DIR_DIST = 'app-dist'

export default defineConfig(({ command }) => {
	rmSync(DIR_DIST, { recursive: true, force: true });

	const isServe = command === 'serve';
	const isBuild = command === 'build';
	const sourcemap = isServe || !!process.env.VSCODE_DEBUG;
	fs.copySync(path.join(__dirname, 'icons'), path.join(__dirname, DIR_DIST+'/main/Icon'));
	fs.copySync(path.join(__dirname, 'languages'), path.join(__dirname, DIR_DIST+'/languages'));

	return {
		resolve: {
			alias: {
				'@': path.join(__dirname, 'src'),
			},
		},
		plugins: [
			react(),
			tsConfigPaths(),
			electron([
				{
					//Optional properties of the component, if anyMain-Process entry file of the Electron App.
					entry: 'electron/main/index.ts',
					onstart(options) {
						if (process.env.VSCODE_DEBUG) {
							console.log('[startup] Electron App');
						} else {
							options.startup();
						}
					},
					vite: {
						build: {
							sourcemap,
							minify: isBuild,
							outDir: DIR_DIST+'/main',
							rollupOptions: {
								external: Object.keys(
									'dependencies' in pkg
										? pkg.dependencies
										: {}
								),
							},
						},
					},
				},
				{
					entry: 'electron/preload/api/api.preload',
					vite: {
						build: {
							sourcemap: sourcemap ? 'inline' : undefined, 
							minify: isBuild,
							outDir: DIR_DIST+'/preload',
							rollupOptions: {
								external: Object.keys(
									'dependencies' in pkg
										? pkg.dependencies
										: {}
								),
							},
						},
					},
				}
			]),
			renderer(),
		],
		server:
			process.env.VSCODE_DEBUG &&
			(() => {
				const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL);
				return {
					host: url.hostname,
					port: +url.port,
				};
			})(),
		clearScreen: false,
	};
});
