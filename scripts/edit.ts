import { getImage } from "./stl.js";
import { renderFile } from "./fileAccessHelpers.js";
import { getMini, updateMini } from "./idbAccessHelpers.js";
import { Mini, Status } from "./Mini.js";

var mini: Mini;

const ele = document.getElementById("approveMini");
ele.addEventListener("click", approveMini);

const ele3 = document.getElementById("rejectMini");
ele3.addEventListener("click", rejectMini);

const ele2 = document.getElementById("loadModel");
ele2.addEventListener("click", () => {
  //renderFile(mini, "model");
});

window.onload = async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const myParam = urlParams.get("id");

  mini = await getMini(decodeURI(myParam));

  document.getElementById("name").innerText = mini.name;
  document.getElementById("status").innerText = mini.status.toString();

  console.log(mini);
};

function approveMini() {
  mini.status = Status.Approved;
  mini.base64Image = getImage();
  updateMini(mini);
}

function rejectMini() {
  mini.status = Status.Rejected;
  updateMini(mini);
}
