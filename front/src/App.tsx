import React from "react";

import hljs from "highlight.js";
import python from "highlight.js/lib/languages/python";
import "highlight.js/styles/tomorrow-night.css";
import useSWR from "swr";
import { TypeWriter } from "./TypeWriter";

hljs.registerLanguage("python", python);

export default function ResponsiveDrawer() {
  let url = "/main.py";
  const action = new URL(document.location.toString()).searchParams.get(
    "action"
  );
  if (action) {
    url = "/result.py?action=" + action;
  }
  const { data } = useSWR(url);
  return (
    <div className="hljs" style={{ minHeight: "100vh" }}>
      <pre>
        <code>
          {data && (
            <TypeWriter
              html={hljs.highlight("python", data.content).value}
            ></TypeWriter>
          )}
        </code>
      </pre>
    </div>
  );
}
