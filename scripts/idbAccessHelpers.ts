import { get, set, values } from "idb-keyval";
import { Mini, Status } from "./Mini.js";

export async function addMini(
  directoryChain: string[],
  miniHandle: FileSystemHandle
) {
  try {
    var searchPath = JSON.parse(JSON.stringify(directoryChain));
    searchPath.push(miniHandle.name);
    let mini = await get(searchPath.join("\\"));

    if (mini) {
      return;
    }

    await set(searchPath.join("\\"), new Mini(directoryChain, miniHandle));
  } catch (error) {
    console.log(error.message);
  }
}

export async function updateMini(mini: Mini) {
  try {
    await set(mini.fullPath.join("\\"), mini);
  } catch (error) {
    console.error(error);
  }
}

export async function getMini(name: string) {
  try {
    let mini = await get(name);

    if (mini) {
      return mini;
    }
  } catch (error) {
    console.log(error.message);
  }
}

export async function getMiniList(searchString: string): Promise<Set<Mini>> {
  return values().then((values: Mini[]) => {
    if (searchString) {
      let arr1 = values
        .filter((value) => value.status == Status.Approved)
        .filter((value) => value.tags.includes(searchString));

      let arr2 = values
        .filter((value) => value.status == Status.Approved)
        .filter((value) =>
          value.name
            .toLowerCase()
            .split(" ")
            .includes(searchString.toLowerCase())
        );

      return new Set(arr1.concat(arr2));
    } else {
      return new Set(values.filter((value) => value.status == Status.Approved));
    }
  });
}

export async function getPendingMinis() {
  return values().then((values) => {
    return values.filter((value) => value.status == Status.Pending);
  });
}
