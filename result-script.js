document.addEventListener("DOMContentLoaded", () => {
  const resultCard = document.getElementById("result-card");
  const params = new URLSearchParams(window.location.search);
  const main = params.get("result")?.split("-")[0];
  const sub = params.get("result")?.split("-")[1];
  const lang = params.get("lang") || "ko";

  if (!main || !sub || !archetypes[main] || !archetypes[sub]) {
    resultCard.innerHTML = "<p>❌ 유효하지 않은 결과 링크입니다.</p>";
    return;
  }

  const mainData = archetypes[main][lang];
  const subData = archetypes[sub][lang];
  const emoji = archetypes[main].emoji;
  const cardStyle = `border-left: 8px solid ${archetypes[main].color}; padding: 20px; background-color: #fdfdfd; border-radius: 8px;`;

  resultCard.innerHTML = `
    <div style="${cardStyle}">
      <h2>${emoji} ${mainData.name} 타입</h2>
      <p>🎯 <strong>메인 아키타입:</strong> ${mainData.name} ${emoji}</p>
      <p>🪄 <strong>서브 아키타입:</strong> ${subData.name} ${archetypes[sub].emoji}</p>
      <p>💬 <strong>브랜드 톤:</strong> ${mainData.tone}</p>
      <p>🧠 <strong>키워드:</strong> ${mainData.keyword}</p>
      <p>📖 <strong>설명:</strong><br>${mainData.desc}</p>
      <p>💡 <strong>실무 코멘트:</strong><br>${mainData.comment}</p>
      <p>🔍 <strong>대표 브랜드:</strong> ${mainData.brand}</p>
      <h3>📘 브랜드 아키타입 전체 구조</h3>
      <img src="archetype-wheel.png" style="max-width:100%; margin-top:20px;" />
    </div>
  `;
});