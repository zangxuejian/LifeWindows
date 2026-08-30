import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function V2Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="v2-header">
      <div className="v2-shell v2-header__inner">
        <Link className="v2-brand" to="/" aria-label="人生窗口期首页" onClick={close}>
          <span>人生窗口期</span><small>Life Windows</small>
        </Link>
        <button className="v2-header__menu" type="button" aria-expanded={open} aria-controls="v2-primary-nav" onClick={() => setOpen((value) => !value)}>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}<span>菜单</span>
        </button>
        <nav id="v2-primary-nav" className={`v2-nav ${open ? "is-open" : ""}`} aria-label="主导航">
          <Link to="/#timeline" onClick={close}>人生时间轴</Link>
          <Link to="/explore" onClick={close}>主题探索</Link>
          <Link to="/#about" onClick={close}>关于</Link>
        </nav>
      </div>
    </header>
  );
}
