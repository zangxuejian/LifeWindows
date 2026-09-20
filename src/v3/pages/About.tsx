import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { categoryLabels, expiringWindows } from "../data/windows";
import { getWindowContent, sourceCatalog } from "../data/windowContent";
import { useV3Age } from "../hooks/useV3Age";

const faqs = [
  ["过了窗口，就真的来不及了吗？", "多数卡片描述常见阶段，而不是不可逆的能力截止线。职业、关系和学习没有统一时间表。涉及筛查或资格时，要看个人情况与当地规则；每张详情卡都提供了阶段之后的选择。"],
  ["为什么 33 岁的卡片会显示“将谢”？", "颜色由卡片设定的起止年龄计算：参考区间的前 15% 是初现，15%–55% 为新鲜，55%–72% 为成熟，后 28% 显示将谢。这些比例服务于界面叙事，未经过科学验证，也不能衡量个人的剩余机会。"],
  ["为什么有些卡片从首页消失了？", "首页只呈现与当前参考年龄相关的阶段。结束后，卡片短暂停留在余温区再离场。你仍可以在“探索全部”里找到它，并查看之后还能做什么。"],
  ["能否用它判断报名、退休或投保资格？", "不能。制度类卡片只是提示你核对哪些条件，实际资格可能涉及出生日期、身份、缴费记录、地区与当年规则。必须以发布机构的当前原文为准。"],
  ["为什么网站没有覆盖我正在经历的事情？", "这是一份持续整理的内容库，并不代表人生全貌。现有数据也未根据你的地区、性别、身体状况或个人经历进行个性化判断；未收录的选择同样值得关注。"],
];

export function V3About() {
  const { currentAgeMonths } = useV3Age();
  const [clearMessage, setClearMessage] = useState("");
  const sourcedCount = expiringWindows.filter((item) => getWindowContent(item).sources.length > 0).length;
  function clearActions() {
    try {
      const keys = Object.keys(localStorage).filter((key) => key.startsWith("life-windows-v3-actions:"));
      keys.forEach((key) => localStorage.removeItem(key));
      setClearMessage("本浏览器中的行动清单已清除，所选年龄已保留。");
    } catch { setClearMessage("浏览器未允许访问存储，无法清除。可以在浏览器的网站数据设置中处理。"); }
  }
  return <main id="main-content" className="v3-shell v3-about">
    <header className="v3-page-heading"><div><p className="v3-eyebrow">BEHIND THE WINDOWS</p><h1>理解时间，而不被时间定义。</h1><p>我们把零散的人生阶段放在一起，帮助你发现值得留意的事。每一个年龄区间，都需要带着背景阅读。</p></div></header>
    <div className="v3-about__numbers"><p><strong>{expiringWindows.length}</strong> 个事件</p><p><strong>{Object.keys(categoryLabels).length}</strong> 个主题</p><p><strong>{sourcedCount}</strong> 项附延伸来源</p><span>附有来源 ≠ 起止年龄已获验证</span></div>
    <section className="v3-about__principles"><article><span>01</span><h2>区分阶段与截止日期</h2><p>“20–35 岁职业探索”是一个编辑性观察范围，不意味着 35 岁后不能转行。即使是生长或健康阶段，也存在个体差异。</p></article><article><span>02</span><h2>让来源说它能说的话</h2><p>外部指南可以支持评估方向，但不一定支持卡片上的整段年龄。每条来源都注明适用范围，未接入直接依据的条目会如实说明。</p></article><article><span>03</span><h2>把注意力留给行动</h2><p>每个窗口提供三件可考虑的小事，也写明阶段之后的选择。你可以做一项、改写目标，或决定这张卡与你无关。</p></article></section>
    <section className="v3-about__sources"><p className="v3-eyebrow">READ THE ORIGINALS</p><h2>从原始资料开始</h2><p>以下来源用于一般知识和评估方向。医疗、政策、机构资格仍须结合所在地和个人条件。</p><ul className="v3-sources">{Object.values(sourceCatalog).map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}<ArrowUpRight size={17} aria-hidden="true" /></a><p>{source.scope}</p></li>)}</ul></section>
    <section className="v3-faq"><p className="v3-eyebrow">A FEW GOOD QUESTIONS</p><h2>你可能想知道</h2>{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section>
    <section id="privacy" className="v3-privacy"><h2>你的记录，留在你的浏览器</h2><p>当前应用无需注册。行动清单只保存在本机浏览器，不会上传或自动同步到其他设备。所选年龄同时保存在本地和页面网址中；分享链接会包含年龄，但不包含清单进度。</p><p>含年龄的网址可能保留在浏览历史、分享记录或托管服务的访问日志中。打开外部资料时，将进入相应机构的网站。清除本站数据后，本地记录会丢失；浏览器禁止存储时，核心浏览功能仍可使用。</p><button className="v3-button" type="button" onClick={clearActions}>清除本地行动清单</button><p role="status">{clearMessage}</p></section>
    <Link className="v3-text-link" to={`/?age=${currentAgeMonths / 12}`}>回到此刻的人生窗口 <ArrowUpRight size={17} aria-hidden="true" /></Link>
  </main>;
}
