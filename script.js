/* =========================
   기본 상태
========================= */
let isAdmin = false;
const ADMIN_PASSWORD = "0000";

let pocas = JSON.parse(localStorage.getItem("pocas") || "[]");
let currentMember = "전체";
let selectedIndex = null;

/* =========================
   DOM
========================= */
const pocaGrid = document.querySelector(".poca-grid");
const addBtn = document.querySelector(".fab.add");
const adminBtn = document.querySelector(".fab.admin");
const searchInput = document.querySelector(".search-wrap input");
const members = document.querySelectorAll(".member");

/* =========================
   모달 생성
========================= */
const modal = document.createElement("div");
modal.className = "modal hidden";
modal.innerHTML = `
  <div class="modal-content">
    <button class="close-btn">✕</button>

    <label>멤버</label>
    <input id="editMember" />

    <label>앨범 / 포카 이름</label>
    <input id="editAlbum" />

    <div class="modal-actions">
      <button id="saveBtn">수정</button>
      <button id="deleteBtn">삭제</button>
    </div>
  </div>
`;
document.body.appendChild(modal);

const closeBtn = modal.querySelector(".close-btn");
const editMember = modal.querySelector("#editMember");
const editAlbum = modal.querySelector("#editAlbum");
const saveBtn = modal.querySelector("#saveBtn");
const deleteBtn = modal.querySelector("#deleteBtn");

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

      if (!p.owned) card.classList.add("not-owned");

      // 👉 클릭 = 보유 / 미보유
      card.addEventListener("click", () => {
        p.owned = !p.owned;
        save();
        render();
      });

      // 👉 길게 누르기 = 수정 모달 (관리자만)
      if (isAdmin) {
        let timer;
        card.addEventListener("touchstart", () => {
          timer = setTimeout(() => openModal(index), 600);
        });
        card.addEventListener("touchend", () => clearTimeout(timer));
      }

      pocaGrid.appendChild(card);
    });
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
   관리자 모드
========================= */
adminBtn.addEventListener("click", () => {
  const pw = prompt("관리자 비밀번호 입력");
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
  if (!isAdmin) {
    alert("관리자만 등록 가능");
    return;
  }

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const member = prompt("멤버 이름");
      const album = prompt("앨범 / 포카 이름");
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
   모달 제어
========================= */
function openModal(index) {
  selectedIndex = index;
  const p = pocas[index];
  editMember.value = p.member;
  editAlbum.value = p.album;
  modal.classList.remove("hidden");
}

closeBtn.onclick = () => modal.classList.add("hidden");

saveBtn.onclick = () => {
  if (selectedIndex === null) return;
  pocas[selectedIndex].member = editMember.value;
  pocas[selectedIndex].album = editAlbum.value;
  save();
  modal.classList.add("hidden");
  render();
};

deleteBtn.onclick = () => {
  if (selectedIndex === null) return;
  pocas.splice(selectedIndex, 1);
  save();
  modal.classList.add("hidden");
  render();
};

/* =========================
   저장
========================= */
function save() {
  localStorage.setItem("pocas", JSON.stringify(pocas));
}

/* =========================
   시작
========================= */
render();