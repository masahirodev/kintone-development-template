import { createRoot } from "react-dom/client";
import { DivElement } from "../../components/DivElement";

// scssを使う場合
import "../../css/globals.scss";
import "../../css/globals.css";
import "./desktop.css";

kintone.events.on("app.record.index.show", (event) => {
  const element = kintone.app.getHeaderMenuSpaceElement();
  if (!element) {
    throw new Error("elementが存在しません");
  }

  const root = createRoot(element);
  root.render(<DivElement />);

  return event;
});
