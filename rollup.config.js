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
				exports: 'auto'
			},
			{
				file: 'dist/index.esm.js',
				format: 'esm'
			},
			{
				file: 'dist/index.umd.js',
				format: 'umd',
				name: 'fluidStorage'
			}
    	],
    	plugins: [
      		resolve({
        		browser: true, // Important pour le support navigateur
        		preferBuiltins: false // Important pour éviter les problèmes avec les modules Node.js
      		}),
      		commonjs(),
      		typescript({
        		tsconfig: './tsconfig.json',
        		exclude: ['**/*.test.ts', '**/*.spec.ts'], // Exclure les fichiers de test
				declaration: false,
        		declarationMap: false,
      		}),
      		terser()
    	]
  	},
  	{
    	input: 'src/index.ts',
    	output: [{ file: 'types/index.d.ts', format: 'esm' }],
    	plugins: [dts()]
  	}
]);
