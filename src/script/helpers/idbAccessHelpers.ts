import { get, set, values, createStore } from "idb-keyval";

import Fuse from "fuse.js";

import { Mini, Status } from "./Mini";

export async function addMini(
  directoryChain: string[],
  miniHandle: FileSystemHandle
): Promise<void> {
  console.log("[IDB] Adding Mini...");
  try {
    let key = JSON.parse(JSON.stringify(directoryChain));

    let mini = new Mini(key, miniHandle);
    let miniTest = await get(mini.fullPath.join("/"));

    if (miniTest) {
      return;
    } else {
      await set(mini.fullPath.join("/"), mini);
    }
  } catch (error) {
    console.error(error.message);
  }
}

export async function updateMini(mini: Mini): Promise<void> {
  console.log("[IDB] Updating Mini...");
  try {
    await set(mini.fullPath.join("/"), mini);
  } catch (error) {
    console.error(error);
  }
}

export async function getMini(name: string): Promise<Mini> {
  try {
    let mini = await get(name);

    if (mini) {
      return mini;
    }
  } catch (error) {
    console.log(error.message);
  }
  console.error("[IDB] Mini not found");
}

export async function getMiniList(
  searchString?: string
): Promise<Fuse.FuseResult<Mini>[] | Mini[]> {
  console.log("[IDB] Listing Minis");
  return values().then((values: Mini[]) => {
    let options = {
      includeScore: true,
      // equivalent to `keys: [['author', 'tags', 'value']]`
      keys: ["tags", "name"],
      threshold: 0.4,
    };

    let fuse = new Fuse(values, options);

    if (searchString) {
      return fuse.search(searchString);
    } else {
      return values;
    }
  });
}

export async function getPendingMinis(): Promise<Mini[]> {
  console.log("[IDB] Listing pending Minis");
  return values().then((values) => {
    return values.filter((value) => value.status == Status.Pending);
  });
}

export async function getDirectoryHandle(
  dir: string
): Promise<FileSystemHandle> {
  console.log("[IDB] Getting directory handle");
  return await get(dir, createStore("My-Mini-Index", "directory-list"));
}
