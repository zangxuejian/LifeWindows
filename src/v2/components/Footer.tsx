import { Link } from "react-router-dom";

export function V2Footer() {
  return (
    <footer className="v2-footer" id="about">
      <div className="v2-shell v2-footer__inner">
        <div>
          <strong>人生窗口期</strong>
          <span>Life Windows</span>
        </div>
        <p>年龄是观察坐标，不是价值判断。医疗与政策窗口请以所在地专业建议为准。</p>
        <nav aria-label="页脚导航">
          <Link to="/legacy">查看 V1</Link>
          <Link to="/explore">主题探索</Link>
        </nav>
      </div>
    </footer>
  );
}
