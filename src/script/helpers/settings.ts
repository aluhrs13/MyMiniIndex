import { get, set, createStore } from "idb-keyval";

let settingsList: Map<string, string>;

export const settingsDescriptions = new Map([
  [
    "Relative Directory",
    'The directory on your computer that is "above" all your STL directories. Used to create a link to the location on your computer.',
  ],
  [
    "Excluded Directory Names",
    "List of sub-directories to not search, for example if you don't want to index anything in a folder named 'Presupported'",
  ],
]);

const settingsOptions = ["Relative Directory", "Excluded Directory Names"];

export async function initSettings(): Promise<Map<string, string>> {
  try {
    settingsList = new Map();
    const store = createStore("My-Mini-Index-Settings", "settings");
    for (const setting of settingsOptions) {
      let value = await get(setting, store);
      if (value != null) {
        settingsList.set(setting, value);
      } else {
        //Set defaults
        set(setting, "", store);
      }
    }
  } catch (error) {
    console.error("[Settings]" + error.message);
  }
  return settingsList;
}

export function getSetting(setting: string): string {
  if (settingsList.get(setting)) {
    return settingsList.get(setting);
  } else {
    return "";
  }
}

export function setSetting(setting: string, value: string): void {
  console.log("[Settings Helper] Updating " + setting + " to " + value);
  set(setting, value, createStore("My-Mini-Index-Settings", "settings"));
  settingsList.set(setting, value);
}
