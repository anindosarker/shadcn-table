import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';
import external from 'rollup-plugin-peer-deps-external';

export default [
  {
    external: ['@tanstack/react-table', 'react', 'react-dom'],
    input: './src/index.ts',
    /**
     * TODO: use this format
     output: [
      {
        file: `./${pkg.main}`,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: `./${pkg.module}`,
        format: 'esm',
        sourcemap: true,
      },
    ],
     */
    output: [
      { file: './dist/index.js', format: 'cjs', sourcemap: true },
      { file: './dist/index.esm.js', format: 'esm', sourcemap: true },
    ],
    plugins: [external(), resolve(), typescript({ rootDir: './src' })],
  },
  {
    input: './dist/types/index.d.ts',
    output: [{ file: './dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
  },
];
