import React, { memo, useEffect, useState } from "react";
import asyncData from "../../asyncData";
import Masonry from "react-masonry-component";
import { message, Image, Modal } from "antd";
import {
  CloseCircleFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import Lazyload from "react-lazyload";
import { connect } from "react-redux";
import store from "../../store";
import { hashKey } from "../../methods";
import "animate.css";
import "./index.less";
const { confirm } = Modal;
const { getImages, deleteImage } = asyncData;
function EditImages(props: any) {
  let arr: any[] = [];
  const [imageData, setImageData] = useState(arr);
  // 筛选没被删除的图片
  const filterExistingGraphs = function filterExistingGraphs(
    id: string,
    graphsData: any[]
  ) {
    const result = graphsData.filter((item) => {
      return item.id !== id;
    });
    return result;
  };

  const deleteImg = async function deleteImg(id: string) {
    let newState: any = store.getState();
    let galleryStatus = newState.galleryStatus;
    let sign = galleryStatus && galleryStatus.status;
    let requestParams = {
      id: id,
      sign: sign,
    };
    confirm({
      title: "确定删除这张图片吗 ?",
      icon: <ExclamationCircleOutlined />,
      content: "图片删除后, 不可撤销, 请确认后执行",
      onOk() {
        return new Promise(async (resolve, reject) => {
          try {
            const result: any = await deleteImage(requestParams);
            const { code } = result;
            if (code !== 1) {
              reject();
            }
            resolve(true);
            setImageData(filterExistingGraphs(id, imageData));
          } catch (error) {
            reject();
          }
        }).catch(() => message.error("网络出问题了, 图片删除失败"));
      },
      onCancel() {},
    });
  };
  useEffect(() => {
    const galleryStatus = props.galleryStatus;
    if (!galleryStatus) {
      message.error("你还未选择图库呢 亲");
      return () => {};
    }

    async function setEditImage() {
      try {
        let allImages: any = await getImages({ sign: galleryStatus });
        if (allImages.code !== 1) {
          message.error("数据有误!");
          return false;
        }
        setImageData(allImages.data);
      } catch (error) {
        if (error) {
          if (error.message === "cancel") {
            return;
          }
          message.error("网络出错了");
          return false;
        }
      }
    }
    setEditImage();
    return () => {};
  }, [props.galleryStatus]);
  return (
    <Lazyload
      scroll={true}
      placeholder={
        <div style={{ padding: "32px 0" }} className={"rotate"}>
          <svg
            className="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2462"
            width="32"
            height="32"
          >
            <path
              d="M876.864 782.592c3.264 0 6.272-3.2 6.272-6.656 0-3.456-3.008-6.592-6.272-6.592-3.264 0-6.272 3.2-6.272 6.592 0 3.456 3.008 6.656 6.272 6.656z m-140.544 153.344c2.304 2.432 5.568 3.84 8.768 3.84a12.16 12.16 0 0 0 8.832-3.84 13.76 13.76 0 0 0 0-18.56 12.224 12.224 0 0 0-8.832-3.84 12.16 12.16 0 0 0-8.768 3.84 13.696 13.696 0 0 0 0 18.56zM552.32 1018.24c3.456 3.648 8.32 5.76 13.184 5.76a18.368 18.368 0 0 0 13.184-5.76 20.608 20.608 0 0 0 0-27.968 18.368 18.368 0 0 0-13.184-5.824 18.368 18.368 0 0 0-13.184 5.76 20.608 20.608 0 0 0 0 28.032z m-198.336-5.76c4.608 4.8 11.072 7.68 17.6 7.68a24.448 24.448 0 0 0 17.536-7.68 27.456 27.456 0 0 0 0-37.248 24.448 24.448 0 0 0-17.536-7.68 24.448 24.448 0 0 0-17.6 7.68 27.52 27.52 0 0 0 0 37.184z m-175.68-91.84c5.76 6.08 13.824 9.6 21.952 9.6a30.592 30.592 0 0 0 22.016-9.6 34.368 34.368 0 0 0 0-46.592 30.592 30.592 0 0 0-22.016-9.6 30.592 30.592 0 0 0-21.952 9.6 34.368 34.368 0 0 0 0 46.592z m-121.152-159.36c6.912 7.36 16.64 11.648 26.368 11.648a36.736 36.736 0 0 0 26.432-11.584 41.28 41.28 0 0 0 0-55.936 36.736 36.736 0 0 0-26.432-11.584 36.8 36.8 0 0 0-26.368 11.52 41.28 41.28 0 0 0 0 56zM12.736 564.672a42.88 42.88 0 0 0 30.784 13.44 42.88 42.88 0 0 0 30.784-13.44 48.128 48.128 0 0 0 0-65.216 42.88 42.88 0 0 0-30.72-13.44 42.88 42.88 0 0 0-30.848 13.44 48.128 48.128 0 0 0 0 65.216z m39.808-195.392a48.96 48.96 0 0 0 35.2 15.36 48.96 48.96 0 0 0 35.2-15.36 54.976 54.976 0 0 0 0-74.56 48.96 48.96 0 0 0-35.2-15.424 48.96 48.96 0 0 0-35.2 15.424 54.976 54.976 0 0 0 0 74.56zM168.32 212.48c10.368 11.008 24.96 17.408 39.68 17.408 14.592 0 29.184-6.4 39.552-17.408a61.888 61.888 0 0 0 0-83.84 55.104 55.104 0 0 0-39.616-17.408c-14.656 0-29.248 6.4-39.616 17.408a61.888 61.888 0 0 0 0 83.84zM337.344 124.8c11.52 12.16 27.712 19.264 43.968 19.264 16.256 0 32.448-7.04 43.968-19.264a68.672 68.672 0 0 0 0-93.184 61.248 61.248 0 0 0-43.968-19.264 61.248 61.248 0 0 0-43.968 19.264 68.736 68.736 0 0 0 0 93.184z m189.632-1.088c12.672 13.44 30.528 21.248 48.448 21.248s35.712-7.808 48.384-21.248a75.584 75.584 0 0 0 0-102.464A67.392 67.392 0 0 0 575.36 0c-17.92 0-35.776 7.808-48.448 21.248a75.584 75.584 0 0 0 0 102.464z m173.824 86.592c13.824 14.592 33.28 23.104 52.736 23.104 19.584 0 39.04-8.512 52.8-23.104a82.432 82.432 0 0 0 0-111.744 73.472 73.472 0 0 0-52.8-23.168c-19.52 0-38.912 8.512-52.736 23.168a82.432 82.432 0 0 0 0 111.744z m124.032 158.528c14.976 15.872 36.032 25.088 57.216 25.088 21.12 0 42.24-9.216 57.152-25.088a89.344 89.344 0 0 0 0-121.088 79.616 79.616 0 0 0-57.152-25.088c-21.184 0-42.24 9.216-57.216 25.088a89.344 89.344 0 0 0 0 121.088z m50.432 204.032c16.128 17.088 38.784 27.008 61.632 27.008 22.784 0 45.44-9.92 61.568-27.008a96.256 96.256 0 0 0 0-130.432 85.76 85.76 0 0 0-61.568-27.072c-22.848 0-45.44 9.984-61.632 27.072a96.192 96.192 0 0 0 0 130.432z"
              fill="#4285f4"
              p-id="2463"
            ></path>
          </svg>
        </div>
      }
    >
      <div className="editImages">
        <Masonry style={{ width: "100%" }}>
          {imageData.map((item: any) => {
            return (
              <div className="box" key={hashKey(20)}>
                <CloseCircleFilled
                  className="iconBounce"
                  style={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    zIndex: 1000,
                    fontSize: "20px",
                  }}
                  onClick={deleteImg.bind(null, item.id)}
                />
                <Image
                  src={item.thumbnail_url}
                  style={{ maxWidth: 128, width: "unset" }}
                  // width={100}
                  // height={100}
                  fallback={
                    "data:image/png;base64,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"
                  }
                  preview={{
                    src: item.origin_url,
                  }}
                />
              </div>
            );
          })}
        </Masonry>
      </div>
    </Lazyload>
  );
}

function mapStateToProps(state: any) {
  return {
    galleryStatus: state.galleryStatus && state.galleryStatus.status,
  };
}

function mapDispatchToProps(dispatch: Function) {
  return {};
}

export default memo(connect(mapStateToProps, mapDispatchToProps)(EditImages));
