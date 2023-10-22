import { createRoot } from "react-dom/client";
import "./desktop.css";
import { useState } from "react";

export type Setting = {
  color: string;
};
const ColorChangeButton = ({ config }: { config: Setting }) => {
  const [color, setColor] = useState(config.color);

  const handler = async () => {
    const update = color === "red" ? "blue" : "red";
    config.color = update;
    setColor(update);

    kintone.plugin.app.setConfig(config, function () {
      alert("プラグインの設定が書き変わりました。アプリを更新してね");
      window.location.href = "../../flow?app=" + kintone.app.getId();
    });
  };

  return (
    <button style={{ backgroundColor: color }} onClick={async () => handler()}>
      color change
    </button>
  );
};

((PLUGIN_ID) => {
  const config = kintone.plugin.app.getConfig(PLUGIN_ID);

  const root = document.getElementById("settings");
  if (!root) {
    throw new Error("elementが存在しません");
  }

  createRoot(root).render(
    <>
      <ColorChangeButton config={config} />
    </>
  );
})(kintone.$PLUGIN_ID);
