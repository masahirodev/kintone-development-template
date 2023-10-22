import fs from "fs";
import path from "path";
import { createFolder } from "./createFolder";

export const createDefaultAppFolder = (appName: string) => {
  // フォルダ構造を作成
  const rootFolder = `src/apps/${appName}`;
  createFolder(rootFolder);

  // index.tsx ファイルを生成
  fs.writeFileSync(`${rootFolder}/index.tsx`, "");

  // manifest.json の内容
  const manifest = {
    app: "",
    scope: "ALL",
    desktop: {
      js: [`dist/${appName}/desktop.js`],
      css: [],
    },
    mobile: {
      js: [],
    },
  };

  // customize-manifest.json を生成
  fs.writeFileSync(
    path.join(rootFolder, "customize-manifest.json"),
    JSON.stringify(manifest, null, 2)
  );

  // customize-manifest-prod.json を生成
  fs.writeFileSync(
    path.join(rootFolder, "customize-manifest-prod.json"),
    JSON.stringify(manifest, null, 2)
  );

  // dist/${appName}/desktop.jsを生成
  const distFolder = `dist/${appName}`;
  createFolder(distFolder);
  fs.writeFileSync(`dist/${appName}/desktop.js`, "");
};
