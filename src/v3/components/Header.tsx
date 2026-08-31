import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function V3Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="v3-header">
      <div className="v3-shell v3-header__inner">
        <Link className="v3-brand" to="/" aria-label="人生窗口期 V3 首页">
          <strong>人生窗口期</strong>
          <span>Life Windows</span>
        </Link>
        <button
          className="v3-header__menu"
          type="button"
          aria-label={open ? "关闭导航" : "打开导航"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <nav className={open ? "v3-nav is-open" : "v3-nav"} aria-label="V3 主导航">
          <a href="#event-field" onClick={() => setOpen(false)}>此刻的窗口</a>
          <Link to="/v2" onClick={() => setOpen(false)}>查看 V2</Link>
          <Link to="/legacy" onClick={() => setOpen(false)}>查看 V1</Link>
        </nav>
      </div>
    </header>
  );
}
