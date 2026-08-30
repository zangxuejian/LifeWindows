import type { Evidence, LifeWindowV2, WindowDetail } from "../types";

const sources = {
  cdcMilestones: {
    type: "official",
    label: "CDC Developmental Milestones",
    note: "发展里程碑用于观察与沟通，不是对单个儿童的诊断期限。",
    url: "https://www.cdc.gov/milestones",
  },
  nhcVision: {
    type: "clinical",
    label: "国家卫健委《0～6岁儿童眼保健及视力检查服务规范（试行）》",
    note: "规范列出新生儿、婴儿、幼儿与学龄前阶段的儿童眼保健服务节点。",
    url: "https://www.nhc.gov.cn/fys/c100078/202106/eab0d16758a545bb88c2dc84734ae6ee.shtml",
  },
  nhcDental: {
    type: "official",
    label: "国家卫健委口腔健康科普",
    note: "儿童口腔节点应结合牙齿萌出情况与专业检查判断。",
    url: "https://www.nhc.gov.cn/wjw/jkhdr/201109/67c9a540ac01429eacaacdc75ab7e567.shtml",
  },
  nhcOrthodontics: {
    type: "clinical",
    label: "国家卫健委全生命周期健康科普",
    note: "正畸并非青少年专属；成人是否适合仍需口腔与牙周专业评估。",
    url: "https://www.nhc.gov.cn/xcs/c100122/202508/8458a47948274283ab01c6cc672d8015.shtml",
  },
  whoFeeding: {
    type: "official",
    label: "WHO Infant and young child feeding",
    note: "婴幼儿喂养建议需结合个体健康、家庭条件与所在地专业指导。",
    url: "https://www.who.int/news-room/fact-sheets/detail/infant-and-young-child-feeding",
  },
  uspstfColorectal: {
    type: "clinical",
    label: "USPSTF Colorectal Cancer Screening",
    note: "45–75 岁为美国平均风险成人指南范围示例；地区、风险与方案会不同。",
    url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening",
  },
  editorial: {
    type: "editorial",
    label: "Life Windows 编辑框架",
    note: "社会与生活窗口是观察坐标，不是价值判断或成功标准。",
  },
} satisfies Record<string, Evidence>;

type WindowSeed = Omit<LifeWindowV2, "id" | "evidence" | "detail"> & {
  evidence?: Evidence;
  detail?: Partial<WindowDetail>;
};

function defineWindow(seed: WindowSeed): LifeWindowV2 {
  const boundary = seed.hardEnd
    ? "这个年龄段对应的阶段会结束，但相关能力仍可能通过其他路径发展。"
    : "常见年龄范围不是硬性截止；个体条件、地区规则与支持资源都会改变实际情况。";

  return {
    ...seed,
    id: seed.slug,
    evidence: seed.evidence ?? sources.editorial,
    detail: {
      answer: seed.detail?.answer ?? seed.summary,
      question: seed.detail?.question,
      whyChanges:
        seed.detail?.whyChanges ?? "机会会随身体发育、社会制度、可获得资源与既往经验而变化。",
      whatNow: seed.detail?.whatNow ?? ["确认自己的目标，而不是只看年龄。", "寻找当前阶段可行的替代路径。"],
      boundaries: seed.detail?.boundaries ?? [boundary, "页面内容用于产品演示，不替代专业判断。"],
    },
  };
}

const infancy: LifeWindowV2[] = [
  defineWindow({ slug: "newborn-hearing-screen", title: "新生儿听力筛查", category: "infancy", lifeStage: "infant", icon: "ear", startAge: 0, endAge: 1, ageUnit: "month", hardEnd: true, featured: true, priority: 10, summary: "尽早完成初筛，异常结果需要按当地流程复筛与评估。", evidence: { ...sources.editorial, type: "clinical", label: "新生儿健康管理示例", note: "具体时间与流程以出生机构和所在地新生儿筛查要求为准。" } }),
  defineWindow({ slug: "newborn-family-visit", title: "新生儿家庭访视", category: "infancy", lifeStage: "infant", icon: "home", startAge: 0, endAge: 1, ageUnit: "month", hardEnd: true, summary: "出生后的早期访视关注喂养、黄疸、体重与家庭照护。", evidence: { ...sources.nhcVision, note: "国家基本公共卫生服务包含新生儿家庭访视等早期健康管理节点。" } }),
  defineWindow({ slug: "newborn-eye-observation", title: "新生儿眼部观察", category: "infancy", lifeStage: "infant", icon: "eye", startAge: 0, endAge: 1, ageUnit: "month", hardEnd: true, summary: "早期观察眼外观与视物行为，发现异常及时转诊。", evidence: sources.nhcVision }),
  defineWindow({ slug: "first-social-smile", title: "第一次社会性微笑", category: "infancy", lifeStage: "infant", icon: "smile", startAge: 1, endAge: 4, ageUnit: "month", golden: { startAge: 1, endAge: 3 }, featured: true, summary: "微笑是互动发展线索之一，出现时间存在自然差异。", evidence: sources.cdcMilestones }),
  defineWindow({ slug: "head-control-observation", title: "抬头与头部控制观察", category: "infancy", lifeStage: "infant", icon: "baby", startAge: 2, endAge: 5, ageUnit: "month", summary: "用日常互动观察头部控制进展，有疑虑时尽早咨询。", evidence: sources.cdcMilestones }),
  defineWindow({ slug: "infant-eye-check-3m", title: "3 月龄眼保健", category: "infancy", lifeStage: "infant", icon: "eye", startAge: 3, endAge: 4, ageUnit: "month", hardEnd: true, summary: "婴儿期眼保健的一个服务节点。", evidence: sources.nhcVision }),
  defineWindow({ slug: "rolling-observation", title: "翻身发展观察", category: "infancy", lifeStage: "infant", icon: "baby", startAge: 4, endAge: 8, ageUnit: "month", summary: "把翻身当作观察线索，不把单一月份当作考试。", evidence: sources.cdcMilestones }),
  defineWindow({ slug: "sitting-observation", title: "独坐发展观察", category: "infancy", lifeStage: "infant", icon: "baby", startAge: 6, endAge: 10, ageUnit: "month", featured: true, summary: "坐姿控制是运动发展线索之一，个体节奏可以不同。", evidence: sources.cdcMilestones }),
  defineWindow({ slug: "first-teeth-eruption", title: "乳牙萌出与口腔清洁", category: "infancy", lifeStage: "toddler", icon: "tooth", startAge: 6, endAge: 30, ageUnit: "month", golden: { startAge: 6, endAge: 24 }, featured: true, summary: "从乳牙萌出开始建立清洁与定期口腔观察。", evidence: sources.nhcDental }),
  defineWindow({ slug: "complementary-food-transition", title: "辅食过渡", category: "infancy", lifeStage: "infant", icon: "sprout", startAge: 6, endAge: 12, ageUnit: "month", golden: { startAge: 6, endAge: 8 }, summary: "在专业指导下，从单一喂养逐步过渡到安全、营养充足的食物。", evidence: sources.whoFeeding }),
  defineWindow({ slug: "infant-developmental-screening", title: "婴幼儿发展筛查节点", category: "infancy", lifeStage: "toddler", icon: "activity", startAge: 9, endAge: 30, ageUnit: "month", summary: "用标准化工具与持续观察讨论发展，而非只凭单一表现判断。", evidence: sources.cdcMilestones }),
];

const childhood: LifeWindowV2[] = [
  defineWindow({ slug: "child-language-golden", title: "儿童语言黄金期", category: "childhood", lifeStage: "child", icon: "speech", startAge: 3, endAge: 12, ageUnit: "year", golden: { startAge: 3, endAge: 12 }, featured: true, priority: 9, summary: "童年更容易形成语音与语言直觉，成年学习仍然有效。", evidence: { ...sources.editorial, type: "research", label: "语言学习研究的编辑概括", note: "语言能力由输入、互动、动机与学习条件共同影响。" } }),
  defineWindow({ slug: "preschool-free-play", title: "学龄前自由游戏", category: "childhood", lifeStage: "child", icon: "sparkles", startAge: 3, endAge: 6, ageUnit: "year", hardEnd: true, summary: "自由游戏支持想象、协作与身体探索，是学龄前阶段的独特经验。" }),
  defineWindow({ slug: "preschool-vision-checks", title: "学龄前视力检查", category: "childhood", lifeStage: "child", icon: "eye", startAge: 4, endAge: 6, ageUnit: "year", hardEnd: true, featured: true, summary: "4、5、6 岁是规范中的专项眼位、屈光与视力检查节点。", evidence: sources.nhcVision }),
  defineWindow({ slug: "primary-school-stage", title: "小学阶段", category: "childhood", lifeStage: "child", icon: "school", startAge: 6, endAge: 12, ageUnit: "year", hardEnd: true, featured: true, summary: "年龄意义上的小学阶段会结束，学习能力不会随之关闭。" }),
  defineWindow({ slug: "first-molar-sealant", title: "第一恒磨牙窝沟封闭", category: "childhood", lifeStage: "child", icon: "tooth", startAge: 6, endAge: 9, ageUnit: "year", golden: { startAge: 6, endAge: 9 }, featured: true, summary: "牙冠完全萌出且尚未龋坏时，是常见评估节点。", evidence: sources.nhcDental }),
  defineWindow({ slug: "reading-foundation", title: "自主阅读基础", category: "childhood", lifeStage: "child", icon: "book", startAge: 5, endAge: 10, ageUnit: "year", golden: { startAge: 5, endAge: 9 }, summary: "从共同阅读走向自主阅读，重点是兴趣、理解与稳定接触。" }),
  defineWindow({ slug: "music-foundation", title: "音乐启蒙与听觉训练", category: "childhood", lifeStage: "child", icon: "music", startAge: 4, endAge: 12, ageUnit: "year", golden: { startAge: 4, endAge: 10 }, summary: "早期接触有利于形成习惯，但开始音乐没有统一截止年龄。" }),
  defineWindow({ slug: "swim-safety-foundation", title: "游泳与水中安全启蒙", category: "childhood", lifeStage: "child", icon: "shield", startAge: 5, endAge: 12, ageUnit: "year", summary: "在合格看护与安全环境中建立水中自救和风险意识。" }),
  defineWindow({ slug: "mixed-dentition-check", title: "替牙期口腔评估", category: "childhood", lifeStage: "child", icon: "tooth", startAge: 6, endAge: 12, ageUnit: "year", golden: { startAge: 6, endAge: 12 }, summary: "混合牙列阶段适合观察萌出、咬合与口腔清洁问题。", evidence: sources.nhcDental }),
  defineWindow({ slug: "second-molar-sealant", title: "第二恒磨牙窝沟封闭", category: "childhood", lifeStage: "teen", icon: "tooth", startAge: 11, endAge: 13, ageUnit: "year", golden: { startAge: 11, endAge: 13 }, summary: "第二恒磨牙萌出后可由口腔专业人员评估是否适合封闭。", evidence: sources.nhcDental }),
  defineWindow({ slug: "childhood-friendship-play", title: "童年伙伴游戏", category: "childhood", lifeStage: "child", icon: "users", startAge: 4, endAge: 11, ageUnit: "year", hardEnd: true, summary: "无功利的伙伴游戏是童年独特经验，成年社交无法完全替代。" }),
];

const teen: LifeWindowV2[] = [
  defineWindow({ slug: "adolescence-stage", title: "青少年阶段", category: "teen", lifeStage: "teen", icon: "sparkles", startAge: 12, endAge: 18, ageUnit: "year", hardEnd: true, featured: true, summary: "年龄阶段不可逆地经过，但探索身份与关系的能力不会终止。" }),
  defineWindow({ slug: "teen-spine-screening", title: "脊柱健康筛查", category: "teen", lifeStage: "teen", icon: "activity", startAge: 10, endAge: 16, ageUnit: "year", hardEnd: true, featured: true, summary: "生长加速阶段关注体态和脊柱弯曲异常，异常需转介评估。", evidence: { ...sources.nhcDental, label: "儿童青少年“五健”促进行动计划", note: "官方行动计划提出在 10–16 岁开展脊柱弯曲异常筛查评估。", url: "https://www.nhc.gov.cn/fys/c100078/202512/9c3da4badfb34026b5fabbf5853105ee.shtml" } }),
  defineWindow({ slug: "youth-competitive-sport", title: "青少年竞技体育", category: "teen", lifeStage: "teen", icon: "activity", startAge: 8, endAge: 20, ageUnit: "year", golden: { startAge: 10, endAge: 18 }, summary: "部分竞技路线依赖早期训练，日常运动与技能提升长期开放。" }),
  defineWindow({ slug: "identity-exploration", title: "身份与价值观探索", category: "teen", lifeStage: "teen", icon: "compass", startAge: 12, endAge: 22, ageUnit: "year", summary: "在相对低风险的环境中尝试兴趣、角色与价值判断。" }),
  defineWindow({ slug: "financial-basics-teen", title: "第一次管理零用钱", category: "teen", lifeStage: "teen", icon: "wallet", startAge: 12, endAge: 20, ageUnit: "year", summary: "用小额、可复盘的真实决策建立预算与延迟满足能力。" }),
  defineWindow({ slug: "sleep-rhythm-literacy", title: "青春期睡眠认知", category: "teen", lifeStage: "teen", icon: "heart", startAge: 12, endAge: 18, ageUnit: "year", hardEnd: true, summary: "认识青春期作息变化，减少把疲惫简单归因于意志力。" }),
  defineWindow({ slug: "teen-first-aid", title: "基础急救训练", category: "teen", lifeStage: "teen", icon: "shield", startAge: 12, endAge: 20, ageUnit: "year", summary: "在学校与社群中学习可验证的急救技能和求助流程。" }),
  defineWindow({ slug: "creative-apprenticeship", title: "创作型学徒期", category: "teen", lifeStage: "teen", icon: "sparkles", startAge: 13, endAge: 22, ageUnit: "year", golden: { startAge: 13, endAge: 20 }, summary: "用长时间练习建立作品，而不是急于把兴趣职业化。" }),
  defineWindow({ slug: "digital-habit-foundation", title: "数字生活习惯定型", category: "teen", lifeStage: "teen", icon: "shield", startAge: 10, endAge: 18, ageUnit: "year", summary: "练习通知边界、信息判断与专注恢复，成年后仍可重建。" }),
  defineWindow({ slug: "parent-child-transition", title: "亲子关系转型", category: "teen", lifeStage: "teen", icon: "users", startAge: 13, endAge: 22, ageUnit: "year", summary: "关系从照护逐步转向边界、协商与独立。" }),
  defineWindow({ slug: "teen-community-belonging", title: "青少年社群归属", category: "teen", lifeStage: "teen", icon: "users", startAge: 12, endAge: 19, ageUnit: "year", hardEnd: true, summary: "校园与同龄社群的共同成长经验具有阶段性。" }),
];

const education: LifeWindowV2[] = [
  defineWindow({ slug: "compulsory-education-stage", title: "义务教育阶段", category: "education", lifeStage: "child", icon: "school", startAge: 6, endAge: 15, ageUnit: "year", hardEnd: true, summary: "制度性阶段会结束，补足基础教育与继续学习仍有其他路径。" }),
  defineWindow({ slug: "secondary-school-stage", title: "中学阶段", category: "education", lifeStage: "teen", icon: "school", startAge: 12, endAge: 18, ageUnit: "year", hardEnd: true, summary: "校园中学阶段不可逆，但知识与能力并不以毕业为边界。" }),
  defineWindow({ slug: "higher-education", title: "高等教育", category: "education", lifeStage: "youth", icon: "school", startAge: 18, endAge: 24, ageUnit: "year", golden: { startAge: 18, endAge: 24 }, featured: true, priority: 9, summary: "这是全日制高等教育的常见年龄，并不是求学硬限制。" }),
  defineWindow({ slug: "graduate-education", title: "研究生教育", category: "education", lifeStage: "youth", icon: "book", startAge: 22, endAge: 32, ageUnit: "year", golden: { startAge: 22, endAge: 30 }, summary: "研究训练更依赖问题、资源与持续投入，而非单一年龄。" }),
  defineWindow({ slug: "study-abroad", title: "留学与跨文化学习", category: "education", lifeStage: "youth", icon: "plane", startAge: 18, endAge: 35, ageUnit: "year", summary: "早期更易与学业衔接，之后仍可通过工作、访学和短期项目实现。" }),
  defineWindow({ slug: "vocational-foundation", title: "职业技能教育", category: "education", lifeStage: "youth", icon: "briefcase", startAge: 16, endAge: 30, ageUnit: "year", summary: "通过真实任务建立可迁移技能，转入时间并不唯一。" }),
  defineWindow({ slug: "second-language-learning", title: "第二语言学习", category: "education", lifeStage: "child", icon: "speech", startAge: 3, endAge: 15, ageUnit: "year", golden: { startAge: 3, endAge: 12 }, summary: "早期语音优势会变化，成年人仍可通过系统训练达到高水平。" }),
  defineWindow({ slug: "learn-programming", title: "学习编程", category: "education", lifeStage: "teen", icon: "book", startAge: 10, ageUnit: "year", alwaysOpen: true, featured: true, summary: "从解决真实问题开始，年龄不会自动关闭这扇门。" }),
  defineWindow({ slug: "professional-certification", title: "专业资格与认证", category: "education", lifeStage: "youth", icon: "shield", startAge: 18, ageUnit: "year", alwaysOpen: true, summary: "资格路径受地区和行业规则影响，很多阶段都可重新进入。" }),
  defineWindow({ slug: "cross-discipline-learning", title: "跨学科学习", category: "education", lifeStage: "adult", icon: "book", startAge: 25, ageUnit: "year", alwaysOpen: true, featured: true, summary: "已有经验会成为理解新领域的支点，而不是负担。" }),
  defineWindow({ slug: "lifelong-learning", title: "终身学习", category: "education", lifeStage: "youth", icon: "sprout", startAge: 18, ageUnit: "year", alwaysOpen: true, featured: true, summary: "学习目标和节奏会改变，但入口长期存在。" }),
];

const career: LifeWindowV2[] = [
  defineWindow({ slug: "first-job-entry", title: "第一份正式工作", category: "career", lifeStage: "youth", icon: "briefcase", startAge: 18, endAge: 28, ageUnit: "year", golden: { startAge: 20, endAge: 26 }, summary: "首次进入职业系统的常见阶段，不是职业价值的起跑线。" }),
  defineWindow({ slug: "campus-recruitment", title: "校园招聘常见阶段", category: "career", lifeStage: "youth", icon: "briefcase", startAge: 20, endAge: 25, ageUnit: "year", golden: { startAge: 20, endAge: 24 }, summary: "校招渠道具有身份与时间条件，其他招聘路径长期存在。" }),
  defineWindow({ slug: "career-exploration", title: "职业探索", category: "career", lifeStage: "youth", icon: "briefcase", startAge: 20, endAge: 35, ageUnit: "year", golden: { startAge: 20, endAge: 32 }, featured: true, priority: 10, summary: "通过不同角色和项目找到兴趣、能力与市场的交集。" }),
  defineWindow({ slug: "career-capital", title: "职业资本积累", category: "career", lifeStage: "youth", icon: "sprout", startAge: 25, endAge: 40, ageUnit: "year", summary: "复利来自技能、信誉、作品与关系，而不是职位名称。" }),
  defineWindow({ slug: "management-role", title: "进入管理岗位", category: "career", lifeStage: "adult", icon: "users", startAge: 28, endAge: 55, ageUnit: "year", summary: "管理入口受组织与行业影响，专业路线同样可以增长影响力。" }),
  defineWindow({ slug: "career-transition", title: "职业转型", category: "career", lifeStage: "adult", icon: "compass", startAge: 30, endAge: 50, ageUnit: "year", summary: "转型成本会变化，但相邻迁移、试项目与再训练可以降低风险。" }),
  defineWindow({ slug: "entrepreneurship", title: "创业", category: "career", lifeStage: "youth", icon: "sprout", startAge: 18, ageUnit: "year", alwaysOpen: true, summary: "机会、风险承受力与资源匹配比年龄本身更关键。" }),
  defineWindow({ slug: "portfolio-career", title: "组合式职业", category: "career", lifeStage: "adult", icon: "briefcase", startAge: 30, ageUnit: "year", alwaysOpen: true, summary: "把专业、项目、教学或创作组合成更有韧性的职业结构。" }),
  defineWindow({ slug: "become-a-mentor", title: "成为导师", category: "career", lifeStage: "adult", icon: "users", startAge: 35, ageUnit: "year", alwaysOpen: true, featured: true, summary: "把经验转化为他人的路径提示，也重新整理自己的方法。" }),
  defineWindow({ slug: "second-career", title: "第二人生事业", category: "career", lifeStage: "midlife", icon: "sprout", startAge: 45, ageUnit: "year", alwaysOpen: true, featured: true, summary: "用长期积累开启新的职业、创作或社会参与。" }),
  defineWindow({ slug: "retirement-handover", title: "职业交接与退休过渡", category: "career", lifeStage: "midlife", icon: "briefcase", startAge: 55, endAge: 70, ageUnit: "year", summary: "提前整理知识、关系与新生活结构，减少身份突然中断。" }),
];

const body: LifeWindowV2[] = [
  defineWindow({ slug: "orthodontics-golden-period", title: "牙齿正畸黄金期", category: "body", lifeStage: "teen", icon: "tooth", startAge: 12, endAge: 18, ageUnit: "year", golden: { startAge: 12, endAge: 18 }, featured: true, priority: 10, summary: "生长发育阶段常有便利，但成年人并非自动失去正畸可能。", evidence: sources.nhcOrthodontics, detail: { question: "33 岁还可以正畸吗？", answer: "通常仍然可以，但方案取决于牙周健康、牙齿情况与专业评估。", whyChanges: "青少年时期颌骨仍在发育，部分问题更容易在生长阶段干预；成年后骨骼定型，治疗目标、周期与风险评估会不同。", whatNow: ["预约口腔科或正畸专科进行面对面检查。", "评估牙周健康、龋齿、缺牙与咬合情况。", "询问目标、可选方案、周期、风险与保持器计划。"], boundaries: ["黄金期 ≠ 硬性截止；年龄很少是唯一决定因素。", "健康牙齿可以在成年阶段移动，但并非每个人都适合相同方案。", "本页为一般信息，不构成诊断或治疗建议。"] } }),
  defineWindow({ slug: "build-exercise-habit", title: "建立运动习惯", category: "body", lifeStage: "child", icon: "activity", startAge: 6, ageUnit: "year", alwaysOpen: true, featured: true, summary: "越早建立越容易复利，但任何年龄开始都能获得收益。" }),
  defineWindow({ slug: "strength-training", title: "力量训练", category: "body", lifeStage: "teen", icon: "activity", startAge: 16, ageUnit: "year", alwaysOpen: true, featured: true, priority: 9, summary: "从适合自己的负荷、动作质量和恢复开始，长期维护肌力。" }),
  defineWindow({ slug: "bone-health-foundation", title: "骨骼健康基础期", category: "body", lifeStage: "teen", icon: "activity", startAge: 10, endAge: 30, ageUnit: "year", golden: { startAge: 10, endAge: 30 }, summary: "生长与青年阶段重视运动、营养与生活方式，之后仍需持续维护。" }),
  defineWindow({ slug: "adult-dental-care", title: "成人口腔定期评估", category: "body", lifeStage: "youth", icon: "tooth", startAge: 18, ageUnit: "year", alwaysOpen: true, summary: "牙周、龋齿和既往治疗情况需要按个体风险持续评估。", evidence: sources.nhcOrthodontics }),
  defineWindow({ slug: "blood-pressure-awareness", title: "血压与心血管风险认知", category: "body", lifeStage: "youth", icon: "heart", startAge: 18, ageUnit: "year", alwaysOpen: true, summary: "了解基础指标与家族风险，具体筛查频次需遵循当地建议。", evidence: { ...sources.editorial, type: "clinical", label: "成人预防保健示例", note: "筛查频次会因地区、既往指标与风险因素而不同。" } }),
  defineWindow({ slug: "colorectal-screening-window", title: "结直肠癌筛查参考窗", category: "body", lifeStage: "adult", icon: "shield", startAge: 45, endAge: 75, ageUnit: "year", hardEnd: false, featured: true, summary: "美国平均风险成人指南示例为 45–75 岁；请以所在地与个人风险为准。", evidence: sources.uspstfColorectal }),
  defineWindow({ slug: "hearing-health-midlife", title: "中年听力基线", category: "body", lifeStage: "midlife", icon: "ear", startAge: 50, ageUnit: "year", alwaysOpen: true, summary: "留意沟通疲劳与听觉变化，需要时做专业评估。" }),
  defineWindow({ slug: "vision-health-midlife", title: "中年视力与眼健康", category: "body", lifeStage: "adult", icon: "eye", startAge: 40, ageUnit: "year", alwaysOpen: true, summary: "近距离视力与眼病风险会变化，检查计划应结合个人情况。" }),
  defineWindow({ slug: "balance-maintenance", title: "平衡力维护", category: "body", lifeStage: "midlife", icon: "activity", startAge: 60, ageUnit: "year", alwaysOpen: true, featured: true, summary: "持续练习力量、步态与平衡，为独立生活保留余量。" }),
  defineWindow({ slug: "healthy-aging-review", title: "健康老龄综合评估", category: "body", lifeStage: "senior", icon: "heart", startAge: 65, ageUnit: "year", alwaysOpen: true, featured: true, summary: "把功能、用药、营养、认知、情绪与社会支持放在一起看。" }),
];

const family: LifeWindowV2[] = [
  defineWindow({ slug: "learn-family-history", title: "了解家族历史", category: "family", lifeStage: "teen", icon: "users", startAge: 12, ageUnit: "year", alwaysOpen: true, summary: "在记忆仍可被讲述时，记录名字、选择与迁徙。" }),
  defineWindow({ slug: "intergenerational-relationships", title: "建立代际关系", category: "family", lifeStage: "child", icon: "users", startAge: 10, ageUnit: "year", alwaysOpen: true, summary: "主动维护跨年龄关系，获得不同时间尺度的理解。" }),
  defineWindow({ slug: "partnership-learning", title: "长期伴侣关系学习", category: "family", lifeStage: "youth", icon: "heart", startAge: 20, ageUnit: "year", alwaysOpen: true, summary: "练习沟通、边界与共同决策，不把某个年龄当作必须完成的期限。" }),
  defineWindow({ slug: "family-finance-foundation", title: "家庭财务基础", category: "family", lifeStage: "youth", icon: "wallet", startAge: 25, ageUnit: "year", alwaysOpen: true, summary: "建立现金流、应急与长期目标的共同语言。" }),
  defineWindow({ slug: "interview-parents", title: "深度访谈父母", category: "family", lifeStage: "youth", icon: "speech", startAge: 25, ageUnit: "year", alwaysOpen: true, featured: true, summary: "在还能对话时，理解他们成为父母之前的人生。" }),
  defineWindow({ slug: "caregiving-coordination", title: "家庭照护协作", category: "family", lifeStage: "adult", icon: "home", startAge: 35, ageUnit: "year", alwaysOpen: true, summary: "把照护从个人牺牲变成信息、责任与资源的协作。" }),
  defineWindow({ slug: "family-storytelling", title: "家庭叙事整理", category: "family", lifeStage: "adult", icon: "book", startAge: 45, ageUnit: "year", alwaysOpen: true, featured: true, summary: "整理照片、声音与重要事件，让记忆可以被下一代找到。" }),
  defineWindow({ slug: "grandparent-connection", title: "祖辈连接", category: "family", lifeStage: "adult", icon: "users", startAge: 40, ageUnit: "year", alwaysOpen: true, summary: "让陪伴、故事与技能在代际间发生真实交换。" }),
  defineWindow({ slug: "family-rituals", title: "建立家庭仪式", category: "family", lifeStage: "youth", icon: "home", startAge: 20, ageUnit: "year", alwaysOpen: true, summary: "用可持续的小仪式建立归属，而不是追求完美节日。" }),
  defineWindow({ slug: "important-wishes-record", title: "重要意愿整理", category: "family", lifeStage: "midlife", icon: "shield", startAge: 50, ageUnit: "year", alwaysOpen: true, featured: true, summary: "与可信任的人讨论重要偏好、文件位置与紧急联络。" }),
  defineWindow({ slug: "family-legacy-project", title: "家庭传承项目", category: "family", lifeStage: "senior", icon: "sprout", startAge: 65, ageUnit: "year", alwaysOpen: true, summary: "把经验、手艺、价值观或资源变成可被接续的作品。" }),
];

const experience: LifeWindowV2[] = [
  defineWindow({ slug: "first-solo-trip", title: "第一次独自旅行", category: "experience", lifeStage: "youth", icon: "compass", startAge: 18, endAge: 35, ageUnit: "year", summary: "在可控风险中练习独立决策、迷路与重新计划。" }),
  defineWindow({ slug: "study-travel", title: "求学阶段的远行", category: "experience", lifeStage: "teen", icon: "plane", startAge: 15, endAge: 30, ageUnit: "year", hardEnd: true, summary: "与同学、预算和假期共同发生的远行具有阶段性。" }),
  defineWindow({ slug: "live-in-another-city", title: "在另一座城市生活", category: "experience", lifeStage: "youth", icon: "home", startAge: 18, endAge: 45, ageUnit: "year", summary: "短暂离开熟悉系统，重新理解选择、关系与生活成本。" }),
  defineWindow({ slug: "run-a-marathon", title: "完成耐力挑战", category: "experience", lifeStage: "youth", icon: "activity", startAge: 18, ageUnit: "year", alwaysOpen: true, summary: "目标可从步行、徒步到马拉松，关键是循序训练和健康评估。" }),
  defineWindow({ slug: "long-creative-project", title: "完成长期创作", category: "experience", lifeStage: "teen", icon: "sparkles", startAge: 12, ageUnit: "year", alwaysOpen: true, summary: "用几个月或几年完成一本书、一张专辑或一组作品。" }),
  defineWindow({ slug: "nature-expedition", title: "自然探索", category: "experience", lifeStage: "child", icon: "compass", startAge: 10, ageUnit: "year", alwaysOpen: true, summary: "根据体能与安全条件选择远足、露营或自然观察。" }),
  defineWindow({ slug: "community-service", title: "参与社区服务", category: "experience", lifeStage: "teen", icon: "users", startAge: 12, ageUnit: "year", alwaysOpen: true, summary: "从真实需要出发，把时间与能力投入身边的公共生活。" }),
  defineWindow({ slug: "public-speaking", title: "公开表达", category: "experience", lifeStage: "teen", icon: "speech", startAge: 12, ageUnit: "year", alwaysOpen: true, summary: "通过可重复的小场景练习把复杂想法说清楚。" }),
  defineWindow({ slug: "learn-an-instrument", title: "学习一种乐器", category: "experience", lifeStage: "child", icon: "music", startAge: 5, ageUnit: "year", alwaysOpen: true, summary: "早开始有时间优势，晚开始也能获得音乐性与专注体验。" }),
  defineWindow({ slug: "road-trip", title: "一次长途公路旅行", category: "experience", lifeStage: "youth", icon: "compass", startAge: 18, ageUnit: "year", alwaysOpen: true, summary: "让路线、同伴和意外共同塑造一段完整经历。" }),
  defineWindow({ slug: "slow-travel", title: "慢旅行与长期停留", category: "experience", lifeStage: "midlife", icon: "plane", startAge: 50, ageUnit: "year", alwaysOpen: true, featured: true, summary: "用更长停留换取对地方、日常与自己的新理解。" }),
];

export const lifeWindowsV2: LifeWindowV2[] = [
  ...infancy,
  ...childhood,
  ...teen,
  ...education,
  ...career,
  ...body,
  ...family,
  ...experience,
];

export const lifeWindowsBySlug = new Map(lifeWindowsV2.map((window) => [window.slug, window]));

export const featuredLifeWindows = lifeWindowsV2.filter((window) => window.featured);

export const categoryCounts = lifeWindowsV2.reduce<Record<string, number>>((counts, window) => {
  counts[window.category] = (counts[window.category] ?? 0) + 1;
  return counts;
}, {});
