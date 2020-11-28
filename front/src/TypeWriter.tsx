import { merge } from "lodash";
import React, { useEffect, useRef } from "react";

const delay = (n: number) => new Promise((res) => setTimeout(res, n));

export interface TypeWriterProps {
  html: string;
  cursorInterval?: number;
  lineInterval?: number;
}

export function TypeWriter(props: TypeWriterProps) {
  const options: Required<TypeWriterProps> = merge(
    {
      cursorInterval: 100,
      lineInterval: 500,
    },
    props
  );

  const from = document.createElement("div");
  from.innerHTML = props.html;
  const toRef = useRef<HTMLDivElement>(null);

  const cursor = document.createElement("span");
  cursor.innerHTML = "|";

  async function typeHTML(from: HTMLElement, to: HTMLElement) {
    for (let i = 0; i < from.childNodes.length; i++) {
      const child = from.childNodes[i] as HTMLElement;
      if (child instanceof Text && child.textContent) {
        const node = document.createElement("span");
        to.appendChild(node);
        cursor.parentElement?.removeChild(cursor);
        to.appendChild(cursor);
        for (let j = 0; j < child.textContent.length; j++) {
          const char = child.textContent[j];
          node.innerHTML += char;
          if (char === ">") {
            const action = child.textContent.slice(j + 1, j + 4);
            j += 4;
            const a = document.createElement("a");
            a.href = "/?action=" + encodeURIComponent(action);
            a.innerText = action;
            node.appendChild(a);
            node.innerHTML += "<";
          }
          if (char === "\n") {
            window.scrollTo(0, document.body.scrollHeight);
            await delay(options.lineInterval);
          } else {
            if (!" \t\"'".includes(char)) {
              await delay(options.cursorInterval);
            } else {
              await delay(options.cursorInterval / 2);
            }
          }
        }
      } else {
        const node = child.cloneNode() as HTMLElement;
        node.innerHTML = "";
        to.appendChild(node);
        await typeHTML(child, node);
      }
    }
  }

  useEffect(() => {
    if (toRef.current) typeHTML(from, toRef.current);
  }, [from, toRef]);

  useEffect(() => {
    const id = setInterval(() => {
      cursor.innerHTML = cursor.innerHTML === "|" ? " " : "|";
    }, props.cursorInterval ?? 500);
    return () => clearInterval(id);
  });
  return <div ref={toRef}></div>;
}
