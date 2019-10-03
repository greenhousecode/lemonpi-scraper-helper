import { eslint } from 'rollup-plugin-eslint';
import { uglify } from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';
import moment from 'moment';
import { name as pkgName, version, main, module, browser } from './package.json';

const input = 'src/main.js';
const banner = `/*! ${pkgName} v${version} ${moment().format('YYYY/MM/DD')} */`;
const name = pkgName.replace(/-[a-z]/g, m => m[1].toUpperCase()); // kebab-case to camelCase

export default [
  {
    input,
    output: {
      banner,
      file: main,
      format: 'cjs',
    },
  },
  {
    input,
    output: {
      banner,
      file: module,
      format: 'esm',
    },
  },
  {
    input,
    plugins: [eslint(), babel(), uglify({ output: { comments: /^!/ } })],
    output: {
      banner,
      file: browser,
      format: 'iife',
      name,
    },
  },
];
