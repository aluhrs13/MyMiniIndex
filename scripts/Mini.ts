export class Mini {
  name: string;
  file: FileSystemHandle;
  status: Status;
  base64Image: string;
  tags: string[];
  url: string;

  constructor(name: string, file: FileSystemHandle) {
    this.name = name;
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
