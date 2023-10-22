"use strict";
import runAll from "npm-run-all";
import getWebpackConfigName from "./lib/getWebpackConfigName";

// コマンドライン引数の呼び出す
const appName = process.argv[2];

// appNameを検索し、親フォルダを取得する => apps or plugins
const webpackConfigName = getWebpackConfigName(appName);

const commands = [
  `dev -webpackConfigName="${webpackConfigName}" -appName="${appName}"`,
  `upload ${appName} watch`,
];

runAll(commands, {
  // 並列実行
  parallel: true,
  stdout: process.stdout,
  stdin: process.stdin,
}).catch(({ results }) => {
  results
    .filter(({ code }) => code)
    .forEach(({ name }) => {
      console.log(`"npm run ${name}" was failed`);
    });
});
