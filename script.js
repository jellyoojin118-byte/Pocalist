/* ===============================
   멤버 선택
================================ */
const members = document.querySelectorAll(".member");

members.forEach(btn => {
  btn.addEventListener("click", () => {
    members.forEach(m => m.classList.remove("active"));
    btn.classList.add("active");
  });
});

/* ===============================
   포카 데이터 (임시)
================================ */
let pocaData = [];
const pocaGrid = document.querySelector(".poca-grid");

/* 초기 포카 생성 */
document.querySelectorAll(".poca-card").forEach((card, index) => {
  const data = {
    id: Date.now() + index,
    name: "포카 이름",
    member: "전체",
  };
  pocaData.push(data);
  card.dataset.id = data.id;
});

/* ===============================
   롱프레스 감지
================================ */
let pressTimer = null;
let activeCardId = null;

pocaGrid.addEventListener("mousedown", startPress);
pocaGrid.addEventListener("touchstart", startPress);

pocaGrid.addEventListener("mouseup", cancelPress);
pocaGrid.addEventListener("mouseleave", cancelPress);
pocaGrid.addEventListener("touchend", cancelPress);

function startPress(e) {
  const card = e.target.closest(".poca-card");
  if (!card) return;

  activeCardId = card.dataset.id;

  pressTimer = setTimeout(() => {
    openModal(activeCardId);
  }, 500);
}

function cancelPress() {
  clearTimeout(pressTimer);
}

/* ===============================
   모달 생성
================================ */
function openModal(id) {
  const poca = pocaData.find(p => p.id == id);

  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal">
      <button class="close">✕</button>

      <label>포카 이름</label>
      <input type="text" id="editName" value="${poca.name}" />

      <label>멤버</label>
      <select id="editMember">
        ${[...members].map(m => `
          <option ${poca.member === m.innerText ? "selected" : ""}>
            ${m.innerText}
          </option>
        `).join("")}
      </select>

      <div class="modal-actions">
        <button class="edit">수정</button>
        <button class="delete">삭제</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  /* 닫기 */
  modal.querySelector(".close").onclick = () => modal.remove();

  /* 수정 */
  modal.querySelector(".edit").onclick = () => {
    poca.name = modal.querySelector("#editName").value;
    poca.member = modal.querySelector("#editMember").value;
    modal.remove();
  };

  /* 삭제 */
  modal.querySelector(".delete").onclick = () => {
    pocaData = pocaData.filter(p => p.id != id);
    document.querySelector(`.poca-card[data-id="${id}"]`).remove();
    modal.remove();
  };
}

/* ===============================
   모달 스타일 (JS에서 주입)
================================ */
const style = document.createElement("style");
style.innerHTML = `
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  width: 90%;
  max-width: 320px;
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  position: relative;
}

.modal .close {
  position: absolute;
  top: 12px;
  right: 12px;
  border: none;
  background: none;
  font-size: 18px;
}

.modal label {
  display: block;
  margin-top: 12px;
  font-size: 13px;
}

.modal input,
.modal select {
  width: 100%;
  padding: 10px;
  margin-top: 6px;
  border-radius: 10px;
  border: 1px solid #ddd;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}

.modal-actions button {
  flex: 1;
  padding: 10px;
  border-radius: 12px;
  border: none;
}

.modal-actions .edit {
  background: #9bb7d4;
  color: #fff;
}

.modal-actions .delete {
  background: #f4b6c2;
  color: #fff;
}
`;
document.head.appendChild(style);