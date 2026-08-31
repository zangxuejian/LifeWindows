import { Link } from "react-router-dom";

export function V3Footer() {
  return (
    <footer className="v3-footer" id="principles">
      <div className="v3-shell v3-footer__inner">
        <p>年龄是观察坐标。医疗、政策与机构窗口请以所在地专业建议和当期规则为准。</p>
        <nav aria-label="页脚导航">
          <a href="#principles">数据与依据</a>
          <Link to="/v2">V2 时间地图</Link>
          <Link to="/legacy">V1</Link>
        </nav>
      </div>
    </footer>
  );
}
