export class Mini {
  fullPath: string[];
  name: string;
  file: FileSystemHandle;
  status: Status;
  base64Image: string;
  tags: string[];
  url: string;

  constructor(directoryPath: string[], file: FileSystemHandle) {
    this.fullPath = JSON.parse(JSON.stringify(directoryPath));
    this.fullPath.push(file.name);

    this.name = file.name.replaceAll("_", " ").replaceAll(".stl", "");
    this.file = file;
    this.status = Status.Pending;
    this.tags = new Array<string>();
    this.url = "";
  }
}

export enum Status {
  "Pending",
  "Rejected",
  "Approved",
}
