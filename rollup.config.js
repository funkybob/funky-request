import { terser } from "rollup-plugin-terser";

export default {
        input: 'src/index.js',
	output: {
		sourcemap: true,
		format: 'esm',
		file: 'dist/index.js'
	},
	plugins: [
		terser({
			module: true,
			nameCache: {},
			output: {
				beautify: true
			}
		})
	]
}
