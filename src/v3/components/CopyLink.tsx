import { useState } from "react";
import { Check, Link as LinkIcon } from "lucide-react";

export function CopyLink({ ageMonths }: { ageMonths: number }) {
  const [state, setState] = useState<"idle" | "copied" | "manual">("idle");
  const [manualUrl, setManualUrl] = useState("");
  async function copy() {
    const url = new URL(window.location.href);
    url.searchParams.set("age", String(ageMonths / 12));
    try { await navigator.clipboard.writeText(url.href); setState("copied"); }
    catch { setManualUrl(url.href); setState("manual"); }
  }
  return <div className="v3-copy-link"><button type="button" className="v3-text-link" onClick={copy}>{state === "copied" ? <Check size={16} aria-hidden="true" /> : <LinkIcon size={16} aria-hidden="true" />}复制当前窗口链接</button>{state === "copied" ? <span role="status">已复制，再次点击可更新年龄</span> : null}{state === "manual" ? <label>请手动复制链接<input readOnly value={manualUrl} onFocus={(event) => event.currentTarget.select()} /></label> : null}</div>;
}
