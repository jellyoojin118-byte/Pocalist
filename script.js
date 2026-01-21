/* =========================
   상태
========================= */
let isAdmin = false;
const ADMIN_PASSWORD = "0000";

let pocas = JSON.parse(localStorage.getItem("pocas") || "[]");
let currentMember = "전체";
let editingIndex = null;

/* =========================
   DOM
========================= */
const pocaGrid = document.querySelector(".poca-grid");
const addBtn = document.querySelector(".fab.add");
const adminBtn = document.querySelector(".fab.admin");
const searchInput = document.querySelector(".search-wrap input");
const members = document.querySelectorAll(".member");

const editModal = document.getElementById("editModal");
const closeModal = document.getElementById("closeModal");
const editMemberInput = document.getElementById("editMember");
const editAlbumInput = document.getElementById("editAlbum");
const saveBtn = document.getElementById("saveBtn");
const deleteBtn = document.getElementById("deleteBtn");

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

      if (!p.owned) card.classList.add("not-owned");

      // 👉 일반 사용자: 보유/미보유 토글
      card.addEventListener("click", () => {
        p.owned = !p.owned;
        save();
        render();
      });

      // 👉 관리자: 꾹 눌러 수정
      if (isAdmin) {
        let timer;
        card.addEventListener("touchstart", () => {
          timer = setTimeout(() => openEditModal(index), 600);
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
  if (!isAdmin) return alert("관리자만 등록 가능");

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
        owned: true
      });

      save();
      render();
    };
    reader.readAsDataURL(file);
  };

  input.click();
});

/* =========================
   ✨ 모달
========================= */
function openEditModal(index) {
  editingIndex = index;
  const p = pocas[index];

  editMemberInput.value = p.member;
  editAlbumInput.value = p.album;

  editModal.classList.remove("hidden");
}

closeModal.addEventListener("click", () => {
  editModal.classList.add("hidden");
});

saveBtn.addEventListener("click", () => {
  const p = pocas[editingIndex];
  p.member = editMemberInput.value;
  p.album = editAlbumInput.value;
  save();
  editModal.classList.add("hidden");
  render();
});

deleteBtn.addEventListener("click", () => {
  pocas.splice(editingIndex, 1);
  save();
  editModal.classList.add("hidden");
  render();
});

/* =========================
   시작
========================= */
render();