import path from "path";
import fs from "fs";

// targetFolderNameがあるかどうか検索する
function findParentFolder(directory, targetFolderName) {
  // ディレクトリ内のファイルおよびサブディレクトリを取得
  const items = fs.readdirSync(directory);

  // ディレクトリ内のサブディレクトリを検査
  for (const item of items) {
    const itemPath = path.join(directory, item);
    if (fs.statSync(itemPath).isDirectory()) {
      // サブディレクトリの名前が目的のフォルダ名と一致したら、現在のディレクトリを返す
      if (item === targetFolderName) {
        return directory;
      }

      // サブディレクトリ内を再帰的に検索
      const result = findParentFolder(itemPath, targetFolderName);
      if (result) {
        return result;
      }
    }
  }

  // 見つからなかった場合はnullを返す
  return null;
}

// appNameを検索し、親フォルダを取得する => apps or plugins
export default function getWebpackConfigName(appName) {
  const searchDirectory = "./src";
  const parentFolder = findParentFolder(searchDirectory, appName);
  if (!parentFolder) {
    throw new Error("Not app name.");
  }

  // apps or plugins
  return path.basename(parentFolder);
}
