const members = [
  "에스쿱스","정한","조슈아","준","호시","원우",
  "우지","디에잇","민규","도겸","승관","버논","디노"
];

const pocas = [
  {
    member: "디에잇",
    name: "디에잇 미니 11집 SEVENTEENTH HEAVEN 캐럿반"
  },
  {
    member: "우지",
    name: "우지 미니 12집 SPILL THE FEELS 캐럿반"
  }
];

const memberBar = document.getElementById("memberBar");
const grid = document.getElementById("pocaGrid");
const searchInput = document.getElementById("searchInput");

let selectedMember = "전체";

function renderMembers() {
  memberBar.innerHTML = "";

  const allBtn = document.createElement("div");
  allBtn.className = "member active";
  allBtn.innerText = "전체";
  allBtn.onclick = () => selectMember("전체", allBtn);
  memberBar.appendChild(allBtn);

  members.forEach(name => {
    const div = document.createElement("div");
    div.className = "member";
    div.innerText = name;
    div.onclick = () => selectMember(name, div);
    memberBar.appendChild(div);
  });
}

function selectMember(name, el) {
  selectedMember = name;
  document.querySelectorAll(".member").forEach(m => m.classList.remove("active"));
  el.classList.add("active");
  renderGrid();
}

function renderGrid() {
  grid.innerHTML = "";
  const keyword = searchInput.value.toLowerCase();

  pocas.filter(p => {
    const m = selectedMember === "전체" || p.member === selectedMember;
    const s = p.name.toLowerCase().includes(keyword);
    return m && s;
  }).forEach(p => {
    const card = document.createElement("div");
    card.className = "card";

    const owned = localStorage.getItem(p.name) === "true";
    if (owned) card.classList.add("owned");

    card.onclick = () => {
      card.classList.toggle("owned");
      localStorage.setItem(p.name, card.classList.contains("owned"));
    };

    grid.appendChild(card);
  });
}

searchInput.addEventListener("input", renderGrid);

renderMembers();
renderGrid();