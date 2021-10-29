export class Mini {
  name: string;
  file: FileSystemHandle;
  status: Status;
  base64Image: string;

  constructor(name: string, file: FileSystemHandle) {
    this.name = name;
    this.file = file;
    this.status = Status.Pending;
  }
}

export enum Status {
  "Pending",
  "Rejected",
  "Approved",
}
