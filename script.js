console.log("JS 연결됨");

// 요소 가져오기
const addBtn = document.querySelector(".fab.add");
const fileInput = document.getElementById("fileInput");
const pocaGrid = document.querySelector(".poca-grid");

// + 버튼 → 사진 앱 열기
addBtn.addEventListener("click", () => {
  fileInput.click();
});

// 사진 선택되면 실행
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    const card = document.createElement("div");
    card.className = "poca-card";

    card.style.backgroundImage = `url(${reader.result})`;
    card.style.backgroundSize = "cover";
    card.style.backgroundPosition = "center";

    pocaGrid.appendChild(card);
  };

  reader.readAsDataURL(file);

  // 같은 사진 다시 선택 가능하게 초기화
  fileInput.value = "";
});