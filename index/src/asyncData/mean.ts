import axios, { Method } from "axios";
interface requestArgument {
  url: string;
  method: Method;
  data?: any;
  loadProgress?: (progressEvent: any) => void;
}
// interface progressArgument{
//   total: any,
//   loaded: any
// }
let request = ({ method, url, data, loadProgress }: requestArgument) => {
  return new Promise((reslove, reject) => {
    axios({
      method: method,
      url: url,
      data: String(method).toLowerCase() !== 'get' ? data : {},
      params: String(method).toLowerCase() === 'get' ? data : {},
      // `onUploadProgress` 允许为上传处理进度事件
      // {total, loaded}
      onUploadProgress({ loaded, total }) {
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
