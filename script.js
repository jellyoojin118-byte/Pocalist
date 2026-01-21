/***********************
 * 기본 상태
 ************************/
let isAdmin = false;
let currentMember = "전체";
let pocaList = JSON.parse(localStorage.getItem("pocaList") || "[]");

const memberButtons = document.querySelectorAll(".member");
const pocaGrid = document.querySelector(".poca-grid");
const addBtn = document.querySelector(".fab.add");
const adminBtn = document.querySelector(".fab.admin");
const fileInput = document.getElementById("fileInput");
const searchInput = document.querySelector(".search-wrap input");

/***********************
 * 렌더링
 ************************/
function render() {
  pocaGrid.innerHTML = "";

  const keyword = searchInput.value.toLowerCase();

  pocaList.forEach((poca, index) => {
    if (
      (currentMember !== "전체" && poca.member !== currentMember) ||
      !poca.album.toLowerCase().includes(keyword)
    ) {
      return;
    }

    const card = document.createElement("div");
    card.className = "poca-card";
    card.style.backgroundImage = `url(${poca.image})`;
    card.style.backgroundSize = "cover";
    card.style.backgroundPosition = "center";

    // 롱프레스 (관리자만)
    if (isAdmin) {
      let pressTimer;
      card.addEventListener("touchstart", () => {
        pressTimer = setTimeout(() => openEditModal(index), 500);
      });
      card.addEventListener("touchend", () => clearTimeout(pressTimer));
    }

    pocaGrid.appendChild(card);
  });
}

/***********************
 * 멤버바 필터
 ************************/
memberButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    memberButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentMember = btn.textContent;
    render();
  });
});

/***********************
 * 검색
 ************************/
searchInput.addEventListener("input", render);

/***********************
 * 관리자 모드
 ************************/
adminBtn.addEventListener("click", () => {
  if (!isAdmin) {
    const pw = prompt("관리자 비밀번호 입력");
    if (pw === "0000") {
      isAdmin = true;
      alert("관리자 모드 ON");
    } else {
      alert("비밀번호 틀림");
    }
  } else {
    isAdmin = false;
    alert("관리자 모드 OFF");
  }
});

/***********************
 * 포카 추가
 ************************/
addBtn.addEventListener("click", () => {
  if (!isAdmin) {
    alert("관리자 모드에서만 추가 가능");
    return;
  }
  fileInput.click();
});

fileInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const member = prompt("멤버 이름 입력");
    if (!member) return;

    const album = prompt("앨범 이름 입력");
    if (!album) return;

    pocaList.push({
      member,
      album,
      image: reader.result
    });

    localStorage.setItem("pocaList", JSON.stringify(pocaList));
    render();
  };
  reader.readAsDataURL(file);
  fileInput.value = "";
});

/***********************
 * 수정 / 삭제 모달
 ************************/
function openEditModal(index) {
  const poca = pocaList[index];

  const newMember = prompt("멤버 수정", poca.member);
  if (newMember === null) return;

  const newAlbum = prompt("앨범명 수정", poca.album);
  if (newAlbum === null) return;

  const action = confirm("확인 = 수정 / 취소 = 삭제");

  if (action) {
    pocaList[index].member = newMember;
    pocaList[index].album = newAlbum;
  } else {
    pocaList.splice(index, 1);
  }

  localStorage.setItem("pocaList", JSON.stringify(pocaList));
  render();
}

/***********************
 * 초기 렌더
 ************************/
render();