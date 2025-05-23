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

const questions = [/* 질문 25개는 생략. 기존 그대로 유지 */];

const archetypes = {
  Explorer: {
    emoji: "🧭",
    color: "#0077cc",
    ko: { name: "탐험가", tone: "도전적 🚀", keyword: "자유, 탐험, 새로움", desc: "...", comment: "...", brand: "Red Bull, Patagonia" },
    en: { name: "Explorer", tone: "Adventurous 🚀", keyword: "Freedom, Exploration, Novelty", desc: "...", comment: "...", brand: "Red Bull, Patagonia" },
    de: { name: "Entdecker", tone: "Abenteuerlich 🚀", keyword: "Freiheit, Entdeckung, Neues", desc: "...", comment: "...", brand: "Red Bull, Patagonia" }
  }
  // 나머지 11개도 같은 방식으로 color 속성 포함하여 추가
};