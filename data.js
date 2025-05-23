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
    ko: {
      name: "탐험가",
      tone: "도전적",
      keyword: "자유, 탐험, 새로움",
      desc: "자유와 독립을 추구하며 새로운 환경을 탐색하고 경험하려는 경향",
      comment: "신제품에 대한 호기심, 트렌디한 UX 선호. 모험적 브랜드 메시지 추천",
      brand: "Patagonia"
    },
    en: { name: "Explorer", tone: "Adventurous", keyword: "Freedom, Exploration, Novelty", desc: "Seeks to explore and experience new environments", comment: "Trend-focused UX", brand: "Patagonia" },
    de: { name: "Entdecker", tone: "Abenteuerlich", keyword: "Freiheit, Erkundung, Neues", desc: "Möchte neue Umgebungen entdecken", comment: "Trendige UX", brand: "Patagonia" }
  },
  Creator: {
    emoji: "🎨", color: "#9b59b6",
    ko: {
      name: "창조자",
      tone: "창의적",
      keyword: "창작, 예술, 독창성",
      desc: "새로운 것을 만드는 데서 기쁨을 느끼는 성향",
      comment: "감성적 디자인, 제품 커스터마이징 강점. 예술/디자인 중심 제품 적합",
      brand: "Canva"
    },
    en: { name: "Creator", tone: "Creative", keyword: "Creation, Art, Originality", desc: "Finds joy in making new things", comment: "Great for custom products", brand: "Canva" },
    de: { name: "Schöpfer", tone: "Kreativ", keyword: "Kreation, Kunst, Originalität", desc: "Hat Freude daran, Neues zu schaffen", comment: "Gut für individuelle Produkte", brand: "Canva" }
  },
  Hero: {
    emoji: "🏅", color: "#e74c3c",
    ko: {
      name: "영웅",
      tone: "강인함",
      keyword: "도전, 성취, 정의",
      desc: "문제를 해결하고 성취를 통해 세상을 바꾸려는 의지",
      comment: "도전 메시지, 성취 사례 중심 콘텐츠. 목표달성형 브랜드 적합",
      brand: "Nike, Adidas"
    },
    en: { name: "Hero", tone: "Strong", keyword: "Challenge, Achievement, Justice", desc: "Strives to solve problems and lead", comment: "Mission-driven campaigns", brand: "Nike" },
    de: { name: "Held", tone: "Stark", keyword: "Herausforderung, Erfolg, Gerechtigkeit", desc: "Möchte Probleme lösen und führen", comment: "Für zielorientierte Kampagnen", brand: "Nike" }
  },
  Lover: {
    emoji: "💖", color: "#ff69b4",
    ko: {
      name: "연인",
      tone: "감성적",
      keyword: "사랑, 관계, 매력",
      desc: "감정적 연결과 관계의 깊이를 중시하는 따뜻하고 열정적인 성격",
      comment: "감각적 브랜드 경험 추천. 심미적, 향기, 맛, 소리 등 오감 활용",
      brand: "Godiva, Dior"
    },
    en: { name: "Lover", tone: "Romantic", keyword: "Love, Connection, Sensuality", desc: "Values emotional and romantic connections", comment: "Sensory branding", brand: "Godiva" },
    de: { name: "Liebhaber", tone: "Romantisch", keyword: "Liebe, Verbindung, Sinnlichkeit", desc: "Legt Wert auf emotionale Bindung", comment: "Sinnliche Markenführung", brand: "Godiva" }
  },
  Sage: {
    emoji: "📚", color: "#2ecc71",
    ko: {
      name: "현자",
      tone: "전문적",
      keyword: "지식, 분석, 진리",
      desc: "진리를 추구하고 지식 전달을 중시하며 세상을 이해하려는 성향",
      comment: "정보 콘텐츠 강점. 블로그/백서/전문자료 제공 브랜드에 적합",
      brand: "Coursera, TED"
    },
    en: { name: "Sage", tone: "Wise", keyword: "Knowledge, Insight, Truth", desc: "Seeks and shares wisdom", comment: "Info-based brands", brand: "TED" },
    de: { name: "Weiser", tone: "Weise", keyword: "Wissen, Einsicht, Wahrheit", desc: "Sucht und teilt Weisheit", comment: "Für Wissensmarken", brand: "TED" }
  },
  Caregiver: {
    emoji: "🤝", color: "#f39c12",
    ko: {
      name: "보호자",
      tone: "따뜻함",
      keyword: "보살핌, 배려, 봉사",
      desc: "타인을 돕고 보호하는 데서 의미를 찾는 따뜻한 성향",
      comment: "고객지원 강화, CSR 캠페인 적합. 정서적 브랜드 충성도 유도",
      brand: "Samsung CSR, UNICEF"
    },
    en: { name: "Caregiver", tone: "Caring", keyword: "Care, Service, Support", desc: "Desires to help and protect others", comment: "CSR-aligned branding", brand: "UNICEF" },
    de: { name: "Helfer", tone: "Fürsorglich", keyword: "Pflege, Dienst, Unterstützung", desc: "Hilft und schützt gerne andere", comment: "Für CSR-orientierte Marken", brand: "UNICEF" }
  },
  Ruler: {
    emoji: "👑", color: "#34495e",
    ko: {
      name: "통치자",
      tone: "권위적",
      keyword: "리더십, 통제, 권력",
      desc: "질서와 통제를 중시하며 리더십과 권위를 지향",
      comment: "프리미엄 전략, 신뢰 강점. 정부-금융-고가 브랜드에 적합",
      brand: "Rolex, Mercedes-Benz"
    },
    en: { name: "Ruler", tone: "Authoritative", keyword: "Leadership, Control, Power", desc: "Values authority and order", comment: "Premium leadership brands", brand: "Mercedes-Benz" },
    de: { name: "Herrscher", tone: "Autoritär", keyword: "Führung, Kontrolle, Macht", desc: "Schätzt Autorität und Ordnung", comment: "Für Premium-Führungsmarken", brand: "Mercedes-Benz" }
  },
  Jester: {
    emoji: "🤹", color: "#f39cba",
    ko: {
      name: "광대",
      tone: "유쾌함",
      keyword: "재미, 웃음, 자유분방",
      desc: "유쾌함과 웃음을 통해 즐거운 분위기를 만드는 사람",
      comment: "이벤트, 즐거운 콘텐츠 추천, 할인 메시지에 강점",
      brand: "버거킹, 요기요"
    },
    en: { name: "Jester", tone: "Playful", keyword: "Fun, Humor, Spontaneity", desc: "Loves humor and fun", comment: "Eventful content fit", brand: "Burger King" },
    de: { name: "Narr", tone: "Verspielt", keyword: "Spaß, Humor, Spontanität", desc: "Liebt Spaß und Unterhaltung", comment: "Für unterhaltsame Inhalte", brand: "Burger King" }
  },
  Innocent: {
    emoji: "🌸", color: "#b0e0e6",
    ko: {
      name: "순수한 자",
      tone: "순수함",
      keyword: "낙관, 선함, 순결",
      desc: "낙관적 관점을 유지하는 천진난만한 성격",
      comment: "자연주의/키즈 브랜드 적합. 친환경 소재-순한 이미지 강점",
      brand: "Dove, The Honest Company, Innocent Drinks"
    },
    en: { name: "Innocent", tone: "Pure", keyword: "Optimism, Goodness, Simplicity", desc: "Believes in positivity and goodness", comment: "Natural brands", brand: "Dove" },
    de: { name: "Unschuldige", tone: "Rein", keyword: "Optimismus, Güte, Einfachheit", desc: "Glaubt an das Gute", comment: "Für Naturmarken", brand: "Dove" }
  },
  Everyman: {
    emoji: "👨", color: "#95a5a6",
    ko: {
      name: "평범한 자",
      tone: "진솔함",
      keyword: "공감, 소속감, 평등",
      desc: "보편적 공감과 평등한 태도를 중시",
      comment: "실용성 강조, 홈쇼핑/대중형 브랜드 적합. 쿠팡-이마트형 톤",
      brand: "IKEA, Coupang"
    },
    en: { name: "Everyman", tone: "Relatable", keyword: "Empathy, Belonging, Equality", desc: "Cares about universal belonging", comment: "Daily life brands", brand: "IKEA" },
    de: { name: "Jedermann", tone: "Vertraut", keyword: "Empathie, Zugehörigkeit, Gleichheit", desc: "Stellt das Gemeinsame in den Mittelpunkt", comment: "Alltagsmarken", brand: "IKEA" }
  },
  Outlaw: {
    emoji: "🔥", color: "#8e44ad",
    ko: {
      name: "반항아",
      tone: "파격적",
      keyword: "자유, 규칙파괴, 혁신",
      desc: "기존 틀을 깨고 새로운 길을 개척하며 변화를 주도하는 성격",
      comment: "차별화 전략 필수. 파격 슬로건, 니치 타겟에 어필. 강한 세계관 활용",
      brand: "Harley-Davidson, Diesel"
    },
    en: { name: "Outlaw", tone: "Rebellious", keyword: "Freedom, Rule-breaking, Innovation", desc: "Breaks the mold, seeks new ways", comment: "Bold brand campaigns", brand: "Harley-Davidson" },
    de: { name: "Rebell", tone: "Rebellisch", keyword: "Freiheit, Regelbruch, Innovation", desc: "Bricht Regeln, sucht neue Wege", comment: "Für starke Marken", brand: "Harley-Davidson" }
  },
  Magician: {
    emoji: "🔮", color: "#9b59b6",
    ko: {
      name: "마법사",
      tone: "신비로움",
      keyword: "변화, 환상, 통찰",
      desc: "변화를 만들어내는 통찰과 혁신을 중시하는 비전을 가진 성격",
      comment: "경험으로 변화 유도. 브랜드를 통해 '변화된 나' 강조. 에어비앤비 톤",
      brand: "Disney, Airbnb, Tesla"
    },
    en: { name: "Magician", tone: "Visionary", keyword: "Transformation, Magic, Insight", desc: "Creates transformation through insight", comment: "Futuristic brands", brand: "Disney" },
    de: { name: "Magier", tone: "Visionär", keyword: "Veränderung, Magie, Einsicht", desc: "Verändert durch Einsicht", comment: "Zukunftsorientierte Marken", brand: "Disney" }
  }
};
