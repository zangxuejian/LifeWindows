import type { WindowStatus as WindowStatusType } from "../../types/window";

interface WindowStatusProps {
  status: WindowStatusType;
  label: string;
  detail?: string;
}

export function WindowStatus({ status, label, detail }: WindowStatusProps) {
  return (
    <span className={`window-status window-status--${status}`}>
      <span className="window-status__mark" aria-hidden="true" />
      <span>
        <span className="window-status__label">{label}</span>
        {detail ? <span className="window-status__detail">{detail}</span> : null}
      </span>
    </span>
  );
}
