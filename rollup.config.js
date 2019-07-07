import moment from 'moment';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import { name, version } from './package.json';

const input = 'src/main.js';
const banner = `/*! ${name} v${version} ${moment().format('YYYY/MM/DD')} */`;

export default [
  {
    input,
    plugins: [babel(), uglify({ output: { comments: /^!/ } })],
    output: {
      banner,
      file: 'dist/bundle.umd.js',
      format: 'umd',
      name: 'slp',
    },
  },
  {
    input,
    output: {
      banner,
      file: 'dist/bundle.esm.js',
      format: 'esm',
    },
  },
];
