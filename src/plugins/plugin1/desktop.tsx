import { createRoot } from "react-dom/client";
import { DivElement } from "../../components/DivElement";
import "./desktop.css";
((PLUGIN_ID) => {
  const config = kintone.plugin.app.getConfig(PLUGIN_ID);

  kintone.events.on("app.record.index.show", (event) => {
    const element = kintone.app.getHeaderMenuSpaceElement();
    if (!element) {
      throw new Error("elementが存在しません");
    }

    const root = createRoot(element);
    root.render(<DivElement config={config} />);

    return event;
  });
})(kintone.$PLUGIN_ID);
