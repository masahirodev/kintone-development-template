import type { Setting } from "../plugins/plugin1/config";

export const DivElement = ({ config }: { config?: Setting }) => {
  const name =
    config?.color === "blue" ? "kintone-customize-sub" : "kintone-customize";

  return <div className={name}>{process.env.WORD}！！！</div>;
};
