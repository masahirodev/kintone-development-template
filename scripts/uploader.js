import { execSync } from "child_process";
import getWebpackConfigName from "./lib/getWebpackConfigName";

import * as dotenv from "dotenv";
dotenv.config();

// コマンドライン引数の呼び出す
const appName = process.argv[2];
const isWatch = process.argv[3] === "watch";

// appNameを検索し、親フォルダを取得する => apps or plugins
const mode = getWebpackConfigName(appName);

// customize
const getCustomizeCommand = () => {
  const command = `npx kintone-customize-uploader --base-url ${process.env.KINTONE_URL} --username ${process.env.KINTONE_USER} --password ${process.env.KINTONE_PASSWORD} `;

  const addCommand = isWatch ? " --watch --waiting-dialog-ms 3000 " : "";
  const manifest = `src/apps/${appName}/customize-manifest.json`;

  return command + addCommand + manifest;
};

// pulgin
const getPluginCommand = () => {
  const command = `npx kintone-plugin-uploader --base-url ${process.env.KINTONE_URL} --username ${process.env.KINTONE_USER} --password ${process.env.KINTONE_PASSWORD} `;

  const addCommand = isWatch ? " --watch --waiting-dialog-ms 3000 " : "";
  const file = `src/plugins/${appName}/dist/plugin.zip`;

  return command + addCommand + file;
};

const command = mode === "apps" ? getCustomizeCommand() : getPluginCommand();

// コマンド実行
console.log("\nuploading... ");
const result = execSync(command);
console.log("\n" + result);
