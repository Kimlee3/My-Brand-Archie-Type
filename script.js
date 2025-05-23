
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quiz-form");
  const resultContainer = document.getElementById("result-container");
  const quizContainer = document.getElementById("quiz-container");
  const resultCard = document.getElementById("result-card");
  const submitBtn = document.getElementById("submit-btn");

  const questions = [
    { text: "나는 새로운 도전을 즐긴다", type: "Explorer" },
    { text: "나는 나만의 무언가를 만들고 싶다", type: "Creator" },
    { text: "나는 목표를 달성하면 성취감을 느낀다", type: "Hero" },
    // ... 총 25개 중 샘플 3개만
  ];

  questions.forEach((q, idx) => {
    const div = document.createElement("div");
    div.innerHTML = `<label>${idx + 1}. ${q.text}</label><br>
      <input type="radio" name="q${idx}" value="1" required> 전혀 아니다
      <input type="radio" name="q${idx}" value="2"> 아니다
      <input type="radio" name="q${idx}" value="3"> 보통이다
      <input type="radio" name="q${idx}" value="4"> 그렇다
      <input type="radio" name="q${idx}" value="5"> 매우 그렇다
    `;
    form.appendChild(div);
  });

  submitBtn.addEventListener("click", () => {
    const scores = {};
    let total = 0;

    questions.forEach((q, idx) => {
      const value = Number(document.querySelector(`input[name="q${idx}"]:checked`)?.value || 0);
      if (!scores[q.type]) scores[q.type] = 0;
      scores[q.type] += value;
    });

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const [main, sub] = sorted;
    const data = archetypes[main[0]];

    quizContainer.classList.add("hidden");
    resultContainer.classList.remove("hidden");

    resultCard.innerHTML = `
      <h2>${data.emoji} ${main[0]} 타입</h2>
      <p>🎯 <strong>메인 아키타입:</strong> ${main[0]} ${data.emoji}</p>
      <p>💬 <strong>브랜드 톤:</strong> ${data.tone}</p>
      <p>🧠 <strong>키워드:</strong> ${data.keyword}</p>
      <p>📖 <strong>설명:</strong><br>${data.desc}</p>
      <p>💡 <strong>실무 코멘트:</strong><br>${data.comment}</p>
      <p>🔍 <strong>대표 브랜드:</strong> ${data.brand}</p>
    `;
  });

  document.getElementById("download-btn").addEventListener("click", () => {
    html2canvas(document.getElementById("result-card")).then(canvas => {
      const link = document.createElement("a");
      link.download = "archetype_result.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  });
});
