import { defineConfig } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';

export default defineConfig([
  	{
    	input: 'src/index.ts',
    	output: [
      		{
				file: 'dist/index.cjs.js',
				format: 'cjs',
				exports: 'auto',
				sourcemap: true
      		},
      		{
				file: 'dist/index.esm.js',
				format: 'esm',
				sourcemap: true
      		},
			{
				file: 'dist/index.umd.js',
				format: 'umd',
				name: 'fluidStorage',
				sourcemap: true
			}
    	],
    	plugins: [
      		resolve({
        		browser: true,
        		preferBuiltins: false
      		}),
      		commonjs(),
      		typescript({
        		tsconfig: './tsconfig.json',
        		exclude: ['**/*.test.ts', '**/*.spec.ts', 'tests/**', 'examples/**'],
        		declaration: false,
        		declarationMap: false,
      		}),
      		terser()
    	]
  	},
  	{
    	input: 'types/index.d.ts',
    	output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    	plugins: [dts()],
  	}
]);
