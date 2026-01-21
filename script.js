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

      // 꾹 누르기 (관리자만)
      if (isAdmin) {
        let pressTimer;
        card.addEventListener("touchstart", () => {
          pressTimer = setTimeout(() => openEditModal(index), 600);
        });
        card.addEventListener("touchend", () => clearTimeout(pressTimer));
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
      const member = prompt("멤버 이름 입력");
      const album = prompt("앨범 / 포카 이름 입력");

      if (!member || !album) return;

      pocas.push({
        member,
        album,
        image: reader.result
      });

      localStorage.setItem("pocas", JSON.stringify(pocas));
      render();
    };
    reader.readAsDataURL(file);
  };

  input.click();
});

/* =========================
   수정 / 삭제
========================= */
function openEditModal(index) {
  const p = pocas[index];

  const member = prompt("멤버 수정", p.member);
  if (member === null) return;

  const album = prompt("앨범명 수정", p.album);
  if (album === null) return;

  const del = confirm("삭제할까요?\n확인 = 삭제 / 취소 = 수정");

  if (del) {
    pocas.splice(index, 1);
  } else {
    p.member = member;
    p.album = album;
  }

  localStorage.setItem("pocas", JSON.stringify(pocas));
  render();
}

/* =========================
   시작
========================= */
render();