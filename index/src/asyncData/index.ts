import mean from "./mean";
import config from "./config";
const request = mean && mean.request;
export const importImageData = (data: any) => {
  let URL = config.imageDatas.all;
  return request({ url: URL, method: "get", data: data });
};

export const importGalleryInfo = (data: any) => {
  let URL = config.imageDatas.galleryInfo;
  return request({ url: URL, method: "get", data: data });
};

export const importHeaderImage = (data: any) => {
  let URL = config.imageDatas.headerImage;
  return request({ url: URL, method: "get", data: data });
};

export default { importImageData, importGalleryInfo, importHeaderImage};