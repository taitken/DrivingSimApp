// See the Electron documentation for details on how to use preload scripts:

import { ipcRenderer } from "electron";

// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('myAPI', {
    root: process.env.INIT_CWD,
})
contextBridge.exposeInMainWorld("ipcRenderer", {
    invokeCopyFile: async () =>
        await ipcRenderer.invoke("copy_file_to_tmp"),
});

contextBridge.exposeInMainWorld("ipcRenderer", {
    invokeGetFileList: async (relativePath: string, fileTypes: string[]) =>
        await ipcRenderer.invoke("get_file_list", relativePath, fileTypes),
});

