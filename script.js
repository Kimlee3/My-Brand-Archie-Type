// 완전 작동하는 통합 script.js 코드

let currentPage = 0;
const pageSize = 5;
let userAnswers = []; // 사용자의 응답을 저장할 배열 추가

const form = document.getElementById("quiz-form");
const submitBtn = document.getElementById("submit-btn");
const quizContainer = document.getElementById("quiz-container");
const resultContainer = document.getElementById("result-container");
const resultCard = document.getElementById("result-card");

function renderUI() {
  const langLabel = document.querySelector("label[for='lang-select']");
  const lang = localStorage.getItem("lang") || "ko";
  if (langLabel) {
    langLabel.innerText = lang === "en" ? "Language" : lang === "de" ? "Sprache" : "언어";
  }
  
  // 페이지 타이틀 설정
  const pageTitle = document.getElementById("page-title");
  if (pageTitle) {
    pageTitle.textContent = uiText.title[lang];
  }
  
  // 제출 버튼 텍스트 설정
  if (submitBtn) {
    submitBtn.textContent = uiText.submit[lang];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const lang = localStorage.getItem("lang") || "ko";
  const langSelect = document.getElementById("lang-select");
  if (langSelect) {
    langSelect.value = lang;
    renderUI();

    langSelect.addEventListener("change", e => {
      const newLang = e.target.value;
      localStorage.setItem("lang", newLang);
      location.reload();
    });
  }

  submitBtn.addEventListener("click", (event) => {
    event.preventDefault(); // 폼 제출의 기본 동작 방지

    // 제출 전에 현재 페이지의 응답을 저장
    saveAnswers();

    const firstUnanswered = questions.findIndex((q, idx) => {
      // 저장된 응답 배열에서 해당 질문의 응답이 있는지 확인
      return userAnswers[idx] === undefined || userAnswers[idx] === null;
    });

    if (firstUnanswered !== -1) {
      const page = Math.floor(firstUnanswered / pageSize);
      currentPage = page;
      renderQuestions(); // 해당 페이지로 이동하며 다시 렌더링
      setTimeout(() => {
        const el = document.getElementById(`question-${firstUnanswered}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        alert("📝 모든 질문에 응답해주세요. 미응답 항목으로 이동했습니다.");
      }, 100);
      return;
    }

    const scores = {};
    // userAnswers 배열을 사용하여 최종 점수 계산
    userAnswers.forEach((answer, idx) => {
      if (answer !== undefined && answer !== null) {
        const questionType = questions[idx].type;
        if (!scores[questionType]) scores[questionType] = 0;
        scores[questionType] += answer;
      }
    });

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    if (sorted.length === 0) {
      alert("점수 계산 오류가 발생했습니다.");
      return;
    }

    const [main, sub] = sorted;
    const mainType = main[0];
    const subType = sub[0];

    if (!archetypes[mainType] || !archetypes[mainType][lang]) {
      alert("아키타입 데이터를 찾을 수 없습니다.");
      return;
    }

    const mainData = archetypes[mainType][lang];
    const subData = archetypes[subType][lang];

    quizContainer.classList.add("hidden");
    resultContainer.classList.remove("hidden");

    const cardStyle = `border-left: 8px solid ${archetypes[mainType].color}; padding: 20px; border-radius: 8px;`;
    const escapedDesc = (mainData.desc || '').replace(/`/g, '\`').replace(/\${/g, '\${');
    const escapedComment = (mainData.comment || '').replace(/`/g, '\`').replace(/\${/g, '\${');

    resultCard.innerHTML = `
      <div style="${cardStyle}">
        <h2>${archetypes[mainType].emoji || ''} ${mainData.name || ''} 타입</h2>
        <p>🎯 <strong>메인 아키타입:</strong> ${mainData.name || ''} ${archetypes[mainType].emoji || ''}</p>
        <p>🪄 <strong>서브 아키타입:</strong> ${subData.name || ''} ${archetypes[subType].emoji || ''}</p>
        <p>💬 <strong>브랜드 톤:</strong> ${mainData.tone || ''}</p>
        <p>🧠 <strong>키워드:</strong> ${mainData.keyword || ''}</p>
        <p>📖 <strong>설명:</strong><br>${escapedDesc}</p>
        <p>💡 <strong>실무 코멘트:</strong><br>${escapedComment}</p>
        <p>🔍 <strong>대표 브랜드:</strong> ${mainData.brand || ''}</p>
        <h3>📘 브랜드 아키타입 전체 구조</h3>
        <img src="archetype-wheel.png" style="max-width:100%; margin-top:20px;" />
      </div>
    `;

    window.mainArchetype = mainType;
    window.subArchetype = subType;
  });

  const downloadBtn = document.getElementById("download-btn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      html2canvas(document.getElementById("result-card")).then(canvas => {
        const link = document.createElement("a");
        link.download = "archetype_result.png";
        link.href = canvas.toDataURL();
        link.click();
      });
    });
  }

  renderQuestions();
});

// 현재 페이지의 응답을 userAnswers 배열에 저장하는 함수
function saveAnswers() {
  const start = currentPage * pageSize;
  const end = start + pageSize;
  for (let i = start; i < end && i < questions.length; i++) {
    const selectedInput = document.querySelector(`input[name="q${i}"]:checked`);
    if (selectedInput) {
      userAnswers[i] = Number(selectedInput.value);
    } else {
      // 응답하지 않은 질문은 undefined 또는 null로 유지
      userAnswers[i] = undefined; // 또는 null
    }
  }
}

function renderQuestions() {
  // 페이지 이동 시 현재 페이지 응답 저장
  // saveAnswers(); // <-- 이 위치에서 saveAnswers 호출

  form.innerHTML = ""; // 폼 내용 초기화

  const lang = localStorage.getItem("lang") || "ko";
  const start = currentPage * pageSize;
  const end = start + pageSize;
  const currentQuestions = questions.slice(start, end);

  currentQuestions.forEach((q, idx) => {
    const index = start + idx;
    const div = document.createElement("div");
    div.setAttribute("id", `question-${index}`);
    let html = `<p><strong>${index + 1}. ${q.text[lang]}</strong></p>`;
    for (let i = 1; i <= 5; i++) {
      // 저장된 응답이 있다면 해당 라디오 버튼을 checked 상태로 표시
      const checked = userAnswers[index] === i ? "checked" : "";
      html += `
        <label style="margin-right: 12px;">
          <input type="radio" name="q${index}" value="${i}" ${checked} required> ${i}점
        </label>
      `;
    }
    div.innerHTML = html;
    form.appendChild(div);
  });

  const nav = document.createElement("div");
  nav.classList.add("nav-buttons");
  if (currentPage > 0) {
    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.textContent = "◀ 이전";
    prevBtn.onclick = () => {
      // 이전 페이지 이동 시 응답 저장 후 페이지 변경
      saveAnswers(); // <-- 이 위치에서 saveAnswers 호출
      currentPage--;
      renderQuestions();
    };
    nav.appendChild(prevBtn);
  }
  if ((currentPage + 1) * pageSize < questions.length) {
    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.textContent = "다음 ▶";
    nextBtn.onclick = () => {
      // 다음 페이지 이동 시 응답 저장 후 페이지 변경
      saveAnswers(); // <-- 이 위치에서 saveAnswers 호출
      currentPage++;
      renderQuestions();
    };
    nav.appendChild(nextBtn);
  } else {
    nav.appendChild(submitBtn);
  }
  form.appendChild(nav);
}
