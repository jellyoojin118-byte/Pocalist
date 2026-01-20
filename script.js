// ================== 멤버 데이터 ==================
const members = [
  "에스쿱스","정한","조슈아","준","호시","원우","우지",
  "디에잇","민규","도겸","승관","버논","디노"
];

let selectedMember = "전체";

// ================== 멤버 바 생성 ==================
const memberBar = document.getElementById("memberBar");

function renderMembers() {
  memberBar.innerHTML = "";

  ["전체", ...members].forEach(name => {
    const div = document.createElement("div");
    div.className = "member";
    div.textContent = name;

    if (name === selectedMember) {
      div.style.color = "#FFB6C1";
    }

    div.addEventListener("click", () => {
      selectedMember = name;
      renderMembers();
      renderGrid();
    });

    memberBar.appendChild(div);
  });
}

// ================== 로컬 저장 ==================
let pocaData = JSON.parse(localStorage.getItem("pocaData") || "[]");

// ================== 포카 그리드 ==================
const pocaGrid = document.getElementById("pocaGrid");

function renderGrid() {
  const keyword = searchInput.value.toLowerCase();
  pocaGrid.innerHTML = "";

  pocaData
    .filter(p => selectedMember === "전체" || p.member === selectedMember)
    .filter(p => p.name.toLowerCase().includes(keyword))
    .forEach(p => {
      const img = document.createElement("img");
      img.src = p.image;
      img.className = "poca" + (p.owned ? "" : " unowned");

      img.addEventListener("click", () => {
        p.owned = !p.owned;
        saveData();
        renderGrid();
      });

      pocaGrid.appendChild(img);
    });
}

function saveData() {
  localStorage.setItem("pocaData", JSON.stringify(pocaData));
}

// ================== 검색 ==================
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", renderGrid);

// ================== 사진 추가 ==================
const menuBtn = document.getElementById("menuBtn");
const addModal = document.getElementById("addModal");
const addPhotoBtn = document.getElementById("addPhotoBtn");
const fileInput = document.getElementById("fileInput");

menuBtn.addEventListener("click", () => {
  addModal.style.display =
    addModal.style.display === "block" ? "none" : "block";
});

addPhotoBtn.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = ev => {

    const member = prompt("멤버 이름을 입력하세요 (예: 우지)");
    if (!member) return;

    const name = prompt("포토카드 이름을 입력하세요");
    if (!name) return;

    pocaData.push({
      member: member,
      name: name,
      image: ev.target.result,
      owned: true
    });

    saveData();
    renderGrid();
  };

  reader.readAsDataURL(file);
});

// ================== 시작 ==================
renderMembers();
renderGrid();

// ================== 멤버 데이터 ==================
const members = [
  "에스쿱스","정한","조슈아","준","호시","원우","우지",
  "디에잇","민규","도겸","승관","버논","디노"
];

let selectedMember = "전체";

// ================== 멤버 바 생성 ==================
const memberBar = document.getElementById("memberBar");

function renderMembers() {
  memberBar.innerHTML = "";

  ["전체", ...members].forEach(name => {
    const div = document.createElement("div");
    div.className = "member";
    div.textContent = name;

    if (name === selectedMember) {
      div.style.color = "#FFB6C1";
    }

    div.addEventListener("click", () => {
      selectedMember = name;
      renderMembers();
      renderGrid();
    });

    memberBar.appendChild(div);
  });
}

// ================== 로컬 저장 ==================
let pocaData = JSON.parse(localStorage.getItem("pocaData") || "[]");

// ================== 포카 그리드 ==================
const pocaGrid = document.getElementById("pocaGrid");

function renderGrid() {
  const keyword = searchInput.value.toLowerCase();
  pocaGrid.innerHTML = "";

  pocaData
    .filter(p => selectedMember === "전체" || p.member === selectedMember)
    .filter(p => p.name.toLowerCase().includes(keyword))
    .forEach(p => {
      const img = document.createElement("img");
      img.src = p.image;
      img.className = "poca" + (p.owned ? "" : " unowned");

      img.addEventListener("click", () => {
        p.owned = !p.owned;
        saveData();
        renderGrid();
      });

      pocaGrid.appendChild(img);
    });
}

function saveData() {
  localStorage.setItem("pocaData", JSON.stringify(pocaData));
}

// ================== 검색 ==================
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", renderGrid);

// ================== 사진 추가 ==================
const menuBtn = document.getElementById("menuBtn");
const addModal = document.getElementById("addModal");
const addPhotoBtn = document.getElementById("addPhotoBtn");
const fileInput = document.getElementById("fileInput");

menuBtn.addEventListener("click", () => {
  addModal.style.display =
    addModal.style.display === "block" ? "none" : "block";
});

addPhotoBtn.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = ev => {

    const member = prompt("멤버 이름을 입력하세요 (예: 우지)");
    if (!member) return;

    const name = prompt("포토카드 이름을 입력하세요");
    if (!name) return;

    pocaData.push({
      member: member,
      name: name,
      image: ev.target.result,
      owned: true
    });

    saveData();
    renderGrid();
  };

  reader.readAsDataURL(file);
});

// ---------------- Firebase 초기화 ----------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCEvG-D1z-AaIdrU4tDul7WRPHfCQ8vFE8",
  authDomain: "seventeen-pocalist.firebaseapp.com",
  projectId: "seventeen-pocalist",
  storageBucket: "seventeen-pocalist.firebasestorage.app",
  messagingSenderId: "177776939335",
  appId: "1:177776939335:web:b7d33f8a5995eccf9ebc62"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ---------------- DOM ----------------
const pocaGrid = document.getElementById("pocaGrid");
const fileInput = document.getElementById("fileInput");

// ---------------- 포카 불러오기 ----------------
async function loadPocas() {
  pocaGrid.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "pocas"));

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    createPocaElement(docSnap.id, data.image);
  });
}

// ---------------- 포카 생성 ----------------
function createPocaElement(id, imageUrl) {
  const img = document.createElement("img");
  img.src = imageUrl;
  img.className = "poca unowned";

  img.addEventListener("click", () => {
    img.classList.toggle("owned");
  });

  img.addEventListener("contextmenu", async (e) => {
    e.preventDefault();
    if (confirm("이 포카 삭제할까?")) {
      await deleteDoc(doc(db, "pocas", id));
      loadPocas();
    }
  });

  pocaGrid.appendChild(img);
}

// ---------------- 사진 추가 ----------------
fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    await addDoc(collection(db, "pocas"), {
      image: event.target.result,
      createdAt: Date.now()
    });
    loadPocas();
  };
  reader.readAsDataURL(file);
});
// ---------------- Firebase 초기화 ----------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCEvG-D1z-AaIdrU4tDul7WRPHfCQ8vFE8",
  authDomain: "seventeen-pocalist.firebaseapp.com",
  projectId: "seventeen-pocalist",
  storageBucket: "seventeen-pocalist.firebasestorage.app",
  messagingSenderId: "177776939335",
  appId: "1:177776939335:web:b7d33f8a5995eccf9ebc62"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ---------------- DOM ----------------
const pocaGrid = document.getElementById("pocaGrid");
const fileInput = document.getElementById("fileInput");

// ---------------- 포카 불러오기 ----------------
async function loadPocas() {
  pocaGrid.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "pocas"));

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    createPocaElement(docSnap.id, data.image);
  });
}

// ---------------- 포카 생성 ----------------
function createPocaElement(id, imageUrl) {
  const img = document.createElement("img");
  img.src = imageUrl;
  img.className = "poca unowned";

  img.addEventListener("click", () => {
    img.classList.toggle("owned");
  });

  img.addEventListener("contextmenu", async (e) => {
    e.preventDefault();
    if (confirm("이 포카 삭제할까?")) {
      await deleteDoc(doc(db, "pocas", id));
      loadPocas();
    }
  });

  pocaGrid.appendChild(img);
}

// ---------------- 사진 추가 ----------------
fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    await addDoc(collection(db, "pocas"), {
      image: event.target.result,
      createdAt: Date.now()
    });
    loadPocas();
  };
  reader.readAsDataURL(file);
});

// ---------------- Firebase 초기화 ----------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCEvG-D1z-AaIdrU4tDul7WRPHfCQ8vFE8",
  authDomain: "seventeen-pocalist.firebaseapp.com",
  projectId: "seventeen-pocalist",
  storageBucket: "seventeen-pocalist.firebasestorage.app",
  messagingSenderId: "177776939335",
  appId: "1:177776939335:web:b7d33f8a5995eccf9ebc62"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ---------------- DOM ----------------
const pocaGrid = document.getElementById("pocaGrid");
const fileInput = document.getElementById("fileInput");

// ---------------- 포카 불러오기 ----------------
async function loadPocas() {
  pocaGrid.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "pocas"));

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    createPocaElement(docSnap.id, data.image);
  });
}

// ---------------- 포카 생성 ----------------
function createPocaElement(id, imageUrl) {
  const img = document.createElement("img");
  img.src = imageUrl;
  img.className = "poca unowned";

  img.addEventListener("click", () => {
    img.classList.toggle("owned");
  });

  img.addEventListener("contextmenu", async (e) => {
    e.preventDefault();
    if (confirm("이 포카 삭제할까?")) {
      await deleteDoc(doc(db, "pocas", id));
      loadPocas();
    }
  });

  pocaGrid.appendChild(img);
}

// ---------------- 사진 추가 ----------------
fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    await addDoc(collection(db, "pocas"), {
      image: event.target.result,
      createdAt: Date.now()
    });
    loadPocas();
  };
  reader.readAsDataURL(file);
});

// 최초 로드
loadPocas();


