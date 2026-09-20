import { describe, expect, it } from "vitest";
import { expiringWindows } from "./windows";
import { getWindowContent } from "./windowContent";

describe("window content", () => {
  it("provides complete, event-specific content for all 73 windows without fallback", () => {
    expect(expiringWindows).toHaveLength(73);

    const fallback = getWindowContent({
      ...expiringWindows[0],
      id: "__missing-window-content__",
      title: "Fallback sentinel",
      summary: "Fallback sentinel",
    });

    for (const window of expiringWindows) {
      const copy = getWindowContent(window);

      expect(copy.summary.trim(), window.id).not.toBe("");
      expect(copy.whyItMatters.trim(), window.id).not.toBe("");
      expect(copy.afterWindow.trim(), window.id).not.toBe("");
      expect(copy.afterWindow, window.id).not.toBe(fallback.afterWindow);
      expect(copy.actions, window.id).toHaveLength(3);
      expect(new Set(copy.actions.map((action) => action.trim())).size, window.id).toBe(3);
      copy.actions.forEach((action) => expect(action.trim(), window.id).not.toBe(""));

      for (const source of copy.sources) {
        expect(source.title.trim(), window.id).not.toBe("");
        expect(source.url, window.id).toMatch(/^https:\/\//);
        expect(source.scope.trim(), window.id).not.toBe("");
      }
    }
  });
});
