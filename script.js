// 완전 작동하는 통합 script.js 코드

function renderUI() {
  const langLabel = document.querySelector("label[for='lang-select']");
  const lang = localStorage.getItem("lang") || "ko";
  if (langLabel) {
    langLabel.innerText = lang === "en" ? "Language" : lang === "de" ? "Sprache" : "언어";
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

  submitBtn.addEventListener("click", () => {
    const firstUnanswered = questions.findIndex((q, idx) => {
      return !document.querySelector(`input[name="q${idx}"]:checked`);
    });

    if (firstUnanswered !== -1) {
      const page = Math.floor(firstUnanswered / pageSize);
      currentPage = page;
      renderQuestions();
      setTimeout(() => {
        const el = document.getElementById(`question-${firstUnanswered}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        alert("📝 모든 질문에 응답해주세요. 미응답 항목으로 이동했습니다.");
      }, 100);
      return;
    }

    const scores = {};
    questions.forEach((q, idx) => {
      const val = Number(document.querySelector(`input[name="q${idx}"]:checked`)?.value || 0);
      if (!scores[q.type]) scores[q.type] = 0;
      scores[q.type] += val;
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

    const cardStyle = `border-left: 8px solid ${archetypes[mainType].color}; padding: 20px; background-color: #fdfdfd; border-radius: 8px;`;
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

        <div id="share-section" style="margin-top: 24px;">
          <p>📤 결과 공유하기:</p>
          <button onclick="copyLink()">🔗 링크 복사</button>
          <a href="#" id="twitter-share" target="_blank">🐦 트위터</a>
          <a href="#" id="facebook-share" target="_blank">📘 페이스북</a>
        </div>
      </div>
    `;

    window.mainArchetype = mainType;
    window.subArchetype = subType;
    updateShareLinks(mainType, subType);
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

function renderQuestions() {
  form.innerHTML = "";
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
      html += `
        <label style="margin-right: 12px;">
          <input type="radio" name="q${index}" value="${i}" required> ${i}점
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
      currentPage++;
      renderQuestions();
    };
    nav.appendChild(nextBtn);
  } else {
    nav.appendChild(submitBtn);
  }
  form.appendChild(nav);
}

function updateShareLinks(mainType, subType) {
  const baseUrl = window.location.origin + "/result.html";
  const resultLink = `${baseUrl}?result=${mainType}-${subType}&lang=${localStorage.getItem("lang") || "ko"}`;
  const message = `${mainType}와 ${subType} 유형 결과를 확인해보세요!`;

  const twitter = document.getElementById("twitter-share");
  const facebook = document.getElementById("facebook-share");

  if (twitter && facebook) {
    twitter.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(resultLink)}`;
    facebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(resultLink)}`;
  }
}

function copyLink() {
  const baseUrl = window.location.origin + "/result.html";
  const resultLink = `${baseUrl}?result=${window.mainArchetype}-${window.subArchetype}&lang=${localStorage.getItem("lang") || "ko"}`;
  navigator.clipboard.writeText(resultLink).then(() => {
    alert("🔗 링크가 복사되었습니다!");
  });
}
