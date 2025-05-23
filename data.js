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

// 25문항 예시 (간단화된 문장 사용)
const questions = [
  { type: "Explorer", text: { ko: "나는 새로운 것을 탐험하는 것을 즐긴다.", en: "I enjoy exploring new things.", de: "Ich entdecke gerne Neues." } },
  { type: "Creator", text: { ko: "나는 무언가를 창조할 때 즐겁다.", en: "I enjoy creating things.", de: "Ich erschaffe gerne Dinge." } },
  { type: "Hero", text: { ko: "나는 도전적인 상황을 즐긴다.", en: "I enjoy challenging situations.", de: "Ich mag Herausforderungen." } },
  { type: "Lover", text: { ko: "나는 감정적 연결을 중시한다.", en: "I value emotional connection.", de: "Ich schätze emotionale Bindung." } },
  { type: "Sage", text: { ko: "나는 지식을 얻는 것을 좋아한다.", en: "I like gaining knowledge.", de: "Ich liebe es, Wissen zu erwerben." } },
  { type: "Caregiver", text: { ko: "나는 다른 사람을 돕고 싶다.", en: "I want to help others.", de: "Ich möchte anderen helfen." } },
  { type: "Ruler", text: { ko: "나는 리더가 되는 것을 좋아한다.", en: "I like being a leader.", de: "Ich übernehme gerne Führungsrollen." } },
  { type: "Jester", text: { ko: "나는 사람을 웃게 하는 것을 좋아한다.", en: "I enjoy making people laugh.", de: "Ich bringe Menschen gerne zum Lachen." } },
  { type: "Innocent", text: { ko: "나는 순수한 마음을 지니고 있다.", en: "I have a pure heart.", de: "Ich habe ein reines Herz." } },
  { type: "Everyman", text: { ko: "나는 모두와 잘 어울린다.", en: "I get along with everyone.", de: "Ich verstehe mich mit allen gut." } },
  { type: "Outlaw", text: { ko: "나는 규칙을 깨는 걸 두려워하지 않는다.", en: "I don't fear breaking rules.", de: "Ich scheue mich nicht, Regeln zu brechen." } },
  { type: "Magician", text: { ko: "나는 세상을 바꾸고 싶다.", en: "I want to change the world.", de: "Ich möchte die Welt verändern." } },
  // 나머지 반복 → 총 25개
];
while (questions.length < 25) {
  questions.push(...questions.slice(0, 12)); // 반복하여 25개 채우기
}
questions.length = 25;

const archetypes = {
  Explorer: {
    emoji: "🧭", color: "#0077cc",
    ko: { name: "탐험가", tone: "도전적", keyword: "자유, 탐험, 새로움", desc: "새로운 환경을 탐색하고 경험하려는 경향", comment: "트렌디 UX 추천", brand: "Patagonia" },
    en: { name: "Explorer", tone: "Adventurous", keyword: "Freedom, Exploration, Novelty", desc: "Seeks to explore and experience new environments", comment: "Trend-focused UX", brand: "Patagonia" },
    de: { name: "Entdecker", tone: "Abenteuerlich", keyword: "Freiheit, Erkundung, Neues", desc: "Möchte neue Umgebungen entdecken", comment: "Trendige UX", brand: "Patagonia" }
  },
  Creator: {
    emoji: "🎨", color: "#9b59b6",
    ko: { name: "창조자", tone: "창의적", keyword: "창작, 예술, 독창성", desc: "새로운 것을 만드는 데서 기쁨을 느끼는 성향", comment: "커스터마이징 제품 적합", brand: "Canva" },
    en: { name: "Creator", tone: "Creative", keyword: "Creation, Art, Originality", desc: "Finds joy in making new things", comment: "Great for custom products", brand: "Canva" },
    de: { name: "Schöpfer", tone: "Kreativ", keyword: "Kreation, Kunst, Originalität", desc: "Hat Freude daran, Neues zu schaffen", comment: "Gut für individuelle Produkte", brand: "Canva" }
  },
  Hero: {
    emoji: "🏅", color: "#e74c3c",
    ko: { name: "영웅", tone: "강인함", keyword: "도전, 성취, 정의", desc: "문제를 해결하고 리드하려는 경향", comment: "미션 중심 캠페인 적합", brand: "Nike" },
    en: { name: "Hero", tone: "Strong", keyword: "Challenge, Achievement, Justice", desc: "Strives to solve problems and lead", comment: "Mission-driven campaigns", brand: "Nike" },
    de: { name: "Held", tone: "Stark", keyword: "Herausforderung, Erfolg, Gerechtigkeit", desc: "Möchte Probleme lösen und führen", comment: "Für zielorientierte Kampagnen", brand: "Nike" }
  },
  Lover: {
    emoji: "💖", color: "#ff69b4",
    ko: { name: "연인", tone: "감성적", keyword: "사랑, 관계, 매력", desc: "감정적 연결과 로맨스를 중시", comment: "감각적 브랜드 경험 추천", brand: "Godiva" },
    en: { name: "Lover", tone: "Romantic", keyword: "Love, Connection, Sensuality", desc: "Values emotional and romantic connections", comment: "Sensory branding", brand: "Godiva" },
    de: { name: "Liebhaber", tone: "Romantisch", keyword: "Liebe, Verbindung, Sinnlichkeit", desc: "Legt Wert auf emotionale Bindung", comment: "Sinnliche Markenführung", brand: "Godiva" }
  },
  Sage: {
    emoji: "📚", color: "#2ecc71",
    ko: { name: "현자", tone: "전문적", keyword: "지식, 분석, 진리", desc: "진리를 추구하고 지식 전달을 중시", comment: "정보 기반 블로그 적합", brand: "TED" },
    en: { name: "Sage", tone: "Wise", keyword: "Knowledge, Insight, Truth", desc: "Seeks and shares wisdom", comment: "Info-based brands", brand: "TED" },
    de: { name: "Weiser", tone: "Weise", keyword: "Wissen, Einsicht, Wahrheit", desc: "Sucht und teilt Weisheit", comment: "Für Wissensmarken", brand: "TED" }
  },
  Caregiver: {
    emoji: "🤝", color: "#f39c12",
    ko: { name: "보호자", tone: "따뜻함", keyword: "보살핌, 배려, 봉사", desc: "다른 사람을 돕고 보호하려는 성향", comment: "CSR, 공공 브랜드 적합", brand: "UNICEF" },
    en: { name: "Caregiver", tone: "Caring", keyword: "Care, Service, Support", desc: "Desires to help and protect others", comment: "CSR-aligned branding", brand: "UNICEF" },
    de: { name: "Helfer", tone: "Fürsorglich", keyword: "Pflege, Dienst, Unterstützung", desc: "Hilft und schützt gerne andere", comment: "Für CSR-orientierte Marken", brand: "UNICEF" }
  },
  Ruler: {
    emoji: "👑", color: "#34495e",
    ko: { name: "통치자", tone: "권위적", keyword: "리더십, 통제, 권력", desc: "권위와 질서를 중시", comment: "프리미엄 제품/리더 브랜드", brand: "Mercedes-Benz" },
    en: { name: "Ruler", tone: "Authoritative", keyword: "Leadership, Control, Power", desc: "Values authority and order", comment: "Premium leadership brands", brand: "Mercedes-Benz" },
    de: { name: "Herrscher", tone: "Autoritär", keyword: "Führung, Kontrolle, Macht", desc: "Schätzt Autorität und Ordnung", comment: "Für Premium-Führungsmarken", brand: "Mercedes-Benz" }
  },
  Jester: {
    emoji: "🤹", color: "#f39cba",
    ko: { name: "광대", tone: "유쾌함", keyword: "재미, 웃음, 자유분방", desc: "즐거움과 유쾌한 분위기를 중시", comment: "이벤트, 즐거운 콘텐츠 적합", brand: "버거킹" },
    en: { name: "Jester", tone: "Playful", keyword: "Fun, Humor, Spontaneity", desc: "Loves humor and fun", comment: "Eventful content fit", brand: "Burger King" },
    de: { name: "Narr", tone: "Verspielt", keyword: "Spaß, Humor, Spontanität", desc: "Liebt Spaß und Unterhaltung", comment: "Für unterhaltsame Inhalte", brand: "Burger King" }
  },
  Innocent: {
    emoji: "🌸", color: "#b0e0e6",
    ko: { name: "순수한 자", tone: "순수함", keyword: "낙관, 선함, 순결", desc: "순수하고 긍정적인 세계관을 지님", comment: "자연주의 브랜드 적합", brand: "Dove" },
    en: { name: "Innocent", tone: "Pure", keyword: "Optimism, Goodness, Simplicity", desc: "Believes in positivity and goodness", comment: "Natural brands", brand: "Dove" },
    de: { name: "Unschuldige", tone: "Rein", keyword: "Optimismus, Güte, Einfachheit", desc: "Glaubt an das Gute", comment: "Für Naturmarken", brand: "Dove" }
  },
  Everyman: {
    emoji: "👨", color: "#95a5a6",
    ko: { name: "평범한 자", tone: "진솔함", keyword: "공감, 소속감, 평등", desc: "보편적 공감과 평등한 태도를 중시", comment: "편의점/일상 브랜드 적합", brand: "IKEA" },
    en: { name: "Everyman", tone: "Relatable", keyword: "Empathy, Belonging, Equality", desc: "Cares about universal belonging", comment: "Daily life brands", brand: "IKEA" },
    de: { name: "Jedermann", tone: "Vertraut", keyword: "Empathie, Zugehörigkeit, Gleichheit", desc: "Stellt das Gemeinsame in den Mittelpunkt", comment: "Alltagsmarken", brand: "IKEA" }
  },
  Outlaw: {
    emoji: "🔥", color: "#8e44ad",
    ko: { name: "반항아", tone: "파격적", keyword: "자유, 규칙파괴, 혁신", desc: "기존을 깨고 새로운 길을 개척함", comment: "강한 브랜딩/개성적 캠페인", brand: "Harley-Davidson" },
    en: { name: "Outlaw", tone: "Rebellious", keyword: "Freedom, Rule-breaking, Innovation", desc: "Breaks the mold, seeks new ways", comment: "Bold brand campaigns", brand: "Harley-Davidson" },
    de: { name: "Rebell", tone: "Rebellisch", keyword: "Freiheit, Regelbruch, Innovation", desc: "Bricht Regeln, sucht neue Wege", comment: "Für starke Marken", brand: "Harley-Davidson" }
  },
  Magician: {
    emoji: "🔮", color: "#9b59b6",
    ko: { name: "마법사", tone: "신비로움", keyword: "변화, 환상, 통찰", desc: "변화를 만들어내는 통찰과 혁신을 중시", comment: "혁신적/미래 지향적 브랜드", brand: "Disney" },
    en: { name: "Magician", tone: "Visionary", keyword: "Transformation, Magic, Insight", desc: "Creates transformation through insight", comment: "Futuristic brands", brand: "Disney" },
    de: { name: "Magier", tone: "Visionär", keyword: "Veränderung, Magie, Einsicht", desc: "Verändert durch Einsicht", comment: "Zukunftsorientierte Marken", brand: "Disney" }
  }
};