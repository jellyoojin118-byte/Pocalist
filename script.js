let editIndex = null;

function openEditModal(index) {
  editIndex = index;
  const p = pocas[index];

  document.getElementById("editMember").value = p.member;
  document.getElementById("editAlbum").value = p.album;

  document.getElementById("editModal").classList.remove("hidden");
}

document.getElementById("closeModal").onclick = () => {
  document.getElementById("editModal").classList.add("hidden");
};

document.getElementById("saveBtn").onclick = () => {
  pocas[editIndex].member =
    document.getElementById("editMember").value;
  pocas[editIndex].album =
    document.getElementById("editAlbum").value;

  localStorage.setItem("pocas", JSON.stringify(pocas));
  render();
  document.getElementById("editModal").classList.add("hidden");
};

document.getElementById("deleteBtn").onclick = () => {
  pocas.splice(editIndex, 1);
  localStorage.setItem("pocas", JSON.stringify(pocas));
  render();
  document.getElementById("editModal").classList.add("hidden");
};