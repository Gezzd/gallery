import React, { useEffect, useCallback, useState, memo } from "react";
import "./index.less";
import "antd-mobile/dist/antd-mobile.css";
import { importGalleryInfo } from "../../asyncData";
function Desc() {
  const [galleryInfo, setGalleryInfo] = useState({
    name: "",
    address: "",
    holdingTime: "",
    desc: "",
    galleryDescribe: "暂时未有描述.",
  });

  const getStatus = useCallback(() => {
    const local: any = window.location;
    let URLParams: any = new URL(local).searchParams;
    let sign: string = URLParams.get("sign");
    return sign;
  }, []);

  useEffect(() => {
    (async () => {
      try {
        let res: ReturnType<any> = await importGalleryInfo({
          status: getStatus(),
        });
        const { code } = res;
        if (code === 1) {
          const { data } = res;
          setGalleryInfo(data);
        }
      } catch (error) {
        if (error) {
          console.log(error);
        }
      }
    })();

    return () => {};
  }, [getStatus]);
  return (
    <>
      <div className={"describe"}>
        <div className={"descirbeTitle"}></div>
        <div className={"descirbeItem"}>
          <svg
            className="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3667"
            width="20"
            height="20"
          >
            <path
              d="M800.512 474.944h-377.6a24.256 24.256 0 0 0-24.32 24.32c0 13.504 10.816 24.32 24.32 24.32h377.6c13.504 0 24.32-10.816 24.32-24.32a24.576 24.576 0 0 0-24.32-24.32z m-377.6 203.776a24.256 24.256 0 0 0-24.32 24.32c0 13.504 10.816 24.32 24.32 24.32h377.6c13.504 0 24.32-10.816 24.32-24.32a24.576 24.576 0 0 0-24.32-24.32h-377.6z"
              p-id="3668"
            ></path>
            <path
              d="M928.064 209.6h-252.736l-5.376-15.68c-37.824-104.832-110.272-129.728-164.288-132.416h-409.728a62.592 62.592 0 0 0-62.72 62.144v776.704c0 34.048 28.096 62.144 62.72 62.144h832.128a62.72 62.72 0 0 0 62.72-62.144v-628.608a62.272 62.272 0 0 0-62.72-62.144z m-848.384-56.256c0-48.128 17.856-41.6 90.816-41.6h261.056c110.784 0 139.456 23.808 160.512 61.056l15.68 36.736h-528.064v-56.192z m773.248 759.424H170.496c-74.56 0-86.464-5.952-86.464-85.952v-566.464h784.576c78.912 0 70.784 30.784 70.784 85.952v492.928c0.064 72.448-25.344 73.536-86.464 73.536z"
              p-id="3669"
            ></path>
            <path
              d="M196.992 536.576h78.912v-78.912h-78.912v78.912z m0 205.952h78.912v-78.912h-78.912v78.912z"
              p-id="3670"
            ></path>
          </svg>
          <span className="text">{galleryInfo.name}</span>
        </div>
        <div className={"descirbeItem"}>
          <svg
            className="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1919"
            width="20"
            height="20"
          >
            <path
              d="M808.442084 750.473323c-19.128663-12.814864-45.00603-23.89727-76.91374-32.93818-29.814026-8.447393-64.333214-14.988366-101.734032-19.411095 8.888438-13.238512 17.989723-27.236318 27.111474-41.869596 35.539424-57.014528 63.920822-111.757317 84.355223-162.708755 26.170033-65.25419 39.440267-124.84131 39.440267-177.104627 0-34.364669-7.223518-67.695798-21.468964-99.06832-13.684674-30.134321-33.229822-57.155744-58.09207-80.313164-24.708751-23.014156-53.446259-41.069371-85.416392-53.6632-32.979112-12.990872-67.976184-19.578917-104.018052-19.578917-36.042891 0-71.039963 6.588045-104.019075 19.578917-31.968086 12.593829-60.706617 30.649044-85.415368 53.6632-24.862247 23.157419-44.407396 50.178843-58.091046 80.313164-14.246469 31.372521-21.469987 64.703651-21.469987 99.06832 0 52.264341 13.269211 111.850437 39.440267 177.104627 20.434401 50.952462 48.815799 105.695251 84.355223 162.708755 9.123798 14.636349 18.22713 28.637224 27.117614 41.877783-37.374212 4.421706-71.868841 10.960633-101.664448 19.402909-31.906687 9.041934-57.784054 20.123316-76.912717 32.93818-37.658691 25.228591-45.563732 54.501288-45.563732 74.614371s7.90504 49.386804 45.562708 74.615395c19.128663 12.814864 45.00603 23.898293 76.91374 32.93818 59.391668 16.829294 137.445372 26.098401 219.785705 26.098401 82.33931 0 160.394037-9.269108 219.785705-26.098401 31.906687-9.04091 57.784054-20.123316 76.912717-32.93818 37.658691-25.228591 45.562708-54.502311 45.562708-74.615395S846.100776 775.701914 808.442084 750.473323zM511.705799 198.241017c66.177212 0 119.839389 53.661154 119.839389 119.838366 0 66.177212-53.661154 119.838366-119.839389 119.838366-66.176189 0-119.838366-53.661154-119.838366-119.838366C391.866411 251.90217 445.528588 198.241017 511.705799 198.241017zM511.743662 907.575384c-160.768567 0-291.096844-36.930097-291.096844-82.486666 0-37.220716 87.008656-68.678172 206.531843-78.945003 34.139541 46.972824 59.659775 76.699869 61.278645 78.576613l23.248494 26.960025 23.249517-26.960025c1.617847-1.876744 27.140127-31.606859 61.282738-78.582753 119.559003 10.260691 206.602452 41.723264 206.602452 78.951143C802.840506 870.645286 672.511205 907.575384 511.743662 907.575384z"
              p-id="1920"
            ></path>
          </svg>
          <span className={"text"}>{galleryInfo.address}</span>
        </div>
        <div className={"descirbeItem"}>
          <svg
            className="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2765"
            width="20"
            height="20"
          >
            <path
              d="M512 56.889c-250.311 0-455.111 204.8-455.111 455.111S261.689 967.111 512 967.111 967.111 762.311 967.111 512 762.311 56.889 512 56.889m0 853.333c-221.867 0-398.222-176.355-398.222-398.222S290.133 113.778 512 113.778 910.222 290.133 910.222 512 733.867 910.222 512 910.222"
              fill="#73777A"
              p-id="2766"
            ></path>
            <path
              d="M512 512V227.556h-56.889v341.333h284.445V512z"
              fill="#73777A"
              p-id="2767"
            ></path>
          </svg>
          <span className={"text"}>开幕时间 {galleryInfo.holdingTime}</span>
        </div>
        <div
          className={"descirbeContext"}
          style={{
            fontSize: "14px",
            textIndent: "20px",
            color: "#666",
            position: "relative",
            overflow: "hidden",
            transition: "all 2s",
            padding: "16px 0 16px 0",
            boxSizing: "content-box",
          }}
        >
          {galleryInfo.galleryDescribe}
        </div>
      </div>
    </>
  );
}
export default memo(Desc);