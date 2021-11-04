import { renderSTL } from "./stl";
import { Mini } from "./Mini";
import { DirectoryList } from "./DirectoryList";
import { addMini } from "./idbAccessHelpers";
import { getExcludeDirectories } from "./settings";

const excludedDirectories = getExcludeDirectories();

//TODO: Rename to addDirectoryDialog
export async function showDirectoryDialog(dirs: DirectoryList) {
  let directory = await window.showDirectoryPicker({
    startIn: "desktop",
  });

  dirs.addDir(directory);
}

//TODO: Report the results of scanning
export async function scanAllDirectories(dirs: Array<FileSystemHandle>) {
  //TODO: Removed async to get status reporting... not sure it's worth it.
  //TODO: If this stays like this, split permissions and traversal so approvals aren't interspersed randomly.
  console.log(`Scanning Directories:`)
  console.log(dirs);
  for (let i = 0; i < dirs.length; i++) {
    console.log(`Scanning ${dirs[i]}`)
    var directoryChain = new Array();
    directoryChain.push(dirs[i].name);
    await verifyPermission(dirs[i]).then(() =>
      traverseDirectory(directoryChain, dirs[i])
    );
  }
}

//TODO: Really need to keep full directory paths for keys
export async function traverseDirectory(directoryChain:Array<string>, directory:FileSystemHandle) {
  var enteredFirstDir = false;
  //@ts-ignore
  for await (const entry of directory.values()) {
    //@ts-ignore
    if (entry.kind == "directory") {
      if (excludedDirectories.includes(entry.name)) {
        continue;
      }

      if (enteredFirstDir) {
        directoryChain.pop();
      }
      enteredFirstDir = true;
      directoryChain.push(entry.name);
      traverseDirectory(JSON.parse(JSON.stringify(directoryChain)), entry);
    } else {
      if (entry.name.endsWith("stl") || entry.name.endsWith("STL")) {
        addMini(directoryChain, entry);
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

async function verifyPermission(fileHandle:FileSystemHandle) {
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
