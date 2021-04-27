import mean from "./mean";
import config from "./config";
export const { request } = mean;

export const galleryImage = (data: object, loadProgress: any) => {
  let URL = config.upload.image;
  return request({ url: URL, method: "post", data: data, loadProgress });
};

export const getAllGalleryData = () => {
  let URL = config.gallery.data;
  return request({ url: URL, method: "get" });
};

export const getGalleryInfo = (data: any) => {
  let URL = config.gallery.info;
  return request({ url: URL, method: "get", data: data });
};

export const setGalleryInfo = (data: any) => {
  let URL = config.gallery.setInfo;
  return request({ url: URL, method: "post", data: data });
};

export const getSlideImage = (data: any) => {
  let URL = config.upload.getSlideImage;
  return request({ url: URL, method: "get", data: data });
};

export const getMaxSlideNumber = (data: any) => {
  let URL = config.gallery.getMaxSlideNumber;
  return request({ url: URL, method: "get", data: data });
};

export const setSlideImage = (data: any, loadProgress: any) => {
  let URL = config.upload.setSlideImage;
  return request({ url: URL, method: "post", data: data, loadProgress });
};

export const getImages = (data: any) => {
  let URL = config.gallery.getImages;
  return request({ url: URL, method: "get", data: data });
};

export const deleteImage = (data: any) => {
  let URL = config.gallery.deleteImage;
  return request({ url: URL, method: "get", data: data });
};

export const deleteSlideImage = (data: any) => {
  let URL = config.gallery.deleteSlideImage;
  return request({ url: URL, method: "get", data: data });
};

export default {
  galleryImage,
  getAllGalleryData,
  getGalleryInfo,
  setGalleryInfo,
  getSlideImage,
  setSlideImage,
  getImages,
  deleteImage,
  getMaxSlideNumber,
  deleteSlideImage,
};
