document.getElementById("physics").addEventListener("click", () => redirect("physics"))

function redirect(url){
  location.href = `../${url}.html`
}