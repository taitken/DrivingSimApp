/**
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';
import { BackendService } from './services/backend.service';

var backendService = new BackendService();

const setButton = document.getElementById('testButton')
setButton.addEventListener('click', () => {
  backendService.sendAxios();
})