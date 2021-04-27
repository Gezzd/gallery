let mode = "delevopment";
const ISLINE:boolean = mode === "production";
const BASE_URL = ISLINE ? window.location.origin : "/api";
const PUBLIC_URL = ISLINE
  ? BASE_URL + "/meiheng/pictrueDepot/background/background/index.php/gallery/GalleryBackground"
  : BASE_URL + "/work/gallery/background/background/index.php/gallery/GalleryBackground";
const URL = {
  upload: {
    image: PUBLIC_URL + "/upload",
    setSlideImage: PUBLIC_URL + "/setSlideImage",
    getSlideImage: PUBLIC_URL + "/getSlideImage",
  },
  gallery: {
    data: PUBLIC_URL + "/existingGallery",
    info: PUBLIC_URL + "/getGalleryInfo",
    setInfo: PUBLIC_URL + "/setGalleryInfo",
    getImages: PUBLIC_URL + "/getImageInfo",
    deleteImage: PUBLIC_URL + "/deleteImage",
    getMaxSlideNumber: PUBLIC_URL + "/getMaxSlideNumber",
    deleteSlideImage: PUBLIC_URL + "/deleteSlideImage"
  },
};
export default URL;
