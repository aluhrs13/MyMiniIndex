import { renderSTL } from "./stl";
import { Mini } from "./Mini";
import { addMini, getDirectoryHandle } from "./idbAccessHelpers";
import { getExcludeDirectories } from "./settings";

const excludedDirectories = getExcludeDirectories();

//TODO: Report the results of scanning
export async function scanAllDirectories(dirs: Array<FileSystemHandle>) {
  console.log(`[File Access] Scanning Directories:`);
  console.log(dirs);
  for (let i = 0; i < dirs.length; i++) {
    console.log(`[File Access] Scanning ${dirs[i]}`);

    await verifyPermission(dirs[i]).then(() => {
      var directoryChain = new Array();
      directoryChain.push(dirs[i].name);
      traverseDirectory(directoryChain, dirs[i]);
    });
  }
}

export async function traverseDirectory(
  directoryChain: Array<string>,
  directory: FileSystemHandle
) {
  //@ts-ignore
  for await (const entry of directory.values()) {
    //@ts-ignore
    if (entry.kind == "directory") {
      if (excludedDirectories.includes(entry.name)) {
        continue;
      }
      directoryChain.push(entry.name);
      traverseDirectory(JSON.parse(JSON.stringify(directoryChain)), entry);
      directoryChain.pop();
    } else {
      if (entry.name.endsWith("stl") || entry.name.endsWith("STL")) {
        addMini(JSON.parse(JSON.stringify(directoryChain)), entry);
      }
    }
  }
}

export async function renderFile(entry: Mini, parentElement: HTMLElement) {
  let dirHandle = await getDirectoryHandle(entry.fullPath[0]);
  await verifyPermission(dirHandle);
  console.log("[File Access] Rendering " + entry.name);
  //@ts-ignore
  let file = await entry.file.getFile();
  var reader = new FileReader();

  reader.onload = async function (e) {
    if (e.target.readyState == FileReader.DONE) {
      await renderSTL(e.target.result, parentElement);
    }
  };

  //@ts-ignore
  await reader.readAsBinaryString(file);
}

export async function verifyPermission(fileHandle: FileSystemHandle) {
  const opts = {};
  //@ts-ignore
  opts.mode = "read";

  console.log("[File Access] Verifying Permissions " + fileHandle.name);

  if ((await fileHandle.queryPermission(opts)) === "granted") {
    return true;
  }

  if ((await fileHandle.requestPermission(opts)) === "granted") {
    return true;
  }

  return false;
}
