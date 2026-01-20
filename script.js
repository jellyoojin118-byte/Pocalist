// ================= 데이터 =================
let pocaData = JSON.parse(localStorage.getItem("pocaData")) || [];

const members = [
  "에스쿱스","정한","조슈아","준","호시","원우","우지",
  "디에잇","민규","도겸","승관","버논","디노"
];

let selectedMember = "전체";
let selectedPoca = null;

// ================= DOM =================
const memberBar = document.getElementById("memberBar");
const pocaGrid = document.getElementById("pocaGrid");
const searchInput = document.getElementById("searchInput");
const fileInput = document.getElementById("fileInput");

const actionModal = document.getElementById("actionModal");
const deleteBtn = document.getElementById("deleteBtn");
const editBtn = document.getElementById("editBtn");
const cancelBtn = document.getElementById("cancelBtn");

// ================= 저장 =================
function saveData() {
  localStorage.setItem("pocaData", JSON.stringify(pocaData));
}

// ================= 멤버바 =================
function renderMembers() {
  memberBar.innerHTML = "";

  const allBtn = document.createElement("span");
  allBtn.className = "member";
  allBtn.innerText = "전체";
  allBtn.onclick = () => {
    selectedMember = "전체";
    renderMembers();
    renderGrid();
  };
  memberBar.appendChild(allBtn);

  members.forEach(name => {
    const span = document.createElement("span");
    span.className = "member";
    span.innerText = name;

    if (name === selectedMember) {
      span.style.color = "#FFB6C1";
    }

    span.onclick = () => {
      selectedMember = name;
      renderMembers();
      renderGrid();
    };

    memberBar.appendChild(span);
  });
}

// ================= 포카 그리기 =================
function renderGrid() {
  pocaGrid.innerHTML = "";

  const keyword = searchInput.value.toLowerCase();

  pocaData
    .filter(p =>
      (selectedMember === "전체" || p.member === selectedMember) &&
      p.name.toLowerCase().includes(keyword)
    )
    .forEach(p => {
      const img = document.createElement("img");
      img.src = p.image;
      img.className = "poca";
      if (p.owned) img.classList.add("owned");

      // 보유 토글
      img.onclick = () => {
        p.owned = !p.owned;
        saveData();
        renderGrid();
      };

      // 길게 누르기 메뉴
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

// ================= 사진 추가 =================
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const name = prompt("포카 이름 입력");
    const member = prompt("멤버 이름 입력 (정확히)");

    if (!name || !member) return;

    pocaData.push({
      name,
      member,
      image: event.target.result,
      owned: false
    });

    saveData();
    renderGrid();
  };
  reader.readAsDataURL(file);
});

// ================= 액션 모달 =================
deleteBtn.onclick = () => {
  pocaData = pocaData.filter(p => p !== selectedPoca);
  saveData();
  renderGrid();
  actionModal.style.display = "none";
};

editBtn.onclick = () => {
  const newName = prompt("새 포카 이름", selectedPoca.name);
  if (newName) {
    selectedPoca.name = newName;
    saveData();
    renderGrid();
  }
  actionModal.style.display = "none";
};

cancelBtn.onclick = () => {
  actionModal.style.display = "none";
};

// ================= 시작 =================
renderMembers();
renderGrid();