document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quiz-form");
  const resultContainer = document.getElementById("result-container");
  const quizContainer = document.getElementById("quiz-container");
  const resultCard = document.getElementById("result-card");
  const submitBtn = document.getElementById("submit-btn");

  const questions = [
    { text: "나는 새로운 환경을 탐험하는 것을 즐긴다", type: "Explorer" },
    { text: "나는 감정과 미적 감각을 표현하는 것을 좋아한다", type: "Creator" },
    { text: "나는 명확한 목표를 세우고 도전하는 것을 즐긴다", type: "Hero" },
    { text: "나는 사람들과 깊은 관계를 맺는 걸 중요하게 생각한다", type: "Lover" },
    { text: "나는 지식과 정보를 탐구하는 걸 즐긴다", type: "Sage" },
    { text: "나는 다른 사람을 도와주는 일에 보람을 느낀다", type: "Caregiver" },
    { text: "나는 책임감 있게 통제하는 것을 잘한다", type: "Ruler" },
    { text: "나는 세상을 밝게 만드는 유쾌함을 중요시한다", type: "Jester" },
    { text: "나는 순수한 마음으로 긍정적인 삶을 추구한다", type: "Innocent" },
    { text: "나는 일상 속의 소소한 행복을 중요하게 여긴다", type: "Everyman" },
    { text: "나는 기존의 질서에 반기를 들고 싶을 때가 있다", type: "Rebel" },
    { text: "나는 세상을 변화시키고 싶은 욕망이 있다", type: "Magician" },
    { text: "나는 변화를 두려워하지 않는다", type: "Explorer" },
    { text: "나는 예술, 음악, 창작 활동에 끌린다", type: "Creator" },
    { text: "나는 강한 리더십을 발휘하고 싶다", type: "Hero" },
    { text: "나는 감정적으로 연결되는 것을 좋아한다", type: "Lover" },
    { text: "나는 항상 ‘왜?’를 묻는다", type: "Sage" },
    { text: "나는 봉사나 돌봄에 관심이 많다", type: "Caregiver" },
    { text: "나는 내가 통제하는 시스템을 좋아한다", type: "Ruler" },
    { text: "나는 즐거운 농담과 유머를 즐긴다", type: "Jester" },
    { text: "나는 세상이 좀 더 순수했으면 좋겠다", type: "Innocent" },
    { text: "나는 평범함 속의 안정감을 좋아한다", type: "Everyman" },
    { text: "나는 변화를 이끄는 사람이 되고 싶다", type: "Magician" },
    { text: "나는 강렬한 한 방이 있어야 한다고 생각한다", type: "Rebel" },
    { text: "나는 일상이 너무 똑같으면 질린다", type: "Explorer" }
  ];

  // 설문 문항 생성
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

  // 결과 계산 및 표시
  submitBtn.addEventListener("click", () => {
    const scores = {};
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
      <p>🪄 <strong>서브 아키타입:</strong> ${sub[0]} ${archetypes[sub[0]].emoji}</p>
      <p>💬 <strong>브랜드 톤:</strong> ${data.tone}</p>
      <p>🧠 <strong>키워드:</strong> ${data.keyword}</p>
      <p>📖 <strong>설명:</strong><br>${data.desc}</p>
      <p>💡 <strong>실무 코멘트:</strong><br>${data.comment}</p>
      <p>🔍 <strong>대표 브랜드:</strong> ${data.brand}</p>
      <h3>📘 브랜드 아키타입 전체 구조</h3>
      <img src="archetype-wheel.png" alt="아키타입 휠" style="max-width:100%; margin-top:20px; border-radius:8px;" />
    `;
  });

  // 이미지 저장 기능
  document.getElementById("download-btn").addEventListener("click", () => {
    html2canvas(document.getElementById("result-card")).then(canvas => {
      const link = document.createElement("a");
      link.download = "archetype_result.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  });
});
