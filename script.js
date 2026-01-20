// ------------------ 멤버 선택 기능 ------------------
const members = document.querySelectorAll(".member");

// 초기 상태: 검정색
members.forEach(member => {
  member.addEventListener("click", () => {
    // 모든 멤버 초기화
    members.forEach(m => m.style.color = "black");
    // 선택된 멤버 강조
    member.style.color = "#FFB6C1"; // 파스텔톤 예시
  });
});

// ------------------ 사진 추가 기능 ------------------
const menuBtn = document.getElementById("menuBtn");
const addModal = document.getElementById("addModal");
const addPhotoBtn = document.getElementById("addPhotoBtn");
const fileInput = document.getElementById("fileInput");
const pocaGrid = document.getElementById("pocaGrid");

// LocalStorage 초기화
const savedImages = JSON.parse(localStorage.getItem("pocaImages") || "[]");
savedImages.forEach(dataUrl => {
  const img = document.createElement("img");
  img.src = dataUrl;
  pocaGrid.appendChild(img);
});

// 메뉴 버튼 클릭 → +추가하기 창 토글
menuBtn.addEventListener("click", () => {
  addModal.style.display = addModal.style.display === "none" ? "block" : "none";
});

// +추가하기 버튼 클릭 → 사진 앱 열기
addPhotoBtn.addEventListener("click", () => {
  fileInput.click();
});

// 사진 선택 시
fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = document.createElement("img");
    img.src = e.target.result;
    pocaGrid.appendChild(img);

    savedImages.push(e.target.result);
    localStorage.setItem("pocaImages", JSON.stringify(savedImages));
  };
  reader.readAsDataURL(file);
});