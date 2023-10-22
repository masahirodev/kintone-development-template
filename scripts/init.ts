import { createDefaultAppFolder } from "./lib/createDefaultAppFolder";
import { createDefaultPluginFolder } from "./lib/createDefaultPluginFolder";

import dotenv from "dotenv";
dotenv.config();

// コマンドライン引数の呼び出す
const mode = process.argv[2]; // plugin or app
const appName = process.argv[3];

if (appName === undefined) {
  throw new Error("Not app name.");
}

switch (mode) {
  // plugin用のフォルダ作成
  case "plugin":
    createDefaultPluginFolder(appName);
    break;
  case "app":
    createDefaultAppFolder(appName);
    break;

  default:
    throw new Error("Not allow method.");
}
