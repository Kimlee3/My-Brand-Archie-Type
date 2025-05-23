const lang = localStorage.getItem("lang") || "ko";

const uiText = {
  title: {
    ko: "브랜드 아키타입 테스트",
    en: "Brand Archetype Test",
    de: "Marken-Archetypen-Test"
  },
  submit: {
    ko: "제출",
    en: "Submit",
    de: "Absenden"
  }
};

const questions = [
  { type: "Explorer", text: { ko: "나는 새로운 환경을 탐험하는 것을 즐긴다.", en: "I enjoy exploring new environments.", de: "Ich erkunde gerne neue Umgebungen." } },
  { type: "Creator", text: { ko: "나는 감정과 미적 감각을 표현하는 것을 좋아한다.", en: "I like to express emotions and aesthetics.", de: "Ich drücke gerne Emotionen und Ästhetik aus." } },
  { type: "Hero", text: { ko: "나는 명확한 목표를 세우고 도전하는 것을 즐긴다.", en: "I enjoy setting clear goals and challenges.", de: "Ich setze mir gerne klare Ziele und Herausforderungen." } },
  { type: "Lover", text: { ko: "나는 사람들과 깊은 관계를 맺고 싶어 한다.", en: "I seek deep relationships with others.", de: "Ich strebe nach tiefen Beziehungen zu anderen." } },
  { type: "Sage", text: { ko: "나는 지식을 추구하고 진리를 알고 싶다.", en: "I seek knowledge and truth.", de: "Ich strebe nach Wissen und Wahrheit." } },
  { type: "Caregiver", text: { ko: "나는 다른 사람을 돕는 것이 중요하다고 느낀다.", en: "I believe helping others is important.", de: "Ich glaube, dass es wichtig ist, anderen zu helfen." } },
  { type: "Ruler", text: { ko: "나는 질서를 유지하고 책임을 지는 것을 선호한다.", en: "I prefer maintaining order and taking responsibility.", de: "Ich bevorzuge es, Ordnung zu wahren und Verantwortung zu übernehmen." } },
  { type: "Jester", text: { ko: "나는 유머와 즐거움을 중요하게 생각한다.", en: "I value humor and joy.", de: "Ich schätze Humor und Freude." } },
  { type: "Innocent", text: { ko: "나는 순수하고 긍정적인 세상을 원한다.", en: "I want a pure and positive world.", de: "Ich wünsche mir eine reine und positive Welt." } },
  { type: "Everyman", text: { ko: "나는 평범하고 친근한 삶을 추구한다.", en: "I seek a simple and relatable life.", de: "Ich strebe ein einfaches und zugängliches Leben an." } },
  { type: "Rebel", text: { ko: "나는 기존 규칙을 깨고 싶을 때가 있다.", en: "I sometimes want to break the rules.", de: "Manchmal möchte ich die Regeln brechen." } },
  { type: "Magician", text: { ko: "나는 세상을 변화시키고 싶다.", en: "I want to change the world.", de: "Ich möchte die Welt verändern." } },
  { type: "Explorer", text: { ko: "나는 변화를 두려워하지 않는다.", en: "I am not afraid of change.", de: "Ich habe keine Angst vor Veränderungen." } },
  { type: "Creator", text: { ko: "나는 무언가를 창조할 때 행복을 느낀다.", en: "I feel happy when I create something.", de: "Ich bin glücklich, wenn ich etwas kreiere." } },
  { type: "Hero", text: { ko: "나는 어려움을 극복할 수 있다고 믿는다.", en: "I believe I can overcome challenges.", de: "Ich glaube, ich kann Herausforderungen meistern." } },
  { type: "Lover", text: { ko: "나는 감정적 연결이 중요하다고 생각한다.", en: "I believe emotional connection is important.", de: "Ich halte emotionale Verbundenheit für wichtig." } },
  { type: "Sage", text: { ko: "나는 세상에 대해 배우는 걸 좋아한다.", en: "I enjoy learning about the world.", de: "Ich lerne gerne über die Welt." } },
  { type: "Caregiver", text: { ko: "나는 타인을 보호하는 것이 나의 역할이라고 느낀다.", en: "I feel it's my role to protect others.", de: "Ich habe das Gefühl, dass es meine Aufgabe ist, andere zu schützen." } },
  { type: "Ruler", text: { ko: "나는 리더로서 행동하는 것을 편안하게 느낀다.", en: "I feel comfortable acting as a leader.", de: "Ich fühle mich wohl in der Rolle eines Anführers." } },
  { type: "Jester", text: { ko: "나는 웃음으로 사람들과 교류하길 좋아한다.", en: "I enjoy connecting with people through laughter.", de: "Ich kommuniziere gerne mit Menschen durch Lachen." } },
  { type: "Innocent", text: { ko: "나는 선함이 결국 승리한다고 믿는다.", en: "I believe goodness ultimately wins.", de: "Ich glaube, dass Güte letztendlich siegt." } },
  { type: "Everyman", text: { ko: "나는 누구나 이해할 수 있는 메시지를 선호한다.", en: "I prefer messages everyone can relate to.", de: "Ich bevorzuge Botschaften, die jeder verstehen kann." } },
  { type: "Rebel", text: { ko: "나는 현상 유지보다는 혁신을 선호한다.", en: "I prefer innovation over the status quo.", de: "Ich bevorzuge Innovation gegenüber dem Status quo." } },
  { type: "Magician", text: { ko: "나는 창의적인 아이디어로 변화를 만들고 싶다.", en: "I want to create change through creative ideas.", de: "Ich möchte mit kreativen Ideen Veränderungen schaffen." } },
  { type: "Explorer", text: { ko: "나는 반복적인 일보다 새로운 도전을 선호한다.", en: "I prefer new challenges over routine.", de: "Ich bevorzuge neue Herausforderungen gegenüber Routinen." } }
];

const archetypes = {
  Explorer: {
    emoji: "🧭",
    ko: { name: "탐험가", tone: "도전적 🚀", keyword: "자유, 탐험, 새로움", desc: "...", comment: "...", brand: "Red Bull, Patagonia" },
    en: { name: "Explorer", tone: "Adventurous 🚀", keyword: "Freedom, Exploration, Novelty", desc: "...", comment: "...", brand: "Red Bull, Patagonia" },
    de: { name: "Entdecker", tone: "Abenteuerlich 🚀", keyword: "Freiheit, Entdeckung, Neues", desc: "...", comment: "...", brand: "Red Bull, Patagonia" }
  }
  // 11개 더 추가 가능
};