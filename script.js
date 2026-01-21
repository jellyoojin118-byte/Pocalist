/* =========================
   기본 상태
========================= */
let isAdmin = false;
const ADMIN_PASSWORD = "0000";

let pocas = JSON.parse(localStorage.getItem("pocas") || "[]");
let currentMember = "전체";

/* =========================
   DOM
========================= */
const pocaGrid = document.querySelector(".poca-grid");
const addBtn = document.querySelector(".fab.add");
const adminBtn = document.querySelector(".fab.admin");
const searchInput = document.querySelector(".search-wrap input");
const members = document.querySelectorAll(".member");

/* =========================
   렌더링
========================= */
function render() {
  pocaGrid.innerHTML = "";
  const keyword = searchInput.value.toLowerCase();

  pocas
    .filter(p =>
      (currentMember === "전체" || p.member === currentMember) &&
      p.album.toLowerCase().includes(keyword)
    )
    .forEach((p, index) => {
      const card = document.createElement("div");
      card.className = "poca-card";
      card.style.backgroundImage = `url(${p.image})`;
      card.style.backgroundSize = "cover";
      card.style.backgroundPosition = "center";
      card.style.opacity = p.owned ? "1" : "0.35";

      // 👉 탭: 보유 / 미보유
      card.addEventListener("click", () => {
        p.owned = !p.owned;
        save();
        render();
      });

      // 👉 길게 누르기: 수정 / 삭제
      if (isAdmin) {
        let timer;
        card.addEventListener("touchstart", () => {
          timer = setTimeout(() => openEdit(index), 600);
        });
        card.addEventListener("touchend", () => clearTimeout(timer));
      }

      pocaGrid.appendChild(card);
    });
}

function save() {
  localStorage.setItem("pocas", JSON.stringify(pocas));
}

/* =========================
   멤버 선택
========================= */
members.forEach(btn => {
  btn.addEventListener("click", () => {
    members.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentMember = btn.textContent;
    render();
  });
});

/* =========================
   검색
========================= */
searchInput.addEventListener("input", render);

/* =========================
   관리자
========================= */
adminBtn.addEventListener("click", () => {
  const pw = prompt("관리자 비밀번호");
  if (pw === ADMIN_PASSWORD) {
    isAdmin = true;
    alert("관리자 모드 ON");
  } else {
    alert("비밀번호 틀림");
  }
});

/* =========================
   포카 추가
========================= */
addBtn.addEventListener("click", () => {
  if (!isAdmin) return alert("관리자만 가능");

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const member = prompt("멤버 이름");
      const album = prompt("포카 이름");
      if (!member || !album) return;

      pocas.push({
        member,
        album,
        image: reader.result,
        owned: false
      });

      save();
      render();
    };

    reader.readAsDataURL(file);
  };

  input.click();
});

/* =========================
   수정 / 삭제 / 보유
========================= */
function openEdit(index) {
  const p = pocas[index];

  const action = prompt(
    "1: 멤버/이름 수정\n2: 보유 토글\n3: 삭제"
  );

  if (action === "1") {
    const m = prompt("멤버", p.member);
    const a = prompt("이름", p.album);
    if (m) p.member = m;
    if (a) p.album = a;
  }

  if (action === "2") {
    p.owned = !p.owned;
  }

  if (action === "3") {
    if (confirm("삭제할까요?")) pocas.splice(index, 1);
  }

  save();
  render();
}

/* =========================
   시작
========================= */
render();