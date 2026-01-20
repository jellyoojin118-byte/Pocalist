const ADMIN_PASSWORD = "ruby_admin";
let isAdminMode = false;
let selectedCard = null;

/* 더미 카드 */
const cards = [
  { id: 1, member: "woozi", name: "Attacca Woozi" },
  { id: 2, member: "joshua", name: "FML Joshua" }
];

const grid = document.getElementById("cardGrid");

/* 카드 렌더 */
function renderCards() {
  grid.innerHTML = "";
  cards.forEach(card => {
    const div = document.createElement("div");
    div.className = "card";
    div.dataset.id = card.id;

    if (isAdminMode) {
      div.addEventListener("mousedown", () => openCardModal(card));
    }

    grid.appendChild(div);
  });
}
renderCards();

/* 관리자 모달 */
document.querySelector(".fab.admin").onclick = () => {
  document.getElementById("adminModal").classList.remove("hidden");
};

document.getElementById("adminConfirm").onclick = () => {
  const pw = document.getElementById("adminPassword").value;
  if (pw === ADMIN_PASSWORD) {
    isAdminMode = true;
    alert("관리자 모드 활성화");
    renderCards();
  }
  document.getElementById("adminModal").classList.add("hidden");
};

document.getElementById("adminCancel").onclick = () => {
  document.getElementById("adminModal").classList.add("hidden");
};

/* 카드 관리 모달 */
function openCardModal(card) {
  selectedCard = card;
  document.getElementById("modalName").value = card.name;
  document.getElementById("modalMember").value = card.member;
  document.getElementById("cardModal").classList.remove("hidden");
}

document.querySelector(".close").onclick = () => {
  document.getElementById("cardModal").classList.add("hidden");
};

document.getElementById("editCard").onclick = () => {
  selectedCard.name = document.getElementById("modalName").value;
  selectedCard.member = document.getElementById("modalMember").value;
  alert("수정 완료");
};

document.getElementById("deleteCard").onclick = () => {
  const index = cards.findIndex(c => c.id === selectedCard.id);
  cards.splice(index, 1);
  document.getElementById("cardModal").classList.add("hidden");
  renderCards();
};