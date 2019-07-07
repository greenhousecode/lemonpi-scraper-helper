import { uglify } from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';
import moment from 'moment';
import { name, version, main, module } from './package.json';

const input = 'src/main.js';
const banner = `/*! ${name} v${version} ${moment().format('YYYY/MM/DD')} */`;

export default [
  {
    input,
    plugins: [babel(), uglify({ output: { comments: /^!/ } })],
    output: {
      banner,
      file: main,
      format: 'umd',
      name: 'lemonpiScraperHelper',
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
];
