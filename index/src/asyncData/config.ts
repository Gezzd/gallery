let mode = "dev";
const ISLINE:boolean = mode === "production";
const BASE_URL = ISLINE ? window.location.origin : "/api";
const PUBLIC_URL = ISLINE
  ? BASE_URL + "/meiheng/pictrueDepot/background/background/index.php/gallery/Gallery"
  : BASE_URL + "/work/gallery/background/background/index.php/gallery/Gallery";
const URL = {
  imageDatas: {
    all: PUBLIC_URL + '/exportImages',
    galleryInfo: PUBLIC_URL + '/getGalleryInfo',
    headerImage: PUBLIC_URL + '/getGalleryHeaderImage'
  }
};
export default URL;
