import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";

import typescript from "rollup-plugin-typescript2";

import pkg from "./package.json";

export default {
  input: "./main.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: "es",
      sourcemap: true,
    },
  ],
  external: ["minimatch"],
  plugins: [
    typescript(),
    external(),
    babel({
      exclude: "node_modules/**",
      plugins: ["external-helpers"],
    }),
    resolve(),
    commonjs(),
  ],
};
