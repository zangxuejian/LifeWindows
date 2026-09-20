import { Menu, X } from "lucide-react";
import { useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useV3Age } from "../hooks/useV3Age";

export function V3Header() {
  const [open, setOpen] = useState(false);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const { currentAgeMonths } = useV3Age();
  const age = `?age=${currentAgeMonths / 12}`;
  return (
    <header className="v3-header" onKeyDown={(event) => { if (open && event.key === "Escape") { setOpen(false); menuTrigger.current?.focus(); } }}>
      <a className="v3-skip" href="#main-content">跳到主要内容</a>
      <div className="v3-shell v3-header__inner">
        <Link className="v3-brand" to={`/${age}`} aria-label="人生窗口期首页" onClick={() => setOpen(false)}><strong>人生窗口期</strong><span>Life Windows</span></Link>
        <button ref={menuTrigger} className="v3-header__menu" type="button" aria-label={open ? "关闭导航" : "打开导航"} aria-expanded={open} aria-controls="v3-navigation" onClick={() => setOpen((value) => !value)}>{open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
        <nav id="v3-navigation" className={open ? "v3-nav is-open" : "v3-nav"} aria-label="主导航">
          <NavLink to={`/${age}`} end onClick={() => setOpen(false)}>此刻的窗口</NavLink>
          <NavLink to={`/v3/explore${age}`} onClick={() => setOpen(false)}>探索全部</NavLink>
          <NavLink to={`/v3/about${age}`} onClick={() => setOpen(false)}>数据与依据</NavLink>
        </nav>
      </div>
    </header>
  );
}
