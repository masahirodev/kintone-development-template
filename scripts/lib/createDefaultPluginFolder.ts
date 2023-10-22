import fs from "fs";
import path from "path";
import { generatePrivateKey } from "./privateKey";
import { createFolder } from "./createFolder";

export const createDefaultPluginFolder = (appName: string) => {
  // フォルダ構造を作成
  const rootFolder = `src/plugins/${appName}`;

  // 既にフォルダが無いかチェック
  if (fs.existsSync(rootFolder)) {
    throw new Error("Folder already exists.");
  }

  const publicFolder = path.join(rootFolder, "public");

  createFolder(rootFolder);
  createFolder(publicFolder);

  // config.tsx ファイルを生成
  fs.writeFileSync(`${rootFolder}/config.tsx`, "");

  // desktop.tsx ファイルを生成
  fs.writeFileSync(`${rootFolder}/desktop.tsx`, "");

  // public フォルダからファイルをコピー
  fs.copyFileSync("public/config.html", path.join(publicFolder, "config.html"));
  fs.copyFileSync("public/icon.png", path.join(publicFolder, "icon.png"));

  // manifest.json の内容
  const manifest = {
    manifest_version: 1,
    version: 1,
    type: "APP",
    desktop: {
      js: ["dist/desktop.js"],
      css: [],
    },
    icon: "public/icon.png",
    config: {
      html: "public/config.html",
      js: ["dist/config.js"],
      css: [],
    },
    name: {
      ja: appName,
      en: appName,
    },
    description: {
      ja: appName,
      en: appName,
    },
  };

  // manifest.json を生成
  fs.writeFileSync(
    path.join(rootFolder, "manifest.json"),
    JSON.stringify(manifest, null, 2)
  );

  // private.ppk
  fs.writeFileSync(
    path.resolve(rootFolder, "private.ppk"),
    generatePrivateKey()
  );
};
