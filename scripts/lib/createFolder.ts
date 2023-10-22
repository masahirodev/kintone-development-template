import fs from "fs";

// フォルダが存在しない場合、作成
export const createFolder = (dirPath: string) => {
  // 既にフォルダが無いかチェック
  if (fs.existsSync(dirPath)) {
    throw new Error("Folder already exists.");
  } else {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};
