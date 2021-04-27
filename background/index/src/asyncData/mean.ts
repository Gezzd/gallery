import axios, { Method } from "axios";
const CancelToken = axios.CancelToken;
declare global {
  interface Window {
    requestCancel: any;
  }
}

var cancelMap: Function[] = [];
window.requestCancel = (msg: string) => {
  cancelMap.forEach((cancel) => {
    cancel(msg);
  });
};

interface IFRequestParams {
  url: string;
  method: Method;
  data?: object;
  loadProgress?: (progressEvent: any) => void;
}

let request = ({ url, method, data, loadProgress }: IFRequestParams) => {
  return new Promise((reslove, reject) => {
    axios({
      method: method,
      url: url,
      data: String(method).toLowerCase() !== "get" ? data : {},
      params: String(method).toLowerCase() === "get" ? data : {},
      cancelToken: new CancelToken((c) => {
        // window.requestCancel = c;
        cancelMap.push(c);
      }),
      // `onUploadProgress` 允许为上传处理进度事件
      onUploadProgress({ total, loaded }) {
        // 对原生进度事件的处理
        loadProgress &&
          loadProgress({
            percent: Math.round((loaded / total) * 100).toFixed(2),
          });
      },
    })
      .then((res) => {
        reslove(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export default { request };
