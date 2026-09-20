import { Link } from "react-router-dom";
import { useV3Age } from "../hooks/useV3Age";

export function V3Footer() {
  const { currentAgeMonths } = useV3Age();
  return <footer className="v3-footer"><div className="v3-shell v3-footer__inner">
    <p><strong>Life Windows</strong><br />理解阶段，把生活留给自己。</p>
    <nav aria-label="页脚导航"><Link to={`/v3/about?age=${currentAgeMonths / 12}`}>数据与依据</Link><Link to={`/v3/about?age=${currentAgeMonths / 12}#privacy`}>隐私说明</Link><Link to="/v2">V2 时间地图</Link><Link to="/legacy">V1 归档</Link></nav>
  </div></footer>;
}
