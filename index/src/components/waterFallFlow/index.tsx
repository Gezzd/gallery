import React, { memo, useMemo, useState, useEffect } from "react";
import Masonry from "react-masonry-component";
import methods from "../../methods";
import "./index.less";

type anyArray = Array<any>; // any[];
type stringArrasy = Array<string>; // string[]
interface propsInterFace {
  imageData: stringArrasy;
  col: number;
  animate?: string;
  childrenItemClick: Function;
}

const publicURL = "";
const { hashKey } = methods;
function WaterFallFlow(props: propsInterFace) {
  const { childrenItemClick } = props;
  const imageData = useMemo(() => {
    return props.imageData;
  }, [props.imageData]);

  const col: number = useMemo(() => {
    return props.col || 2;
  }, [props.col]);

  const [colImage, setColImage] = useState<anyArray>([]);
  const [imageWidth, setImageWidth] = useState(150);

  useEffect(() => {
    // 如果没有图片数据 直接返回销毁组件
    if (!imageData.length) {
      return () => {};
    }

    function initColImage() {
      // 根据屏幕宽度与列数 决定图片宽度
      let screenWidth = document.body.clientWidth | window.innerWidth;
      let calcImageWidth = Math.floor(screenWidth / col);
      setImageWidth(calcImageWidth);
      setColImage(imageData);
    }
    initColImage();
    return () => {};
  }, [imageData, col]);
  return (
    <Masonry
      style={{ width: "100%" }}
      options={{ resize: true }}
      disableImagesLoaded={false}
      updateOnEachImageLoad={false}
    >
      {colImage &&
        colImage.map((arrItem: any, i: number) => {
          return (
            <div
              onClick={() => {
                childrenItemClick(i);
              }}
              style={{
                width: `${imageWidth}px`,
                display: "inline-block",
                padding: "1px",
              }}
              key={hashKey(10)}
            >
              <img
                src={publicURL + arrItem.thumbnail}
                alt={""}
                style={{ width: "100%", verticalAlign: "top" }}
                onLoad={() => {}}
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  console.log(e);
                }}
              />
            </div>
          );
        })}
    </Masonry>
  );
}
export default memo(WaterFallFlow);
