
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

  public copyFileToTmp() {
    return new Promise<File>((resolve, reject) => {
      window["ipcRenderer"].invokeCopyFile()
        .then((result: any) => {
          resolve(new File([result.buffer], result.fileName))
        })
        .catch((e) => {
          console.log(e);
        })
    });
  }
}