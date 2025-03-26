import axios from "axios";

export class BackendService {
    BASE_URL: string = 'http://127.0.0.1:5000';
    
    async sendAxios() {
        axios.get(this.BASE_URL.concat('/test/vidya'))
          .then(response => {
            console.log("It says: ", response.data);
          })
          .catch(error => {
            console.log(error);
          });
      }
  }