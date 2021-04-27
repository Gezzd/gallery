import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Carousel, TabBar, Tabs } from "antd-mobile";
import methods, { deepCopy, hashKey } from "../../methods";
import WaterFallFlow from "../../components/waterFallFlow";
import { PhotoSlider } from "react-photo-view";
import "react-photo-view/dist/index.css";
import "./index.less";
import "antd-mobile/dist/antd-mobile.css";
import { importImageData, importHeaderImage } from "../../asyncData";
import Desc from "../../components/desc";
import ShareCode from "../../components/shareCode";
type stringArr = Array<string>; // string[]

const { debounce } = methods;

// 当前图片最大的ID
let currentId = 1;

// 获取滑动位置
function getScrollTop() {
  let scrollTop = 0,
    bodyScrollTop = 0,
    documentScrollTop = 0;
  if (document.body) {
    bodyScrollTop = document.body.scrollTop;
  }
  if (document.documentElement) {
    documentScrollTop = document.documentElement.scrollTop;
  }
  scrollTop =
    bodyScrollTop - documentScrollTop > 0 ? bodyScrollTop : documentScrollTop;
  return scrollTop;
}

//文档的总高度
function getScrollHeight() {
  let scrollHeight = 0,
    bodyScrollHeight = 0,
    documentScrollHeight = 0;
  if (document.body) {
    bodyScrollHeight = document.body.scrollHeight;
  }
  if (document.documentElement) {
    documentScrollHeight = document.documentElement.scrollHeight;
  }
  scrollHeight =
    bodyScrollHeight - documentScrollHeight > 0
      ? bodyScrollHeight
      : documentScrollHeight;
  return scrollHeight;
}

//浏览器视口的高度
function getWindowHeight(): number {
  let windowHeight = 0;
  if (document.compatMode === "CSS1Compat") {
    windowHeight = document.documentElement.clientHeight;
  } else {
    windowHeight = document.body.clientHeight;
  }
  return windowHeight;
}

// 设置页面滑动的位置
function setscrollPosition(): void {
  const scrollY = window.scrollY;
  sessionStorage.setItem("waterFallFlowY", scrollY.toString());
}

//根据缓存滑动到对应位置
function scollToWhere(): void {
  let y: number =
    (sessionStorage.getItem("waterFallFlowY") &&
      Number(sessionStorage.getItem("waterFallFlowY"))) ||
    0;
  window.scrollTo({ top: y });
}

function Index() {
  const [carouselData, setCarouselData] = useState<stringArr>([]);
  const [imageData, setImageData] = useState<stringArr>([]);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [current, setCurrent] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const [show, setShow] = useState({
    shareCode: false,
  });

  const tabs = useMemo(() => {
    return [{ title: <div>简介</div> }, { title: <div>图片</div> }];
  }, []);

  const getStatus = useCallback(() => {
    const local: any = window.location;
    let URLParams: any = new URL(local).searchParams;
    let sign: string = URLParams.get("sign");
    return sign;
  }, []);

  // 请求图片源
  const getCurrentImage = useCallback(() => {
    (async function () {
      if (currentId <= 0) {
        return false;
      }
      try {
        let data: any = await importImageData({
          status: getStatus(),
          id: currentId,
        });

        // 取出到当前图片链接
        const { code } = data;
        if (code === 1) {
          const gell = data.data;
          const source = gell.map((item: ReturnType<any>) => {
            const { thumbnail_url, origin_url } = item;
            const ob = {
              source: origin_url,
              thumbnail: thumbnail_url,
            };
            return ob;
          });

          // 如果没有图片数据 直接返回
          if (!source.length) {
            return;
          }

          setImageData((imageData) => {
            return imageData.concat(source);
          });

          scollToWhere();
          // 取出当前图片最大的ID
          currentId = Number(data.currentId);
        }
      } catch (error) {
        if (error.message) {
          // console.error(error);
          return;
        }
      }
    })();
  }, [getStatus]);

  // 当滑动快到底部时 去请求新的图片数据
  let loadNewImageThumb = useCallback((): ReturnType<any> => {
    let bottomFlag =
      getScrollTop() + getWindowHeight() >= getScrollHeight() ? true : false;
    if (bottomFlag) {
      getCurrentImage();
    }
  }, [getCurrentImage]);

  // const removeLoadNewImageThumb = useCallback(() => {
  //   window.removeEventListener("scroll", loadNewImageThumb);
  // }, [loadNewImageThumb]);

  useEffect(() => {
    // 移除滚动加载事件
    // let removeSrollEvent = function removeSrollEvent() {
    //   window.removeEventListener("scroll", loadNewImageThumb);
    //   // 移除页面滑动的位置
    //   sessionStorage.removeItem("waterFallFlowY");
    // };
    window.addEventListener(
      "scroll",
      debounce(loadNewImageThumb, 500, {}),
      false
    );
    window.addEventListener(
      "scroll",
      debounce(setscrollPosition, 500, {}),
      false
    );
    (async () => {
      if (!getStatus()) {
        return;
      }
      try {
        let res: ReturnType<any> = await importHeaderImage({
          status: getStatus(),
        });
        const { code } = res;
        if (code === 1) {
          const { data } = res;
          const { slidesImages } = data;
          if (slidesImages) {
            setCarouselData(JSON.parse(slidesImages));
          }
        }
      } catch (error) {
        if (error) {
          console.error(error);
        }
      }
      getCurrentImage();
    })();
    return () => {};
  }, [getCurrentImage, getStatus, loadNewImageThumb]);

  return (
    <>
      <div className="pageIndex">
        {/* <div>
          <Carousel
            dots={true}
            autoplay={false}
            dotStyle={{
              marginBottom: "5px",
              width: "16px",
              height: "4px",
              borderRadius: "0",
            }}
            dotActiveStyle={{
              marginBottom: "5px",
              width: "16px",
              height: "4px",
              borderRadius: "0",
            }}
            infinite={true}
            beforeChange={(from: number, to: number) => {
              // console.log(`slide from ${from} to ${to}`);
            }}
            afterChange={(index: number) => {
              // console.log("slide to", index);
            }}
            key={hashKey(24)}
            style={{ width: "100vw", height: "50vw", overflow: "hidden" }}
          >
            {carouselData &&
              carouselData.map((val) => (
                <img
                  key={hashKey(20)}
                  src={val}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  onLoad={() => {
                    // fire window resize event to change height
                    window.dispatchEvent(new Event("resize"));
                    // this.setState({ imgHeight: "auto" });
                  }}
                />
              ))}
          </Carousel>
        </div> */}

        <div>
          <Tabs
            tabs={tabs}
            initialPage={tabIndex}
            swipeable={false}
            onChange={(tab, index) => {
              setTabIndex(index);
              // console.log("onChange", index, tab);
            }}
            onTabClick={(tab, index) => {
              // console.log("onTabClick", index, tab);
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                padding: "10px 0 0 0",
              }}
            >
              <Desc />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              {!visible ? (
                <WaterFallFlow
                  imageData={imageData}
                  childrenItemClick={(i: number) => {
                    setCurrent(i);
                    setVisible(true);
                  }}
                  animate={""}
                  col={2}
                />
              ) : null}
            </div>
          </Tabs>
        </div>

        <div>
          <div className="bottom-text">技术支持</div>
        </div>

        <div className="bottom">
          <TabBar
            unselectedTintColor="#949494"
            tintColor="#33A3F4"
            barTintColor="white"
            swipeable={false}
          >
            <TabBar.Item
              title="分享"
              key="share"
              icon={
                <div>
                  <svg
                    className="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="1511"
                    width="22"
                    height="22"
                  >
                    <path
                      d="M911.6 651.6l0 209.2c0 36-30.4 66.2-66.2 66.2l-699.6 1.2c-35.8 0-65-29.2-65-65.2l1.2-699.6c0-35.8 30.4-66.2 66.2-66.2l387 0L535.2 20.2 148.2 20.2c-81.8 0-143 82.8-143 156.8l0 686c0 77.6 63 140.8 140.8 140.8l686 0c82 0 156.6-68.2 156.6-143L988.6 651.6 911.6 651.6 911.6 651.6zM730.2 60.8l288.6 289.2L730.2 639l0-165.2c0 0-286.4-31.8-453.6 206.6 0 0 52.6-454.4 453.6-454.4L730.2 60.8 730.2 60.8z"
                      p-id="1512"
                      fill="#8a8a8a"
                    ></path>
                  </svg>
                </div>
              }
              onPress={() => {
                let showFB = deepCopy(show);
                showFB.shareCode = true;
                setShow(showFB);
              }}
              data-seed="logId"
            ></TabBar.Item>
          </TabBar>
        </div>
      </div>
      <ShareCode
        show={show.shareCode}
        onClose={() => setShow({ shareCode: false })}
      />
      <PhotoSlider
        images={imageData.map((item: any) => {
          return { src: item.source };
        })}
        visible={visible}
        onClose={() => setVisible(false)}
        index={current}
        onIndexChange={setCurrent}
      />
    </>
  );
}
export default Index;
