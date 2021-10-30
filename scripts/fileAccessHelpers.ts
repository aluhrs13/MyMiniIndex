import { renderSTL } from "./stl.js";
import { Mini } from "./Mini.js";
import { DirectoryList } from "./DirectoryList.js";
import { addMini } from "./idbAccessHelpers.js";

let totalMiniCount = 0;

//TODO: Rename to addDirectoryDialog
export async function showDirectoryDialog(dirs: DirectoryList) {
  let directory = await window.showDirectoryPicker({
    startIn: "desktop",
  });

  dirs.addDir(directory);
}

//TODO: Report the results of scanning
export async function scanAllDirectories(dirs: Array<FileSystemHandle>) {
  totalMiniCount = 0;
  document.getElementById("status").innerText = "Scanning...";

  //TODO: Removed async to get status reporting... not sure it's worth it.
  //TODO: If this stays like this, split permissions and traversal so approvals aren't interspersed randomly.
  for (let i = 0; i < dirs.length; i++) {
    await verifyPermission(dirs[i]).then(() => traverseDirectory(dirs[i]));
  }

  document.getElementById("status").innerText = "Done!";
}

//TODO: Really need to keep full directory paths for keys
export async function traverseDirectory(directory) {
  document.getElementById("scanningDir").innerText = directory.name;
  for await (const entry of directory.values()) {
    if (entry.kind == "directory") {
      await traverseDirectory(entry);
    } else {
      if (entry.name.endsWith("stl") || entry.name.endsWith("STL")) {
        addMini(entry);
        totalMiniCount++;
        document.getElementById("minisFound").innerText =
          totalMiniCount.toString();
      }
    }
  }
}

export async function renderFile(entry: Mini, parentElement: HTMLElement) {
  await verifyPermission(entry.file);
  //@ts-ignore
  let file = await entry.file.getFile();
  var reader = new FileReader();

  reader.onload = function (e) {
    //https://github.com/fenrus75/FenrusCNCtools/blob/master/javascript/stl2png.js
    if (e.target.readyState == FileReader.DONE) {
      renderSTL(e.target.result, parentElement);
    }
  };

  //@ts-ignore
  reader.readAsBinaryString(file);
}

async function verifyPermission(fileHandle) {
  // Check if permission was already granted. If so, return true.
  if ((await fileHandle.queryPermission()) === "granted") {
    return true;
  }
  // Request permission. If the user grants permission, return true.
  if ((await fileHandle.requestPermission()) === "granted") {
    return true;
  }
  // The user didn't grant permission, so return false.
  return false;
}
