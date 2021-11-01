import { Mini } from "../Mini.js";
import { getPendingMinis } from "../idbAccessHelpers.js";

window.onload = function () {
  renderPendingMinis();
  window.addEventListener("hashchange", hashHandler, false);

  if (window.location.hash.length > 1) {
    hashHandler();
  }
};

async function renderPendingMinis() {
  var ele = document.getElementById("pendingList");
  ele.innerHTML = "";
  let minis = await getPendingMinis();

  minis.forEach((mini: Mini) => {
    var container = document.createElement("div");
    var link = document.createElement("a");
    link.href = `#${mini.name}`;
    link.innerText = mini.name;
    container.appendChild(link);
    ele.appendChild(container);
  });
}

function hashHandler() {
  var ele = document.createElement("edit-mini");
  ele.name = decodeURI(window.location.hash.substring(1));
  document.body.appendChild(ele);
}
