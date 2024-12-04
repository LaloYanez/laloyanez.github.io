const mv = document.querySelector('model-viewer');
function model(name) {
  mv.setAttribute("src", "models/" + name + ".glb");
  mv.activateAR();
}
