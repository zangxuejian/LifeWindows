import { useMemo } from "react";
import { lifeWindows } from "../../data/windows";
import { getAttentionEnd, getWindowStatus, isAvailableStatus } from "../../lib/windowStatus";

export function NowSummary({ age }: { age: number }) {
  const summary = useMemo(() => {
    let closed = 0;
    let available = 0;
    let future = 0;
    let attention = 0;

    for (const window of lifeWindows) {
      const { status } = getWindowStatus(window, age);
      if (status === "closed") closed += 1;
      else if (status === "future") future += 1;
      else if (isAvailableStatus(status)) available += 1;

      const end = getAttentionEnd(window);
      if (end !== null && end > age && end - age <= 5) attention += 1;
    }
    return { closed, available, future, attention };
  }, [age]);

  return (
    <section className="now-summary" aria-label={`${age} 岁的人生窗口摘要`}>
      <div className="now-summary__metrics">
        <div className="summary-metric summary-metric--closed">
          <span className="summary-metric__label">已关闭</span>
          <strong>{summary.closed}</strong>
          <span>不可逆或规则已结束</span>
        </div>
        <div className="summary-metric summary-metric--open">
          <span className="summary-metric__label">正在开放</span>
          <strong>{summary.available}</strong>
          <span>包括仍然可以的窗口</span>
        </div>
        <div className="summary-metric summary-metric--future">
          <span className="summary-metric__label">未来</span>
          <strong>{summary.future}</strong>
          <span>还未到来的窗口</span>
        </div>
      </div>
      <p className="now-summary__attention">
        <span>未来 5 年</span>
        <strong>{summary.attention}</strong> 个窗口需要关注
      </p>
    </section>
  );
}
