/* ===============================
   상태
================================ */
let isAdmin = false;
let pocaList = [];

const grid = document.querySelector(".poca-grid");
const addBtn = document.querySelector(".fab.add");
const adminBtn = document.querySelector(".fab.admin");
const fileInput = document.getElementById("fileInput");

/* ===============================
   관리자 모드
================================ */
adminBtn.onclick = () => {
  const pw = prompt("관리자 비밀번호 입력");
  if (pw === "0000") {
    isAdmin = true;
    alert("관리자 모드 활성화");
  } else {
    alert("비밀번호가 틀렸어요");
  }
};

/* ===============================
   + 버튼 → 사진 추가
================================ */
addBtn.onclick = () => {
  if (!isAdmin) {
    alert("관리자 모드에서만 가능합니다");
    return;
  }
  fileInput.click();
};

fileInput.onchange = e => {
  const file = e.target.files[0];
  if (!file) return;

  const member = prompt("멤버 이름 입력");
  const album = prompt("앨범 이름 입력");

  const reader = new FileReader();
  reader.onload = () => {
    const data = {
      id: Date.now(),
      image: reader.result,
      member,
      album
    };
    pocaList.push(data);
    render();
  };
  reader.readAsDataURL(file);
};

/* ===============================
   렌더링
================================ */
function render(filter = "전체") {
  grid.innerHTML = "";

  pocaList.forEach(p => {
    if (filter !== "전체" && p.member !== filter) return;

    const card = document.createElement("div");
    card.className = "poca-card";
    card.style.backgroundImage = `url(${p.image})`;
    card.style.backgroundSize = "cover";

    /* 롱프레스 (관리자만) */
    let timer;
    card.onmousedown = () => {
      if (!isAdmin) return;
      timer = setTimeout(() => openEdit(p), 500);
    };
    card.onmouseup = () => clearTimeout(timer);
    card.onmouseleave = () => clearTimeout(timer);

    grid.appendChild(card);
  });
}

/* ===============================
   수정 / 삭제 모달
================================ */
function openEdit(poca) {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal">
      <button class="close">✕</button>

      <label>멤버</label>
      <input id="editMember" value="${poca.member}" />

      <label>앨범</label>
      <input id="editAlbum" value="${poca.album}" />

      <div class="modal-actions">
        <button class="edit">수정</button>
        <button class="delete">삭제</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector(".close").onclick = () => modal.remove();

  modal.querySelector(".edit").onclick = () => {
    poca.member = modal.querySelector("#editMember").value;
    poca.album = modal.querySelector("#editAlbum").value;
    modal.remove();
    render();
  };

  modal.querySelector(".delete").onclick = () => {
    pocaList = pocaList.filter(p => p.id !== poca.id);
    modal.remove();
    render();
  };
}

/* ===============================
   멤버바 필터링
================================ */
document.querySelectorAll(".member").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".member").forEach(m => m.classList.remove("active"));
    btn.classList.add("active");
    render(btn.innerText);
  };
});

/* ===============================
   모달 스타일
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
  z-index: 999;
}
.modal {
  background: #fff;
  width: 90%;
  max-width: 320px;
  padding: 16px;
  border-radius: 16px;
  position: relative;
}
.close {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: none;
  font-size: 18px;
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
.edit { background:#9bb7d4; color:#fff; }
.delete { background:#f4b6c2; color:#fff; }
`;
document.head.appendChild(style);