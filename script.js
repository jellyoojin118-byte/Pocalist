const members = [
  "전체","에스쿱스","정한","조슈아","준","호시","원우",
  "우지","디에잇","민규","도겸","승관","버논","디노"
];

const pocas = [
  {
    name: "디에잇 미니 11집 SEVENTEENTH HEAVEN 캐럿반",
    member: "디에잇",
    colorClass: "color-the8"
  },
  {
    name: "우지 미니 12집 SPILL THE FEELS 캐럿반",
    member: "우지",
    colorClass: "color-woozi"
  }
];

const memberBar = document.getElementById("memberBar");
const pocaGrid = document.getElementById("pocaGrid");
const searchInput = document.getElementById("searchInput");

let selectedMember = "전체";

members.forEach(member => {
  const btn = document.createElement("button");
  btn.className = "member-btn";
  btn.innerText = member;
  if (member === "전체") btn.classList.add("active");

  btn.onclick = () => {
    selectedMember = member;
    document.querySelectorAll(".member-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    render();
  };

  memberBar.appendChild(btn);
});

function render() {
  const keyword = searchInput.value.toLowerCase();
  pocaGrid.innerHTML = "";

  pocas
    .filter(p =>
      (selectedMember === "전체" || p.member === selectedMember) &&
      p.name.toLowerCase().includes(keyword)
    )
    .forEach(p => {
      const div = document.createElement("div");
      div.className = `poca ${p.colorClass}`;

      const label = document.createElement("span");
      label.innerText = p.member;

      div.onclick = () => {
        div.classList.toggle("owned");
      };

      div.appendChild(label);
      pocaGrid.appendChild(div);
    });
}

searchInput.oninput = render;
render();