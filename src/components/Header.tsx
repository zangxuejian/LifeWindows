import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="brand" aria-label="人生窗口期首页">
          <span className="brand__cn">人生窗口期</span>
          <span className="brand__en">Life Windows</span>
        </Link>
        <button
          className="mobile-menu-button"
          type="button"
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          <span className="sr-only">{isOpen ? "关闭菜单" : "打开菜单"}</span>
        </button>
        <nav
          id="primary-navigation"
          className={`primary-nav ${isOpen ? "primary-nav--open" : ""}`}
          aria-label="主导航"
        >
          <NavLink to="/now" onClick={() => setIsOpen(false)}>
            此时此刻
          </NavLink>
          <NavLink to="/ask" onClick={() => setIsOpen(false)}>
            我还来得及吗？
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
