
export class IPCService {

  public getFolderContents(relativePath: string, fileTypes: string[]) {
    return new Promise<string[]>((resolve, reject) => {
      window["ipcRenderer"].invokeGetFileList(relativePath, fileTypes)
        .then((result: string[]) => {
          resolve(result)
        })
        .catch((e) => {
          console.log(e);
        })
    });

  }
}