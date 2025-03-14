/*
  @license
	Rollup.js v4.19.0
	Sat, 20 Jul 2024 05:45:44 GMT - commit 28546b5821efcb72c2eb05f422d986524647a0e3

	https://github.com/rollup/rollup

	Released under the MIT License.
*/
export { version as VERSION, defineConfig, rollup, watch } from './shared/node-entry.js';
import './shared/parseAst.js';
import '../native.js';
import 'node:path';
import 'path';
import 'node:process';
import 'node:perf_hooks';
import 'node:fs/promises';
import 'tty';
