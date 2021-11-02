import {
  get,
  set,
  values,
  //@ts-ignore
} from "https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm";
import { Mini, Status } from "./Mini.js";

//TODO: Not really durable with only a single directory parent
//TODO: Add an ID field
//TODO: Add a directory field
export async function addMini(miniHandle: FileSystemHandle) {
  try {
    let mini = await get(miniHandle.name);

    if (mini) {
      return;
    }

    await set(miniHandle.name, new Mini(miniHandle.name, miniHandle));
  } catch (error) {
    console.log(error.message);
  }
}

export async function updateMini(mini: Mini) {
  try {
    await set(mini.name, mini);

    console.log(mini);
  } catch (error) {
    console.error(error);
  }
}

export async function getMini(name: string) {
  console.log(`Getting mini ${name} from idb`);
  try {
    let mini = await get(name);

    if (mini) {
      return mini;
    }
  } catch (error) {
    console.log(error.message);
  }
}

export async function getMiniList() {
  return values().then((values: Mini[]) => {
    return values.filter((value) => value.status == Status.Approved);
  });
}

export async function getPendingMinis() {
  return values().then((values) => {
    return values.filter((value) => value.status == Status.Pending);
  });
}
