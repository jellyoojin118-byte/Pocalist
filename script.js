const members = [
  "에스쿱스","정한","조슈아","준","호시","원우","우지",
  "디에잇","민규","도겸","승관","버논","디노"
];

let selectedMember = "전체";
let pocaData = JSON.parse(localStorage.getItem("pocaData") || "[]");

const memberBar = document.getElementById("memberBar");
const pocaGrid = document.getElementById("pocaGrid");
const searchInput = document.getElementById("searchInput");
const addBtn = document.getElementById("addBtn");
const fileInput = document.getElementById("fileInput");

const actionModal = document.getElementById("actionModal");
const deleteBtn = document.getElementById("deleteBtn");
const cancelBtn = document.getElementById("cancelBtn");

let selectedPoca = null;

// 멤버바 생성
["전체", ...members].forEach(name => {
  const div = document.createElement("div");
  div.className = "member";
  div.innerText = name;

  div.addEventListener("click", () => {
    document.querySelectorAll(".member").forEach(m => m.classList.remove("active"));
    div.classList.add("active");
    selectedMember = name;
    renderGrid();
  });

  memberBar.appendChild(div);
});

// 저장
function saveData() {
  localStorage.setItem("pocaData", JSON.stringify(pocaData));
}

// 그리드 렌더
function renderGrid() {
  pocaGrid.innerHTML = "";

  const keyword = searchInput.value.toLowerCase();

  pocaData
    .filter(p => selectedMember === "전체" || p.member === selectedMember)
    .filter(p => p.name.toLowerCase().includes(keyword))
    .forEach(p => {
      const img = document.createElement("img");
      img.src = p.image;
      if (p.owned) img.classList.add("owned");

      // 탭 → 보유 체크
      img.addEventListener("click", () => {
        p.owned = !p.owned;
        saveData();
        renderGrid();
      });

      // 길게 누르기 → 메뉴
      let pressTimer;
      img.addEventListener("touchstart", () => {
        pressTimer = setTimeout(() => {
          selectedPoca = p;
          actionModal.style.display = "flex";
        }, 600);
      });

      img.addEventListener("touchend", () => {
        clearTimeout(pressTimer);
      });

      pocaGrid.appendChild(img);
    });
}

// 검색
searchInput.addEventListener("input", renderGrid);

// 추가 버튼
addBtn.addEventListener("click", () => fileInput.click());

// 사진 추가
fileInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const name = prompt("포카 이름 입력");
  const member = prompt("멤버 이름 입력");

  const reader = new FileReader();
  reader.onload = () => {
    pocaData.push({
      name,
      member,
      image: reader.result,
      owned: false
    });
    saveData();
    renderGrid();
  };
  reader.readAsDataURL(file);
});

// 삭제
deleteBtn.addEventListener("click", () => {
  pocaData = pocaData.filter(p => p !== selectedPoca);
  saveData();
  actionModal.style.display = "none";
  renderGrid();
});

cancelBtn.addEventListener("click", () => {
  actionModal.style.display = "none";
});

renderGrid();