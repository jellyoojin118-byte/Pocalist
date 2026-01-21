const members = ["전체","에스쿱스","정한","조슈아","준","호시","원우","우지","디에잇","민규","도겸","승관","버논","디노"];
const memberBar = document.getElementById("memberBar");
const pocaGrid = document.getElementById("pocaGrid");
const fileInput = document.getElementById("fileInput");
const modal = document.getElementById("modal");

let admin = false;
let selected = null;

let cards = JSON.parse(localStorage.getItem("pocas") || "[]");

members.forEach(m=>{
  const b=document.createElement("button");
  b.textContent=m;
  b.className="member";
  if(m==="전체") b.classList.add("active");
  b.onclick=()=>selectMember(m,b);
  memberBar.appendChild(b);
});

function selectMember(m,btn){
  document.querySelectorAll(".member").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  render(m);
}

function render(filter="전체"){
  pocaGrid.innerHTML="";
  cards.forEach((c,i)=>{
    if(filter!=="전체" && c.member!==filter) return;
    const d=document.createElement("div");
    d.className="poca-card"+(c.owned?" owned":"");
    d.innerHTML=`<img src="${c.img}">`;
    d.onclick=()=>{c.owned=!c.owned; save(); render(filter);}
    d.oncontextmenu=e=>{
      e.preventDefault();
      if(!admin) return;
      selected=i;
      modal.style.display="block";
      modalName.value=c.name;
    }
    pocaGrid.appendChild(d);
  });
}

function save(){
  localStorage.setItem("pocas",JSON.stringify(cards));
}

addBtn.onclick=()=>fileInput.click();
fileInput.onchange=e=>{
  const r=new FileReader();
  r.onload=()=>{cards.push({img:r.result,name:"",member:"",owned:false});save();render();}
  r.readAsDataURL(e.target.files[0]);
}

adminBtn.onclick=()=>{
  if(prompt("암호")==="1234") admin=true;
}

document.querySelector(".close").onclick=()=>modal.style.display="none";