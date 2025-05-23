document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quiz-form");
  const resultCard = document.getElementById("result-card");
  const quizContainer = document.getElementById("quiz-container");
  const resultContainer = document.getElementById("result-container");
  const submitBtn = document.getElementById("submit-btn");
  const titleEl = document.getElementById("page-title");
  const langSelect = document.getElementById("lang-select");

  let currentLang = localStorage.getItem("lang") || "ko";

  // UI 렌더링
  function renderUI() {
    titleEl.textContent = uiText.title[currentLang];
    submitBtn.textContent = uiText.submit[currentLang];
    form.innerHTML = "";

    questions.forEach((q, idx) => {
      const div = document.createElement("div");
      div.innerHTML = `<label>${idx + 1}. ${q.text[currentLang]}</label><br>
        <input type="radio" name="q${idx}" value="1" required> 1
        <input type="radio" name="q${idx}" value="2"> 2
        <input type="radio" name="q${idx}" value="3"> 3
        <input type="radio" name="q${idx}" value="4"> 4
        <input type="radio" name="q${idx}" value="5"> 5
      `;
      form.appendChild(div);
    });
  }

  // 초기 렌더
  langSelect.value = currentLang;
  renderUI();

  // 언어 변경 시
  langSelect.addEventListener("change", e => {
    currentLang = e.target.value;
    localStorage.setItem("lang", currentLang);
    renderUI();
  });

  // 제출 시 결과 계산
  submitBtn.addEventListener("click", () => {
    const scores = {};
    questions.forEach((q, idx) => {
      const val = Number(document.querySelector(`input[name="q${idx}"]:checked`)?.value || 0);
      if (!scores[q.type]) scores[q.type] = 0;
      scores[q.type] += val;
    });

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const [main, sub] = sorted;
    const mainData = archetypes[main[0]][currentLang];
    const subData = archetypes[sub[0]][currentLang];

    quizContainer.classList.add("hidden");
    resultContainer.classList.remove("hidden");

    resultCard.innerHTML = `
      <h2>${archetypes[main[0]].emoji} ${mainData.name} 타입</h2>
      <p>🎯 <strong>메인 아키타입:</strong> ${mainData.name} ${archetypes[main[0]].emoji}</p>
      <p>🪄 <strong>서브 아키타입:</strong> ${subData.name} ${archetypes[sub[0]].emoji}</p>
      <p>💬 <strong>브랜드 톤:</strong> ${mainData.tone}</p>
      <p>🧠 <strong>키워드:</strong> ${mainData.keyword}</p>
      <p>📖 <strong>설명:</strong><br>${mainData.desc}</p>
      <p>💡 <strong>실무 코멘트:</strong><br>${mainData.comment}</p>
      <p>🔍 <strong>대표 브랜드:</strong> ${mainData.brand}</p>
      <h3>📘 브랜드 아키타입 전체 구조</h3>
      <img src="archetype-wheel.png" style="max-width:100%; margin-top:20px;" />
    `;
  });

  // 이미지 저장
  document.getElementById("download-btn").addEventListener("click", () => {
    html2canvas(document.getElementById("result-card")).then(canvas => {
      const link = document.createElement("a");
      link.download = "archetype_result.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  });
});